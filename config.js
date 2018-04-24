var path = require('path')

// 用于存放excel转为json文件的路径
var resultPath = path.join(__dirname , './result/')
// 待转为json的excel文件路径
var excelPath = path.join(__dirname , './write.xlsx')
// 待抽取为excel的项目路径
var watiFiltProjectPath = path.join(__dirname , './demo.vue')


module.exports = {
  excelPath: excelPath,
  resultPath: resultPath,
  watiFiltProjectPath: watiFiltProjectPath
}