import postcss from "postcss"
import list from "postcss/lib/list"

import balancedMatch from "balanced-match"

function explodeSelector(pseudoClass, selector) {
  const position = selector.indexOf(pseudoClass)
  if (selector && position > -1) {
    const pre = selector.slice(0, position)
    const matches = balancedMatch("(", ")", selector.slice(position))
    const bodySelectors = matches.body
      ? list
        .comma(matches.body)
        .map(s => explodeSelector(pseudoClass, s))
        .join(`)${pseudoClass}(`)
      : ""
    const postSelectors = matches.post
      ? explodeSelector(pseudoClass, matches.post)
      : ""

    return `${pre}${pseudoClass}(${bodySelectors})${postSelectors}`
  }
  return selector
}

function explodeSelectors(pseudoClass) {
  return () => {
    return (css) => {
      css.eachRule(rule => {
        if (rule.selector && rule.selector.indexOf(pseudoClass) > -1) {
          rule.selector = explodeSelector(pseudoClass, rule.selector)
        }
      })
    }
  }
}

export default postcss.plugin("postcss-selector-not", explodeSelectors(":not"))
