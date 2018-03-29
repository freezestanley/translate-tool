const fs = require('fs'),
path = require('path'),
Excel = require('exceljs')

//解析需要遍历的文件夹，我这以E盘根目录为例
// var filePath = path.resolve('E:');

//调用文件遍历方法
// fileDisplay(filePath);

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay(filePath, callback){
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath,function(err,files){
        if(err){
            console.warn(err)
        }else{
            //遍历读取到的文件列表
            files.forEach(function(filename){
                //获取当前文件的绝对路径
                var filedir = path.join(filePath,filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir,function(eror,stats){
                    if(eror){
                        console.warn('获取文件stats失败');
                    }else{
                        var isFile = stats.isFile();//是文件
                        var isDir = stats.isDirectory();//是文件夹
                        console.log(filedir);
                        if(isFile){
                            // callback(filedir)
                        }
                        if(isDir){
                            fileDisplay(filedir, callback);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            });
        }
    });
}
// 删除文件夹
function deleteFolder (path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
  }
// fileDisplay(path.join(__dirname, '../src'), () => {})

// 得到文件树
function getDirTree( inputPath, callback){
    let result = []
    let files = fs.readdirSync(inputPath)
    for(file of files){
        let filePath = inputPath + '/' + file;
        let fileState = fs.statSync(filePath);
        if(fileState.isDirectory()){ // 如果是目录 递归
            result = result.concat(getDirTree(filePath, callback))
        }else{
            var ext = path.parse(file).ext
            if (ext == '.vue' || ext == '.js') {
                result.push(filePath)
            }
        }
    }
    // callback && callback(result);
    return result
}
// var aa = getDirTree(path.join(__dirname, '../src'))
// console.log(aa)
// 生成文件夹
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
  }
function writeFile (url, data) {
    var dir = path.parse(url).dir
    mkdirsSync(dir)
    fs.writeFileSync(url, data)
}

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

async function readXLSTFile(path) {
    var workbook = new Excel.Workbook();
    var bbb = workbook.xlsx.readFile(path)
    var ccc = await bbb
    var worksheet = ccc.getWorksheet(1)
    var data = []
    worksheet.columns.map((ele) => {
      var colum = []
      ele.eachCell({ includeEmpty: true }, function(cell, rowNumber) {
        colum[rowNumber - 1] = cell.value
      })
      data.push(colum)
    })
    return data
  }

module.exports = {
    fileDisplay,
    deleteFolder,
    getDirTree,
    writeFile,
    writeLSTFile,
    readXLSTFile
}