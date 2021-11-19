set -e

# Zero out result file
echo '' > ./test/cli/basic.result.css;

# Test with long flag
postcss-lab-function ./test/cli/basic.css --output ./test/cli/basic.result.css

# Check result
git --no-pager diff --no-index --word-diff ./test/cli/basic.expect.css ./test/cli/basic.result.css

# Zero out result file
echo '' > ./test/cli/basic.result.css.map;

# Test with long flag
postcss-lab-function ./test/cli/basic.css -m --output ./test/cli/basic.result.css

# Check result
git --no-pager diff --no-index --word-diff ./test/cli/basic.expect.css.map ./test/cli/basic.result.css.map
