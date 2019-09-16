import { promises as fsp } from 'fs'
import { ipcMain } from 'electron'
import { parse as csvParser } from 'json2csv'

const init = function () {
    ipcMain.on('saveCsv', (event, descriptor) => {
        const parseOptions = {
            withBOM: true
        }
        var csv = ""
        if(descriptor.header) parseOptions.fields = descriptor.header
        if(descriptor.delimiter) parseOptions.delimiter = descriptor.delimiter
        if(descriptor.excelString) parseOptions.excelString = true
        try {
            csv = csvParser(descriptor.json, parseOptions)
            console.log(csv)
            event.reply('savedCsv', csv)
        } catch (err) {
            console.log(err)
            event.reply('csvSaveError', err)
        }
    })
}

export default {
    init
}
  