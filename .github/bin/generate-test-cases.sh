set -e

# :blank pseudo
npm run generate css-blank-pseudo selector ":blank" --workspace="@csstools/generate-test-cases"

# :has pseudo
npm run generate css-has-pseudo selector ":has(.foo)" --workspace="@csstools/generate-test-cases"

# :dir pseudo
npm run generate postcss-dir-pseudo-class selector ":dir(ltr)" ":dir(rtl)" --workspace="@csstools/generate-test-cases"

# :any-link pseudo
npm run generate postcss-pseudo-class-any-link selector ":any-link" --workspace="@csstools/generate-test-cases"

# Color functional notation
npm run generate postcss-color-functional-notation value "rgba(178 34 34 / 1)" "hsl(120 100% 50% / 1)"  --workspace="@csstools/generate-test-cases"

# Double position gradients
npm run generate postcss-double-position-gradients value "linear-gradient(90deg, black 25% 50%, blue 50% 75%)"  --workspace="@csstools/generate-test-cases"
