const fs = require('fs')
const path = require('path')
const wordbook = require('./wordbook')
const Excel = require('exceljs')

async function writeLSTFile(path, data = []) {
  var workbook = new Excel.Workbook();
  workbook.creator = 'Me';
  workbook.lastModifiedBy = 'Her';
  workbook.created = new Date(1985, 8, 30);
  workbook.modified = new Date();
  workbook.views = [
    {
      x: 0, y: 0, width: 10000, height: 20000,
      firstSheet: 0, activeTab: 1, visibility: 'visible'
    }
  ]
  var sheet = workbook.addWorksheet('language');
  sheet.columns = [
    { header: 'key', key: 'key' },
    { header: 'cn', key: 'cn' }
  ]
  data.map((e) => {
    sheet.addRow(e)
  })
  var result = await workbook.xlsx.writeFile(path)
  return result
}

writeLSTFile(path.join(__dirname + '/write.xlsx'), wordbook)