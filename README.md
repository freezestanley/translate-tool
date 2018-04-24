##所有配置在config.js里配置

//将项目里的中文语言字句转为excel，执行以下命令
#node index

// excel转为json文件，执行以下命令
# node excelToJsonFile
// 生成的json文件在result文件夹下

##方法说明
// 获得需要翻译的文件url列表
const dirRecord = dir.getDirTree(path.join(__dirname))
// 删除前次生成文件夹
dir.deleteFolder(path.join(__dirname, './neWrite'))
// 生成字典 xlsx文件
translate(dirRecord)
// 根据字典文件替换需要翻译的文件
replace(path.join(__dirname, './write.xlsx'), dirRecord)

