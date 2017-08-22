var postcss = require('postcss')

module.exports = postcss.plugin('postcss-wxss', function (opts) {
  opts = opts || {}

  // Work with options here

  var sels = {
    page: 'body',
    icon: 'wx-icon'
  }

  return root => {
    // console.log(root);
    // Transform CSS AST here
    root.walkRules(rule => {
      // Transform each rule here
      rule.selectors = rule.selectors.map(selector => {
        return selector
          .split(' ')
          .reduce((sum, item) => {
            if (sels[item]) {
              return sum + sels[item] + ' '
            } else {
              return sum + item + ' '
            }
          }, '')
          .trim()
      })
      rule.walkDecls(decl => {
        // Transform each property declaration here
        // decl.prop = decl.prop.split("").reverse().join("");
        // console.log(decl.value);
        decl.value = decl.value.replace(/\d+rpx/g, (match, offset, string) => {
          return `%%?${match}?%%`
        })
      })
    })
  }
})
