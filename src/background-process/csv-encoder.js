import { promises as fsp } from 'fs'
import { ipcMain } from 'electron'
import { parse as csvParser } from 'json2csv'

const init = function () {
  ipcMain.on('saveCsv', (event, descriptor) => {
    const writeOptions = {
      encoding: descriptor.encode ? descriptor.encode : 'utf-8'
    }
    const parseOptions = {
      withBOM: true
    }
    var csv = ''
    if (descriptor.header) parseOptions.fields = descriptor.header
    if (descriptor.delimiter) parseOptions.delimiter = descriptor.delimiter
    if (descriptor.excelString) parseOptions.excelString = true
    if (descriptor.saveMode !== 'overwrite') writeOptions.flag = 'wx'
    try {
      csv = csvParser(descriptor.json, parseOptions)
      fsp.writeFile(descriptor.newPath, csv, writeOptions)
        .then(status => event.reply('savedCsv', status))
        .catch(err => event.reply('csvSaveError', err))
    } catch (err) {
      console.log(err)
      event.reply('csvSaveError', err)
    }
  })
}

export default {
  init
}
