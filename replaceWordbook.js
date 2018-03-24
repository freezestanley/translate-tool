const fs = require('fs')
const path = require('path')
const dir = require('./dir')
const Excel = require('exceljs')
var langdata = []
var baseUrl = path.join(__dirname, '../src')

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
  langdata = data
  var tt = dir.fileDisplay(baseUrl, read)
  return data
}

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
let dataset = new Set()
var num = 1
function apiloader (source, url) {
  var ext = path.parse(url).ext
  function removeNote (str) {
    var htmlnote = []
    var jsnote = []
    var template = []
    var script = []
    var r = /<!--[\w\W\r\n]*?-->/mi
    while ((arr = r.exec(str)) != null){
      htmlnote.push(arr[0])
      str = str.replace(r, '|@@|')
    }
    var reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g
    var result = str.replace(reg, function(word) { // 去除注释后的文本  
      if (/^\/{2,}/.test(word) || /^\/\*/.test(word)) {
        jsnote.push(word)
        return '|@-@|'
      } else {
        return word
      }  
    })
    if (ext != '.js') {
      var tpstart = result.indexOf('<template>')
      var tpend = result.lastIndexOf('</template>')
      var aa = result.slice(tpstart + 10, tpend)
      result = result.replace(aa, (word) => {
        template.push(word)
        return '|template|'
      })
      result = result.replace(/<script.*(?=>)(.|\n)*?<\/script>/, (word) => {
        script.push(word)
        return '|script|'
      })
    } else {
      script.push(result)
      result = '|script|'
    }

    return {result, htmlnote, jsnote, template, script}
  }

  function addNote (obj) {
    obj.result = obj.result.replace(/\|script\|/img, function(word) {
      return obj.script.shift()
    })
    obj.result = obj.result.replace(/\|template\|/img, function(word) {
      return obj.template.shift()
    })
    obj.result = obj.result.replace(/\|\@\@\|/img, function(word) {
      return obj.htmlnote.shift()
    })
    obj.result = obj.result.replace(/\|\@-\@\|/img, function(word) {
      return obj.jsnote.shift()
    })
    return obj.result
  } 
  
  // 分行处理
  function RegExpTest(obj, type) {
    var str = obj
    var re = /\n/g    
    var arr,start = 0, end, result = ''
    while ((arr = re.exec(str)) != null){
      end = arr.index
      var a = str.slice(start,end)
      if (/[\u4e00-\u9fa5]+/g.test(a)) {
        a = extract(a, type)
      }
      result += a
      start = end
    }
    result += str.slice(start)
    return result
  }
  // 转换代码行
  function extract (str, type) {
    console.log(langdata)
    var equet = /(\:)?[A-Za-z0-9_-]+[\s.]?\=[\s.]?[\"\']{0,2}[~,!\u4e00-\u9fa5A-Za-z0-9_-\s.]*[\"\']{0,2}}/ig
    var equet2 = /[A-Za-z0-9_-]+[\s.]?\:[\s.]?(\"|\')[\s.\u4e00-\u9fa5A-Za-z0-9!,~，。！]*(\"|\')/ig
    var equet3 = /(\"|\')[\s.\u4e00-\u9fa5A-Za-z0-9!,\/\|／~，。：！、\.；（）\(\)“”"]*[\u4e00-\u9fa5]+[\s.\u4e00-\u9fa5A-Za-z0-9!,~，。:：！、\.；（）\(\)“”"]*(\"|\')/ig
    var equet4 = /\>[\s.\u4e00-\u9fa5A-Za-z0-9!,~，。:：！、\.；（）\(\)“”"\/\|]*[\u4e00-\u9fa5]+[\s.\u4e00-\u9fa5A-Za-z0-9!,~，。:：！、\.；（）\(\)“”"]*\</ig
    var equet5 = /[A-Za-z0-9_-]+[\s.]?\=(\s)?[\"\']{0,2}[\s.\u4e00-\u9fa5A-Za-z0-9!,~，。:：！]*[\u4e00-\u9fa5]+[\s.\u4e00-\u9fa5A-Za-z0-9!,~，。:：！]*[\"\']{0,2}/ig
    // console.log(str)
    if (type == 't') {
      // 替换template内的
      while ((arr = equet4.exec(str)) != null){
        str = str.replace(arr[0], (word) => {
          console.log('template===' + word)
          var start = word.indexOf('>') + 1
          var end = word.lastIndexOf('<')
          var result = word.slice(start, end)
          let key = langdata[0][langdata[1].findIndex((ele) => ele === result)]
          return `>{{$t('abc${key}')}}<`
        })
      }
      // console.log(str)
      // 替换 props
      while ((arr = equet5.exec(str)) != null){
        str = str.replace(arr[0], (word) => {
          var result = word.split('=')[1]
          console.log('props===' + result[1])
          result = result.replace(/[\'\"]/ig, '')
          let key = langdata[0][langdata[1].findIndex((ele) => ele === result)]
          return`:${result[0]}="$t('abc${num++}')"` 
        })
      }
      // console.log(str)
    } else {
      // var equet9 = /(\"|\')[\s.\u4e00-\u9fa5A-Za-z0-9!,~，。：！、\.；（）\(\)“”"]*[\u4e00-\u9fa5]+[\s.\u4e00-\u9fa5A-Za-z0-9!,~，。:：！、\.；（）\(\)“”"]*(\"|\')/i
      var equ = /((\"|\')\S*[\u4e00-\u9fa5]+\S*(\"|\'))/i
      while ((arr = equ.exec(str)) != null){
        str = str.replace(arr[0], (word) => {
          var result = arr[0].replace(/[\'\"]/ig, '')
          let key = langdata[0][langdata[1].findIndex((ele) => ele === result)]
          return `i18n.t('abc${key}')`
        })
      }
    }
    return str
  }

  var aa = removeNote(source) // 去注释

  aa.template = aa.template.map(ele => {
    return RegExpTest(ele, 't')
  })
  aa.script = aa.script.map(ele => {
    return RegExpTest(ele, 's')
  })
  var dd = addNote(aa)        // 恢复注释
  var origin = path.join('./origin', path.relative(baseUrl, url))
  var dir = path.parse(origin).dir
  mkdirsSync(dir)
  fs.writeFileSync(origin, dd)
  // wordbook()
  return source
}

function read (url) {
  var ext = path.parse(url).ext
  if (ext == '.js' || ext == '.vue') {
    var data = fs.readFileSync(url).toString();
    apiloader(data, url)
  }
}

function wordbook () {
  var origin = path.join(__dirname, './wordbook.json')
  var dir = path.parse(origin).dir
  mkdirsSync(dir)
  var rs = Array.from(dataset, (e) => {
    return {"cn": e}
  })
  fs.writeFileSync(origin, JSON.stringify(rs))
}
//test start
// let pathff = path.join(__dirname, './demo.vue')
// var data = fs.readFileSync(pathff).toString();
// apiloader(data, pathff)

dir.deleteFolder(path.join(__dirname, '../origin'))
// fs.stat(path.join(__dirname, './wordbook.json'),function(eror,stats){
//   if (!eror) {
//     fs.unlinkSync(path.join(__dirname, './wordbook.json'));
//   }
// })
readXLSTFile(path.join(__dirname + '/write.xlsx'))