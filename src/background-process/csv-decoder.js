import { promises as fsp } from 'fs'
import { ipcMain } from 'electron'
import chardet from 'chardet'
import iconv from 'iconv-lite'
import csvParser from 'csvtojson'

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
  ipcMain.on('analyzeCsv', (event, path) => {
    var csvData = {}
    openCsv(path)
      .then(data => {
        csvData = data
        return decodeCsv(data.file)
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
