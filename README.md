# translate-tool
translate-tool

// 获得需要翻译的文件url列表
const dirRecord = dir.getDirTree(path.join(__dirname))

// 删除前次生成文件夹
dir.deleteFolder(path.join(__dirname, './neWrite'))

// 生成字典 xlsx文件
translate(dirRecord)

// 根据字典文件替换需要翻译的文件
replace(path.join(__dirname, './write.xlsx'), dirRecord)

// 测试
// translate([path.join(__dirname, './demo.vue')])
// replace(path.join(__dirname, './write.xlsx'), [path.join(__dirname, './demo.vue')])
