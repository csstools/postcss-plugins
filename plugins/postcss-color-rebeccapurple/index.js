/**
 * Module dependencies.
 */
const postcss = require("postcss")
const valueParser = require("postcss-value-parser")
const color = "#639"

/**
 * PostCSS plugin to convert colors
 */
module.exports = postcss.plugin("postcss-color-rebeccapurple", () => (style) => {
  style.walkDecls((decl) => {
    const value = decl.value;

    if (value && value.indexOf("rebeccapurple") !== -1) {
      decl.value = valueParser(value).walk((node) => {
        if (node.type === "word" && node.value === "rebeccapurple") {
          node.value = color
        }
      }).toString()
    }
  })
})
