set -e

echo $OSTYPE

# Zero out result file
echo '' > ./test/cli/basic.result.css;

# Test with long flag
postcss-base-plugin ./test/cli/basic.css --output ./test/cli/basic.result.css

# Check result
if [[ "$OSTYPE" == "msys" ]]; then
	# CRLF on Windows makes it hard to test with base64 encoded sourcemaps
	echo 'did not compare actual output assuming exit 0 means everything is ok'
else
	git --no-pager diff --no-index --word-diff ./test/cli/basic.expect.css ./test/cli/basic.result.css
fi

# Reset result file
cat ./test/cli/basic.css > ./test/cli/basic.replace.css;

# Test replace
postcss-base-plugin ./test/cli/basic.replace.css -r

# Check result
if [[ "$OSTYPE" == "msys" ]]; then
	# CRLF on Windows makes it hard to test with base64 encoded sourcemaps
	echo 'did not compare actual output assuming exit 0 means everything is ok'
else
	git --no-pager diff --no-index --word-diff ./test/cli/basic.replace.css ./test/cli/basic.replace.expect.css
fi

# Zero out result file
echo '' > ./test/cli/basic.color.result.css;

# Test with short flags and plugin option
postcss-base-plugin ./test/cli/basic.css -o ./test/cli/basic.color.result.css -p '{ "color": "purple" }'

# Check result
if [[ "$OSTYPE" == "msys" ]]; then
	# CRLF on Windows makes it hard to test with base64 encoded sourcemaps
	echo 'did not compare actual output assuming exit 0 means everything is ok'
else
	git --no-pager diff --no-index --word-diff ./test/cli/basic.color.expect.css ./test/cli/basic.color.result.css
fi

# Zero out result file
echo '' > ./test/cli/basic.stdin.result.css;

# Test with stdin
cat ./test/cli/basic.css | postcss-base-plugin > ./test/cli/basic.stdin.result.css

# Check result
if [[ "$OSTYPE" == "msys" ]]; then
	# CRLF on Windows makes it hard to test with base64 encoded sourcemaps
	echo 'did not compare actual output assuming exit 0 means everything is ok'
else
	git --no-pager diff --no-index --word-diff ./test/cli/basic.stdin.expect.css ./test/cli/basic.stdin.result.css
fi

# Zero out result file
echo '' > ./test/cli/basic.no-map.result.css;

# Test source maps
postcss-base-plugin ./test/cli/basic.css --no-map  -o ./test/cli/basic.no-map.result.css

# Check result
git --no-pager diff --no-index --word-diff ./test/cli/basic.no-map.expect.css ./test/cli/basic.no-map.result.css

# Zero out result file
echo '' > ./test/cli/basic.external-map.result.css;
echo '' > ./test/cli/basic.external-map.result.css.map;

# Test source maps
cat ./test/cli/basic.css | postcss-base-plugin --map  -o ./test/cli/basic.external-map.result.css

# Check result
git --no-pager diff --no-index --word-diff ./test/cli/basic.external-map.expect.css ./test/cli/basic.external-map.result.css
git --no-pager diff --no-index --word-diff ./test/cli/basic.external-map.expect.css.map ./test/cli/basic.external-map.result.css.map

# Zero out result file
echo '' > ./test/cli/out/a.css
echo '' > ./test/cli/out/a.css.map
echo '' > ./test/cli/out/b.css
echo '' > ./test/cli/out/b.css.map

# Test source maps
postcss-base-plugin ./test/cli/src/a.css ./test/cli/src/b.css -m -d ./test/cli/out/

# Check result
git --no-pager diff --no-index --word-diff ./test/cli/out/a.css ./test/cli/out/a.expect.css
git --no-pager diff --no-index --word-diff ./test/cli/out/a.css.map ./test/cli/out/a.expect.css.map
git --no-pager diff --no-index --word-diff ./test/cli/out/b.css ./test/cli/out/b.expect.css
git --no-pager diff --no-index --word-diff ./test/cli/out/b.css.map ./test/cli/out/b.expect.css.map

# Zero out result file
echo '' > ./test/cli/out/concatenated.css

# Test concat
postcss-base-plugin ./test/cli/src/a.css ./test/cli/src/b.css > ./test/cli/out/concatenated.css

# Check result
git --no-pager diff --no-index --word-diff ./test/cli/out/concatenated.css ./test/cli/out/concatenated.expect.css

# Dump some content
echo 'foo' > ./test/cli/basic.failure.result.css

# Test with incorrect arugments
if postcss-base-plugin ./test/cli/basic.css --does-not-exist > ./test/cli/basic.failure.result.css; then
  echo 'Test should have failed';
	exit 1;
else
	# Check result
	git --no-pager diff --no-index --word-diff ./test/cli/basic.failure.result.css ./test/cli/basic.failure.expect.css
fi
