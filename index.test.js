/* eslint-env jest */
var postcss = require('postcss')
var plugin = require('./')

function run (input, output, opts) {
  return postcss([plugin(opts)]).process(input).then(result => {
    expect(result.css).toEqual(output)
    expect(result.warnings().length).toBe(0)
  })
}

describe('transform value', () => {
  it('handles rpx', () => {
    return run('a{width: 2rpx;}', 'wx-a{width: %%?2rpx?%%;}', {})
  })
  it('handles minus rpx', () => {
    return run('a{width: -2rpx;}', 'wx-a{width: %%?-2rpx?%%;}', {})
  })
  it('handles float rpx', () => {
    return run('a{width: 2.3rpx;}', 'wx-a{width: %%?2.3rpx?%%;}', {})
  })

  it('handles .number rpx', () => {
    return run('a{width: .3rpx;}', 'wx-a{width: %%?.3rpx?%%;}', {})
  })
})

describe('transform built-in selectors', () => {
  it('wx-icon', () => {
    return run('icon{}', 'wx-icon{}', {})
  })

  it('page', () => {
    return run('page{}', 'body{}', {})
  })
})

describe('grouping selectors', () => {
  it('space joined', () => {
    return run(
      'icon, #page, .page, page{}',
      'wx-icon, #page, .page, body{}',
      {}
    )
  })

  it('no space', () => {
    return run('icon,#page,.page,page{}', 'wx-icon,#page,.page,body{}', {})
  })
})

describe('combinators', () => {
  it('space joined ', () => {
    return run('page .page{}', 'body .page{}', {})
  })

  it('dot joined', () => {
    return run('page.page{}', 'body.page{}', {})
  })

  it('hash joined', () => {
    return run('page#page{}', 'body#page{}', {})
  })

  it('mixed', () => {
    return run('page.page#page{}', 'body.page#page{}', {})
  })
})

describe("don't transform", () => {
  it('class selectors', () => {
    return run('.page{}', '.page{}', {})
  })

  it('id selectors', () => {
    return run('#page{}', '#page{}', {})
  })

  it('tag start with "wx-"', () => {
    return run('wx-image{}', 'wx-image{}', {})
  })
})

describe('media query', () => {
  it('transform nested declarations, media query rpx ignored', () => {
    return run(
      '@media screen and (min-width: 480rpx) {page{width:2rpx}.page{}icon{}}',
      '@media screen and (min-width: 480rpx) {body{width:%%?2rpx?%%}.page{}wx-icon{}}',
      {}
    )
  })
})
