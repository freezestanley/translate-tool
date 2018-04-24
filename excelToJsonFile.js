const fs = require('fs')
const path = require('path')
const getWb = require('./newGetWb')
const dir = require('./dir')
const pathConfig = require('./config')

/**
 * 將語言excel转为json文件，excel格式为第一列为key，后面每列为语言，第一行为语言文件名
 */
async function toJsonFile(excelPath, resultPath){
  console.log(excelPath)
  let excelFile = await dir.readXLSTFile(excelPath)
  console.log(excelFile)
  excelFile.map((item, key) => {
    if (key !== 0) {
      let tempObj = {}
      item.map((sItem, sKey) => {
        // 从第二行开始写入对象
        if (sKey !== 0) {
          tempObj[excelFile[0][sKey]] = sItem
        }
      })
      dir.writeFile(resultPath+item[0] + '.json', 'export default ' + JSON.stringify(tempObj))
    }
  })
}
toJsonFile(pathConfig.excelPath, pathConfig.resultPath)