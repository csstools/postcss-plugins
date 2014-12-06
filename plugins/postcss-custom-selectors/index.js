/**
 * 匹配自定义选择器
 * --foo, :--foo, ::--foo 三种类型
 * 注意：CSS 选择器区分大小写
 */
var re_CUSTOM_SELECTOR = /([^,]*?)((?::|::)?(?:--[\w-]+))([^,]*)/g

/**
 * 暴露插件
 */
module.exports = customSelector

/**
 * 读取和替换自定义选择器
 */
function customSelector(options) {
  return function(styles) {
    options = options || {}
    var extensions = options.extensions || {}
    var line_break = '\n'
    var map = {}
    var toRemove = []
    var customSelectors = {}

    // 读取自定义选择器
    styles.eachAtRule(function(rule) {
      if (rule.name !== "custom-selector") {
        return
      }

      var params = rule.params.split(" ")
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

    //控制选择器是否换行
    if (!options.lineBreak  && options.lineBreak == false) {
       line_break = ' '
    }

    // 转换自定义的选择器别名
    styles.eachRule(function(rule) {
      for (var prop in customSelectors) {
        if (rule.selector.indexOf(prop) >= 0) {
          customSelector = customSelectors[prop]

          // $2 = <extension-name> （自定义的选择器名称）
          rule.selector = rule.selector.replace(re_CUSTOM_SELECTOR, function($0, $1, $2, $3) {
            if ($2 == prop) {
              return customSelector.split(",").map(function(selector) {
                return $1 + selector.trim() + $3
              }).join("," + line_break)
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
}
