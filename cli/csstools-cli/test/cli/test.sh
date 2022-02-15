set -e

# Zero out result file
echo '' > ./test/cli/basic.result.css;

csstools-cli css-has-pseudo ./test/cli/basic.css --output ./test/cli/basic.result.css

# Check result
git --no-pager diff --no-index --word-diff ./test/cli/basic.expect.css ./test/cli/basic.result.css

echo "pass csstools-cli"
