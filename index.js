var postcss = require('postcss')
var selectorParser = require('postcss-selector-parser')

var parse = (input, transform) => {
  return selectorParser(transform).process(input).result
}

module.exports = postcss.plugin('postcss-wxss', function (opts) {
  opts = opts || {}

  return (root, result) => {
    // Transform CSS AST here
    root.walkRules(rule => {
      // Transform each rule here
      rule.selectors = rule.selectors.map(selector => {
        return parse(selector, selectors => {
          selectors.walkTags(tag => {
            if (tag.value === 'page') {
              tag.value = 'body'
            } else {
              if (tag.value.indexOf('wx-') !== 0) {
                tag.value = 'wx-' + tag.value
              }
            }
          })
        })
      })

      rule.walkDecls(decl => {
        // Transform each property declaration here
        decl.value = decl.value.replace(/[+-]?[0-9]*\.?([0-9]*)rpx/g, (match) => {
          return `%%?${match}?%%`
        })
      })
    })
  }
})
