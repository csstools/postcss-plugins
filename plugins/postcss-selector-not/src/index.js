import postcss from "postcss"
import list from "postcss/lib/list"

import balancedMatch from "balanced-match"

function explodeSelector(pseudoClass, selector) {
  if (selector && selector.indexOf(pseudoClass) > -1) {
    const start = `${pseudoClass}(`
    const end = ")"
    const matches = balancedMatch(start, end, selector)
    const selectors = []
    const bodySelectors = matches.body ?
      list
        .comma(matches.body)
        .reduce((acc, s) => [...acc, ...explodeSelector(pseudoClass, s)], {})
      : [""]
    const postSelectors = matches.post ? explodeSelector(pseudoClass, matches.post) : [""]
    postSelectors.forEach(postSelector => {
      bodySelectors.forEach(bodySelector => {
        selectors.push(`${matches.pre}${pseudoClass}(${bodySelector})${postSelector}`)
      })
    })
    return selectors
  }
  return [selector]
}

function explodeSelectors(pseudoClass) {
  return () => {
    return (css) => {
      css.eachRule(rule => {
        if (rule.selector && rule.selector.indexOf(pseudoClass) > -1) {
          rule.selector = explodeSelector(pseudoClass, rule.selector).join(", ")
        }
      })
    }
  }
}

export default postcss.plugin("postcss-selector-not", explodeSelectors(":not"))
