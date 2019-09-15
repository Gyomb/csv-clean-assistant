import { promises as fsp } from 'fs'
import { ipcMain } from 'electron'
import chardet from 'chardet'
import iconv from 'iconv-lite'

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

const init = function () {
  ipcMain.on('analyzeCsv', (event, path) => {
    openCsv(path).then((data) => {
      event.reply('analyzedCsv', data)
    }).catch(err => {
      console.error('An error occurred reading the file :' + err)
      event.reply('csvReadError', err)
    })
  })
}

export default {
  init
}
