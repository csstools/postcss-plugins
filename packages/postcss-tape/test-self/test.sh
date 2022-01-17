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
