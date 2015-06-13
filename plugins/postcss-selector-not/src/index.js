import postcss from "postcss"
import list from "postcss/lib/list"

import balancedMatch from "balanced-match"

function explodeSelector(pseudoClass, selector) {
  const position = selector.indexOf(pseudoClass)
  if (selector && position > -1) {
    const pre = selector.slice(0, position)
    const matches = balancedMatch("(", ")", selector.slice(position))
    const selectors = []
    const bodySelectors = matches.body ?
      list
        .comma(matches.body)
        .reduce((acc, s) => [...acc, ...explodeSelector(pseudoClass, s)], [])
      : [""]
    const postSelectors = matches.post ? explodeSelector(pseudoClass, matches.post) : [""]
    postSelectors.forEach(postSelector => {
      bodySelectors.forEach(bodySelector => {
        selectors.push(`${pre}${pseudoClass}(${bodySelector})${postSelector}`)
      })
    })
    return selectors
  }
  return [selector]
}

function explodeSelectors(pseudoClass) {
  return (options = {}) => {
    return (css) => {
      css.eachRule(rule => {
        if (rule.selector && rule.selector.indexOf(pseudoClass) > -1) {
          rule.selector = explodeSelector(pseudoClass, rule.selector)
            .join("," + (options.lineBreak ? "\n" + rule.before : " "))
        }
      })
    }
  }
}


export default postcss.plugin("postcss-selector-not", explodeSelectors(":not"))
