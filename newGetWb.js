const fs = require('fs')
const path = require('path')
// 清理模版
function split (data, url) {
  var ext = path.parse(url).ext
  var result = {
    "template": [],
    "script": [],
    "note": [],
    "jsnote": []
  }

  var r = /<!--[\w\W\r\n]*?-->/mi
  while ((arr = r.exec(data)) != null){
    result.note.push(arr[0])
    data = data.replace(arr[0], '|@@|')
  }
  var reg = /(\/{2,}.*)|(\/\*)(\s.|\S)+(\*\/)/g
  data = data.replace(reg, function(w) { // 去除注释后的文本  
    if (/^\/{2,}/.test(w) || /^\/\*/.test(w)) {
      result.jsnote.push(w)
      return '|@-@|'
    } else {
      return w
    }  
  })

  var reg1 = /(?<=<template>)[\s\S.]*(?=<\/template>)/ig
  while ((arr = reg1.exec(data)) != null){
    result.template.push(arr[0])
    data = data.replace(arr[0], '|template|')
  }
  data = data.replace(/<script.*(?=>)(.|\n)*?<\/script>/img, (word) => {
    result.script.push(word)
    return '|script|'
  })
  if (ext == '.js') {
    result.data = '|script|'
    result.script.push(data)
  }
  result.data = data
  return result
}
// 恢复模版
function assemble (obj, ext) {
  if (ext == '.js') {
    obj.data = obj.script.shift()
  } else {
    obj.data = obj.data.replace(/\|script\|/img, function(word) {
      return obj.script.shift()
    })
  }
  obj.data = obj.data.replace(/\|template\|/img, function(word) {
    return obj.template.shift()
  })
  obj.data = obj.data.replace(/\|\@\@\|/img, function(word) {
    return obj.note.shift()
  })
  obj.data = obj.data.replace(/\|\@-\@\|/img, function(word) {
    return obj.jsnote.shift()
  })
  return obj.data
}

module.exports = {
  assemble,
  split
}