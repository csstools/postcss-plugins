import postcss from "postcss"
import list from "postcss/lib/list"

import balancedMatch from "balanced-match"

function explodeSelector(pseudoClass, selector) {
  const position = locatePseudoClass(selector, pseudoClass)
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

const patternCache = {}

function locatePseudoClass(selector, pseudoClass) {
  patternCache[pseudoClass] = patternCache[pseudoClass]
    || new RegExp(`([^\\\\]|^)${pseudoClass}`)

  // The regex is used to ensure that selectors with
  // escaped colons in them are treated properly
  // Ex: .foo\:not-bar is a valid CSS selector
  // But it is not a reference to a pseudo selector
  const pattern = patternCache[pseudoClass]
  const position = selector.search(pattern)

  if (position === -1) {
    return -1
  }

  // The offset returned by the regex may be off by one because
  // of it including the negated character match in the position
  return position + selector.slice(position).indexOf(pseudoClass)
}

function explodeSelectors(pseudoClass) {
  return () => {
    return (css) => {
      css.walkRules(rule => {
        if (rule.selector && rule.selector.indexOf(pseudoClass) > -1) {
          rule.selector = explodeSelector(pseudoClass, rule.selector)
        }
      })
    }
  }
}

export default postcss.plugin("postcss-selector-not", explodeSelectors(":not"))
