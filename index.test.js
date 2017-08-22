/* eslint-env jest */
var postcss = require('postcss')
var plugin = require('./')

function run (input, output, opts) {
  return postcss([plugin(opts)]).process(input).then(result => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
}

describe('transform built-in selectors', () => {
  it('icon', () => {
    return run('icon{}', 'wx-icon{}', {})
  })

  it('body', () => {
    return run('page{}', 'body{}', {})
  })
})

describe('transform value', () => {
  it('handles rpx', () => {
    return run('a{width: 2rpx;}', 'a{width: %%?2rpx?%%;}', {})
  })
})
