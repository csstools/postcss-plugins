set -e

# Blank pseudo
npm run generate css-blank-pseudo selector ":blank" --workspace="@csstools/generate-test-cases"

# Has pseudo
npm run generate css-has-pseudo selector ":has(.foo)" --workspace="@csstools/generate-test-cases"
