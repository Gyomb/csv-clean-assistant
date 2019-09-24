import { promises as fsp } from 'fs'
import { ipcMain, app } from 'electron'
import chardet from 'chardet'
import iconv from 'iconv-lite'
import csvParser from 'csvtojson'
import path from 'path'

const userData = app.getPath('userData')
const importedFilesFolder = path.join(userData, 'imported-files')

async function checkAndCreateParentFolder (filepath) {
  let dirname = path.dirname(filepath)
  try {
    if (await fsp.access(dirname)) return true
  } catch {
    await checkAndCreateParentFolder(dirname) // Recursive call
    return fsp.mkdir(dirname)
  }
}

function checkEncoding (buffer) {
  return new Promise((resolve, reject) => {
    resolve(chardet.detect(buffer))
  })
}

function getCsvDelimiter (header, csvString) {
  function trimEscapedQuote (string) {
    return string.replace(/\\"/g, '')
  }
  try {
    const trimmedString = trimEscapedQuote(csvString).replace(/"/g, '')
    const delimiterStartIndex = trimEscapedQuote(header[0]).length
    const delimiterEndIndex = trimmedString.indexOf(trimEscapedQuote(header[1]))
    return trimmedString.substring(delimiterStartIndex, delimiterEndIndex)
  } catch (err) {
    console.error(err)
    return ','
  }
}

async function openCsv (path) {
  var fileBuffer = await fsp.readFile(path)
  var encoding = await checkEncoding(fileBuffer)
  return {
    file: iconv.decode(fileBuffer, encoding),
    encoding
  }
}

async function saveCsv (uid, content) {
  let filepath = path.join(importedFilesFolder, uid + '-original.csv')
  try {
    await checkAndCreateParentFolder(filepath)
    await fsp.writeFile(filepath, content, 'utf-8')
    return content
  } catch (error) {
    return error
  }
}

async function saveDecodedCsv (uid, content) {
  let filepath = path.join(importedFilesFolder, uid + '-decoded.json')
  try {
    await checkAndCreateParentFolder(filepath)
    await fsp.writeFile(filepath, JSON.stringify(content, null, 2), 'utf-8')
    return content
  } catch (error) {
    return error
  }
}

async function decodeCsv (csvString, delimiter) {
  const csvData = {}
  const params = {
    ignoreEmpty: true,
    delimiter: [';', ',', '|']
  }
  if (delimiter) {
    params.delimiter = delimiter
    csvData.delimiter = delimiter
  }
  return csvParser(params)
    .on('header', header => { csvData.header = header })
    .fromString(csvString)
    .then(json => {
      if (!csvData.delimiter) csvData.delimiter = getCsvDelimiter(csvData.header, csvString)
      csvData.json = json
      return csvData
    })
}

const init = function () {
  ipcMain.on('analyzeCsv', (event, { uid, filepath }) => {
    var csvData = {}
    openCsv(filepath)
      .then(data => {
        csvData = data
        return saveCsv(uid, data.file) // Returns only the file content
      })
      .then(filecontent => {
        return decodeCsv(filecontent)
      })
      .then(decodedData => {
        return saveDecodedCsv(uid, decodedData)
      })
      .then(decodedData => {
        csvData = { ...csvData, ...decodedData }
        event.reply('analyzedCsv', csvData)
      })
      .catch(err => {
        console.error('An error occurred reading the file :' + err)
        event.reply('csvReadError', err)
      })
  })
}

export default {
  init
}
