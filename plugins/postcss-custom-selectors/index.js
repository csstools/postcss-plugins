var postcss = require("postcss")
/**
 * 匹配自定义选择器
 * :--foo
 * 注意：CSS 选择器区分大小写
 */
var re_CUSTOM_SELECTOR = /([^,]*?)(:-{2,}[\w-]+)(.*)/g

// 匹配换行符与空白
var reBLANK_LINE       = /(\r\n|\n|\r)(\s*?\1)+/gi

/**
 * 暴露插件
 */
module.exports = postcss.plugin("postcss-custom-selectors", function(options) {
  /**
   * 插件配置
   */
  options = options || {}
  var extensions = options.extensions || {}
  var line_break = '\n'
  var map = {}
  var toRemove = []
  var customSelectors = {}

  /**
   * 读取和替换自定义选择器
   */
  return function(styles) {
    // 读取自定义选择器
    styles.eachAtRule(function(rule) {
      if (rule.name !== "custom-selector") {
        return
      }

      var params = rule.params.split(/\s+/)
        // @custom-selector = @custom-selector <extension-name> <selector>
        // map[<extension-name>] = <selector>

      var customName = params.shift()
      var string = rule.params
      string = string.replace(customName, "")
      customSelectors[customName] = string

      map[params.shift()] = params.join(" ")

      toRemove.push(rule)
    })

    // JS 中设置一个自定义选择器
    Object.keys(extensions).forEach(function(extension) {
      map[extension] = extensions[extension]
      customSelectors[extension] = extensions[extension]
    })

    // 转换自定义的选择器别名
    styles.eachRule(function(rule) {
      for (var prop in customSelectors) {
        if (rule.selector.indexOf(prop) >= 0) {
          customSelector = customSelectors[prop]

          // $2 = <extension-name> （自定义的选择器名称）
          rule.selector = rule.selector.replace(re_CUSTOM_SELECTOR, function($0, $1, $2, $3) {
            if ($2 === prop) {
              var newSelector = customSelector.split(",").map(function(selector) {
                return $1 + selector.trim() + $3
              })

              // 选择器不换行
              if (!options.lineBreak && options.lineBreak === false) {
                line_break = " "
                newSelector = newSelector.join("," + line_break)
              } else {
                // 选择器换行，同时替换多个换行为一个
                newSelector = newSelector.join("," + line_break + rule.before).replace(reBLANK_LINE, line_break)
              }
              return newSelector
            } else if ($2 !== prop) {
              console.log("Warning: The selector '" + $2 + "' is undefined in CSS!")
              return $2
            }
          })
        }
      }
    })

    // 删除 @custom-selector
    toRemove.forEach(function(rule) {
      rule.removeSelf()
    })

  }
})
