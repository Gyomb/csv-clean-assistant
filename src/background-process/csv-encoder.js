import { promises as fsp } from 'fs'
import { ipcMain } from 'electron'
import { parse as csvParser } from 'json2csv'

async function writeCsv (path, csv, encoding) {
  fsp.writeFile(path, csv, encoding)
}

const init = function () {
  ipcMain.on('saveCsv', (event, descriptor) => {
    const parseOptions = {
      withBOM: true
    }
    const encoding = descriptor.encode ? descriptor.encode : 'utf-8'
    var csv = ''
    if (descriptor.header) parseOptions.fields = descriptor.header
    if (descriptor.delimiter) parseOptions.delimiter = descriptor.delimiter
    if (descriptor.excelString) parseOptions.excelString = true
    try {
      csv = csvParser(descriptor.json, parseOptions)
      console.log(csv)
      writeCsv('/Users/Gyomb/Downloads/tests-csv/results/file-test.csv', csv, encoding)
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
