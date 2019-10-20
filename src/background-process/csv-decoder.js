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
  ipcMain.on('analyzeCsv', (event, { uid, filepath, parameters }) => {
    openAndDecodeStream(filepath, uid, parameters)
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

async function assertDelimiter (filepath, delimiterList) {
  try {
    let firstChunck = ''
    const csvPreReadStream = fs.createReadStream(filepath, 'utf-8')
    csvPreReadStream.on('data', chunk => {
      firstChunck += chunk
      if (firstChunck.length > 100) csvPreReadStream.close()
    })
    const gotFirstChunk = new Promise((resolve, reject) => {
      csvPreReadStream.on('close', () => {
        resolve(true)
      })
      csvPreReadStream.on('error', error => {
        csvPreReadStream.close()
        reject(error)
      })
    })
    const delimiterRelevance = await gotFirstChunk ? delimiterList.map(delimiter => {
      return {
        delimiter,
        relevance: firstChunck.split(delimiter).length
      }
    }) : []
    const relevantDelimiter = delimiterRelevance.reduce((delimiterCandidate, delimiter) => {
      return delimiterCandidate.relevance > delimiter.relevance ? delimiterCandidate : delimiter
    }) || {}
    return relevantDelimiter.delimiter || delimiterList[0]
  } catch (error) {
    throw error
  }
}

async function openAndDecodeStream (filepath, uid, { delimiter, noHeader }) {
  try {
    // SET PARAMETERS
    const csvOutputPath = path.join(importedFilesFolder, uid + '-original.csv')
    const jsonOutputPath = path.join(importedFilesFolder, uid + '-decoded.json')
    checkAndCreateParentFolderSync(csvOutputPath)
    // let csvString = ''
    let csvData = {}
    const csvEncoding = chardet.detectFileSync(filepath, { sampleSize: 1080 }) || 'utf-8'
    const delimiterList = [';', ',', '\t', '|']
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
    let noHeaderFirstRowDuplicate = {}
    if (noHeader) {
      csvParserParams.mapHeaders = ({ header, index }) => {
        let colName = 'column-' + (index + 1)
        noHeaderFirstRowDuplicate[colName] = header
        return colName
      }
    }
    csvParserParams.separator = delimiter || await assertDelimiter(filepath, delimiterList)
    // SET READING/WRITING STREAMS
    const csvReadStream = fs.createReadStream(filepath)
    const csvReadStreamForCsvCopy = new ReadableStreamClone(csvReadStream)
    const csvReadStreamForJson = new ReadableStreamClone(csvReadStream)
    const csvWriteStreamToCsv = fs.createWriteStream(csvOutputPath, 'utf-8')
    const csvWriteStreamToJson = fs.createWriteStream(jsonOutputPath, 'utf-8')

    const finalData = new Promise((resolve, reject) => {
      csvWriteStreamToJson
        .on('finish', () => {
          fs.appendFileSync(jsonOutputPath, '\n}')
          resolve(csvData)
        })
        .on('error', error => reject(error))
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
        csvWriteStreamToJson.write('{\n"header": ' + JSON.stringify(header))
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
        if (noHeader) {
          csvWriteStreamToJson.write('[\n' + JSON.stringify(noHeaderFirstRowDuplicate))
          csvData.json.push(noHeaderFirstRowDuplicate)
        }
      })
      .on('data', data => csvData.json.push(data))
      .pipe(JSONStream.stringify(
        noHeader ? ',' : '[\n',
        ',\n',
        '\n]\n'
      ))
      .pipe(csvWriteStreamToJson)
    return await finalData
  } catch (err) {
    console.error(err)
    throw err
  }
}

export default {
  init
}
