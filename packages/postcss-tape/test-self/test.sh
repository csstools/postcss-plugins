# Run tests as if local.
unset GITHUB_ACTIONS

# region:Basic
set +e

echo "" > ./test-self/basic.result.log

node ./test/basic.mjs > ./test-self/basic.result.log 2>&1
echo "$?" > ./test-self/basic.result.code

set -e
git --no-pager diff --no-index --word-diff ./test-self/basic.expect.log ./test-self/basic.result.log
git --no-pager diff --no-index --word-diff ./test-self/basic.expect.code ./test-self/basic.result.code
# endregion:Basic

# region:Basic with diff in expect
set +e

echo "" > ./test-self/basic.with-diff-in-expect.result.log

node ./test/basic.with-diff-in-expect.mjs > ./test-self/basic.with-diff-in-expect.result.log 2>&1
echo "$?" > ./test-self/basic.with-diff-in-expect.result.code

set -e
git --no-pager diff --no-index --word-diff ./test-self/basic.with-diff-in-expect.expect.log ./test-self/basic.with-diff-in-expect.result.log
git --no-pager diff --no-index --word-diff ./test-self/basic.with-diff-in-expect.expect.code ./test-self/basic.with-diff-in-expect.result.code
# endregion:Basic with diff in expect

# region:Basic without expect
set +e

echo "" > ./test-self/basic.without-expect.result.log

node ./test/basic.without-expect.mjs > ./test-self/basic.without-expect.result.log 2>&1
echo "$?" > ./test-self/basic.without-expect.result.code

set -e
git --no-pager diff --no-index --word-diff ./test-self/basic.without-expect.expect.log ./test-self/basic.without-expect.result.log
git --no-pager diff --no-index --word-diff ./test-self/basic.without-expect.expect.code ./test-self/basic.without-expect.result.code
# endregion:Basic without expect

# region:Basic with warnings
set +e

echo "" > ./test-self/basic.with-warnings.result.log

node ./test/basic.with-warnings.mjs > ./test-self/basic.with-warnings.result.log 2>&1
echo "$?" > ./test-self/basic.with-warnings.result.code

set -e
git --no-pager diff --no-index --word-diff ./test-self/basic.with-warnings.expect.log ./test-self/basic.with-warnings.result.log
git --no-pager diff --no-index --word-diff ./test-self/basic.with-warnings.expect.code ./test-self/basic.with-warnings.result.code
# endregion:Basic with warnings
