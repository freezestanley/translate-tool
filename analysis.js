function analyTemp (str, dset, replace = false) {
  var props = /\s[A-Za-z0-9-_]+\s*=\s?"[^"]*[\u4e00-\u9fa5]+[^"]*"(?=(\s|>)?)/img
  while((arr = props.exec(str)) != null){
    str = str.replace(arr[0], (word) => {
      let group = word.split('=')
      let body = group[1].replace(/(^\s?(\"|\')*)|((\"|\')*$)/g, '')
      let head = group[0].replace(/(^\s*)|(\s*$)/g, '')
      if (!replace) {
        dset.add(body)
      } else {
        let key = dset[0][dset[1].findIndex((ele) => ele === body)]
        let bb1 = ` :${head}="i18n.t('${key}')"`
        return key? bb1 : word
      }
    })
  }

  var label = /(?<=<(\w+)>)[\u4e00-\u9fa5A-Za-z0-9-_－!,\/\|／~，。:：！、\.；（）\(\)“”"\s\]\[]*[\u4e00-\u9fa5]+[\u4e00-\u9fa5A-Za-z0-9!,\/\|／~，。：！、\.；（）\(\)“”"\s\]\[]*(?=<\/\1>)/ig
  str = str.replace(label, (word) => {
    if (!replace) {
      dset.add(word)
    } else {
      let key = dset[0][dset[1].findIndex((ele) => ele === word)]
      return key ? `{{$t("${key}")}}` : word
    }
  })
  
  var reg = /(?<=\>)[\u4e00-\u9fa5A-Za-z0-9-_－!,\/\|／~，。:：！、\.；（）\(\)“”"\]\[\s]*[\u4e00-\u9fa5]+[\u4e00-\u9fa5A-Za-z0-9-_!,\/\|／~，。：！、\.；（）\(\)“”"\]\[\s]*(?=<)/img
  while ((arr = reg.exec(str)) != null){
    str = str.replace(arr[0], (word) => {
      if (!replace) {
        dset.add(word)
      } else {
        let key = dset[0][dset[1].findIndex((ele) => ele === word)]
        return key ? `{{$t("${key}")}}` : word
      }
    })
  }

  
  var reg1 = /(?<={{)[^{}]+[\u4e00-\u9fa5]+[^{}]+(?=}})/img
  while ((arr = reg1.exec(str)) != null){
    let rge = /('|")[^'"]*[\u4e00-\u9fa5]+[^'"]*\1/img
    while ((ar = rge.exec(arr[0])) != null) {
      str = str.replace(ar[0], (word) => {
        if (!replace) {
          dset.add(word)
        } else {
          let key = dset[0][dset[1].findIndex((ele) => ele === word)]
          return key ? `$t("${key}")` : word
        }
      })
    }
  }
  // var props = /\s[A-Za-z0-9-_]+\s*=\s*"[\u4e00-\u9fa5A-Za-z0-9-_!,\/\|／~，。：！、\.；（）\(\)“”\]\[\s]*[\u4e00-\u9fa5]+[\u4e00-\u9fa5A-Za-z0-9-_!,\/\|／~，。：！、\.；（）\(\)“”\]\[\s]*"?/img
  // while ((arr = props.exec(str)) != null){
  //   str = str.replace(arr[0], (word) => {
  //     if (/\w*[\u4e00-\u9fa5]+\w*/g.test(word)) {
  //       let group = word.split('=')
  //       let body = group[1].replace(/(^(\"|\')*)|((\"|\')*$)/g, '')
  //       let head = group[0].replace(/(^\s*)|(\s*$)/g, '')
  //       dset.add(body)
  //       let bb1 = ` :${head}="i18n.t('abc')"`
  //       return bb1
  //     } else {
  //       return word
  //     }
  //   })
  // }
  
  return str
}
function analyScript (str, dset, replace = false) {
  if (str.indexOf('<script>') >= 0) {
    str = str.replace('<script>', '<script>\n import i18n from "@/i18n"\n')
  } else {
    str = 'import i18n from "@/i18n"\n' + str
  }
  
  var reg = /('|")[^'"]*[\u4e00-\u9fa5]+[^'"]*\1/img
  while ((arr = reg.exec(str)) != null){
    // console.log(arr)
    str = str.replace(arr[0], (word) => {
      // console.log(word)
      let res = word.replace(/(^\s?(\"|\')*)|((\"|\')*$)/g, '')
      if (!replace) {
        dset.add(res)
      } else {
        let key = dset[0][dset[1].findIndex((ele) => ele === res)]
        return key ? `i18n.t("${key}")` : word
      }
    })
  }
  return str
}
module.exports = {
  analyTemp,
  analyScript
}