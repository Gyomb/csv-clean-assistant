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
  if (delimiter) params.delimiter = delimiter
  return csvParser(params)
    .on('header', header => { csvData.header = header })
    .fromString(csvString)
    .then(json => {
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
