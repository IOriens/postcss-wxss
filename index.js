var postcss = require('postcss')
var selectorParser = require('postcss-selector-parser')

var transformSelector = (complexSelector, transformer) => {
  return selectorParser(transformer).process(complexSelector).result
}

module.exports = postcss.plugin('postcss-wxss', function (opts) {
  opts = opts || {}

  return (root, result) => {
    // Transform CSS AST here
    root.walkRules(rule => {
      // Transform each rule here

      // rule.selectors == comma seperated selectors
      // a, b.c {} => ["a", "b.c"]
      rule.selectors = rule.selectors.map(complexSelector =>
        // complexSelector => simpleSelectors
        // "a.b#c" => ["a", ".b", "#c"]
        transformSelector(complexSelector, simpleSelectors =>
          // only process type selector, leave alone class & id selectors
          simpleSelectors.walkTags(tag => {
            if (tag.value === 'page') {
              tag.value = 'body'
            } else if (tag.value.substring(0, 3) !== 'wx-') {
              tag.value = 'wx-' + tag.value
            }
          })
        )
      )

      // handle rpx unit
      rule.walkDecls(decl => {
        // Transform each property declaration here
        decl.value = decl.value.replace(/[+-]?[0-9]*\.?([0-9]*)rpx/g, match => {
          return `%%?${match}?%%`
        })
      })
    })
  }
})
