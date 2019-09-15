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
  const params = {
    ignoreEmpty: true,
    delimiter: [';', ',', '|']
  }
  if (delimiter) params.delimiter = delimiter
  return csvParser(params).fromString(csvString)
}

const init = function () {
  ipcMain.on('analyzeCsv', (event, path) => {
    var csvData = {}
    openCsv(path)
      .then(data => {
        csvData = data
        return decodeCsv(data.file)
      })
      .then(json => {
        csvData.file = json
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
