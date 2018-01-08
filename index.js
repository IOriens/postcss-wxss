var postcss = require('postcss')
var valueParser = require('postcss-value-parser')

var selectorParser = require('postcss-selector-parser')

var unit = valueParser.unit
var walk = valueParser.walk

var transformSelector = (complexSelector, transformer) => {
  return selectorParser(transformer).processSync(complexSelector)
}

function parseWord (node, opts) {
  const pair = unit(node.value)
  if (pair) {
    const num = Number(pair.number)
    const u = pair.unit.toLowerCase()
    if (u === 'rpx') {
      node.value = `%%?${num + u}?%%`
    }
  }
}

function isInsideKeyframes (rule) {
  return rule.parent && rule.parent.type === 'atrule' && /^(-\w+-)?keyframes$/.test(rule.parent.name)
}

var tranformValue = (decl, opts) =>
  valueParser(decl.value)
    .walk(node => {
      if (node.type === 'word') {
        parseWord(node, opts)
      } else if (node.type === 'function') {
        if (node.value === 'url') {
          return false
        }
        walk(node.nodes, n => {
          if (n.type === 'word') {
            parseWord(n, opts)
          }
        })
        return false
      }
    })
    .toString()

module.exports = postcss.plugin('postcss-wxss', function (opts) {
  opts = opts || {}

  return (root, result) => {
    // Transform CSS AST here
    root.walkRules(rule => {
      // Transform each rule here

      if (!isInsideKeyframes(rule)) {
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
      }

      // handle rpx unit
      rule.walkDecls(decl => {
        // Transform each property declaration here
        // console.log(decl)
        // decl.value = decl.value.replace(/[+-]?[0-9]*\.?([0-9]*)rpx/g, match => {
        //   return `%%?${match}?%%`
        // })

        decl.value = tranformValue(decl, opts)
      })
    })
  }
})
