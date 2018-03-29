const fs = require('fs')
const path = require('path')
const getWb = require('./newGetWb')
const dir = require('./dir')
const analy = require('./analysis')

const dirRecord = dir.getDirTree(path.join(__dirname, '../src'))
function translate (arr) {
  console.log('start.....')
  let dataset = new Set()
  function trans () {
    if (arr.length <= 0) return
    let ele = arr.shift()
    console.log('translate: ' + ele)
    var ext = path.parse(ele).ext
    if (ext == '.vue' || ext == '.js') {
      let data = fs.readFileSync(ele).toString()
      var aa = getWb.split(data, ele)
      aa.template = aa.template.map((ele) => {
        return analy.analyTemp(ele, dataset)
      })
      aa.script = aa.script.map((ele) => {
        return analy.analyScript(ele, dataset)
      })
      // var bb = getWb.assemble(aa, ext)
      // var baseUrl = path.join(__dirname, '../src')
      // var url = path.join('./neWrite', path.relative(baseUrl, ele))
      // dir.writeFile(url, bb)
      trans()
    }
  }
  trans()
  var rs = Array.from(dataset, (e, idx) => {
    return {"cn": e, "key": `key${idx}`}
  })
  dir.writeLSTFile(path.join(__dirname + '/write.xlsx'), rs)
  console.log('done.....')
}

dir.deleteFolder(path.join(__dirname, './neWrite'))
// translate(dirRecord)
// translate([path.join(__dirname, './demo.js')])

async function replace(url, arr) {
  let dirdata = await dir.readXLSTFile(url)
  console.log('start.....')
  function trans () {
    if (arr.length <= 0) return
    let ele = arr.shift()
    console.log('translate: ' + ele)
    var ext = path.parse(ele).ext
    if (ext == '.vue' || ext == '.js') {
      let data = fs.readFileSync(ele).toString()
      var aa = getWb.split(data, ele)
      aa.template = aa.template.map((ele) => {
        return analy.analyTemp(ele, dirdata, true)
      })
      aa.script = aa.script.map((ele) => {
        return analy.analyScript(ele, dirdata, true)
      })
      var bb = getWb.assemble(aa, ext)
      var baseUrl = path.join(__dirname, '../src')
      var url = path.join('./neWrite', path.relative(baseUrl, ele))
      dir.writeFile(url, bb)
      trans()
    }
  }
  trans()
  console.log('done.....')
}
replace(path.join(__dirname, './write.xlsx'), dirRecord)

