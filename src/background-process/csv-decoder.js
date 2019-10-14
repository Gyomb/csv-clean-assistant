import fs from 'fs'
import { ipcMain, app } from 'electron'
import chardet from 'chardet'
import iconv from 'iconv-lite'
import csvParser from 'csv-parser'
import path from 'path'
import { Transform } from 'stream'
import ReadableStreamClone from 'readable-stream-clone'
import JSONStream from 'JSONStream'

class DecodeStream extends Transform {
  constructor (decodeTo, options) {
    super(options)
    this.decodeTo = decodeTo
  }

  _transform (chunk, encoding, callback) {
    chunk = iconv.decode(chunk, this.decodeTo)
    callback(null, chunk)
  }
}

const userData = app.getPath('userData')
const importedFilesFolder = path.join(userData, 'imported-files')

const init = function () {
  ipcMain.on('analyzeCsv', (event, { uid, filepath }) => {
    openAndDecodeStream(filepath, uid)
      .then(decodedData => {
        event.reply('analyzedCsv', decodedData)
      })
      .catch(err => {
        console.error('An error occurred reading the file :' + err)
        event.reply('csvReadError', err)
      })
  })
}

function checkAndCreateParentFolderSync (filepath) {
  let dirname = path.dirname(filepath)
  try {
    fs.accessSync(dirname)
    return true
  } catch (err) {
    if (checkAndCreateParentFolderSync(dirname)) { // Recursive call
      return fs.mkdirSync(dirname)
    }
    return err
  }
}

const openAndDecodeStream = (filepath, uid, delimiter) => {
  return new Promise((resolve, reject) => {
    // SET PARAMETERS
    try {
      const csvOutputPath = path.join(importedFilesFolder, uid + '-original.csv')
      const jsonOutputPath = path.join(importedFilesFolder, uid + '-decoded.json')
      checkAndCreateParentFolderSync(csvOutputPath)
      // let csvString = ''
      let csvData = {}
      const csvEncoding = chardet.detectFileSync(filepath, { sampleSize: 1080 }) || 'utf-8'
      let existingHeaders = []
      const dedupesValue = (value, referenceList) => {
        if (referenceList.includes(value)) {
          const dedupePattern = /(?:-(\d+))|$/
          const dedupeIndex = Number(value.match(dedupePattern)[1]) + 1 || 1
          return dedupesValue(value.replace(dedupePattern, '-' + dedupeIndex), referenceList)
        }
        referenceList.push(value)
        return value
      }
      const csvParserParams = {
        separator: ';',
        mapHeaders: ({ header, index }) => {
          let safeHeader = header.replace(/[^\w\u00C0-\u017F -]/g, '')
          return dedupesValue(safeHeader, existingHeaders)
        }
      }
      if (delimiter) {
        csvParserParams.separator = delimiter
      }

      // SET READING/WRITING STREAMS
      const csvReadStream = fs.createReadStream(filepath)
      const csvReadStreamForCsvCopy = new ReadableStreamClone(csvReadStream)
      const csvReadStreamForJson = new ReadableStreamClone(csvReadStream)
      const csvWriteStreamToCsv = fs.createWriteStream(csvOutputPath, 'utf-8')
      const csvWriteStreamToJson = fs.createWriteStream(jsonOutputPath, 'utf-8')

      csvWriteStreamToJson
        .on('ready', () => {
          if (csvWriteStreamToJson.bytesWritten === 0) csvWriteStreamToJson.write('{\n')
        })
        .on('finish', () => {
          fs.appendFileSync(jsonOutputPath, '\n}')
          resolve(csvData)
        })
      // READ/WRITE CSV
      csvReadStreamForCsvCopy.on('data', chunk => {
        // csvData.file += chunk
        csvWriteStreamToCsv.write(chunk)
      })

      // READ CSV / CONVERT / WRITE JSON
      csvReadStreamForJson
        .pipe(new DecodeStream(csvEncoding))
        .pipe(csvParser(csvParserParams))
        .on('headers', (header) => {
          csvWriteStreamToJson.write('"header": ' + JSON.stringify(header))
          csvWriteStreamToJson.write(`,\n"encoding": "${csvEncoding}"`)
          csvWriteStreamToJson.write(`,\n"delimiter": "${csvParserParams.separator}"`)
          csvWriteStreamToJson.write(',\n"json": ')
          csvData = {
            ...csvData,
            encoding: csvEncoding,
            delimiter: csvParserParams.separator,
            header,
            json: []
          }
        })
        .on('data', data => csvData.json.push(data))
        .pipe(JSONStream.stringify())
        .pipe(csvWriteStreamToJson)
    } catch (err) {
      console.error(err)
      reject(err)
    }
  })
}

export default {
  init
}
