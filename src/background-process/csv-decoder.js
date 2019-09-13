import fs from 'fs'
import { ipcMain } from 'electron'

const init = function () {
  ipcMain.on('analyzeCsv', (event, path) => {
    fs.readFile(path, 'utf-8', (err, data) => {
      if (err) {
        console.error('An error occurred reading the file :' + err.message)
        event.reply('csvReadError', err.message)
      }
      event.reply('analyzedCsv', data)
    })
  })
}

export default {
  init
}
