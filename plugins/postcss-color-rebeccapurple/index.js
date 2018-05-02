/**
 * Module dependencies.
 */
const postcss = require("postcss")
const valueParser = require("postcss-values-parser")
const color = "#639"
const regexp = /(^|[^\w-])rebeccapurple([^\w-]|$)/

/**
 * PostCSS plugin to convert colors
 */
module.exports = postcss.plugin("postcss-color-rebeccapurple", () => (style) => {
  style.walkDecls((decl) => {
    const value = decl.value;

    if (value && regexp.test(value)) {
      const ast = valueParser(value).parse()

      ast.walk(node => {
        if (node.type === "word" && node.value === "rebeccapurple") {
          node.value = color
        }
      })

      decl.value = ast.toString()
    }
  })
})
