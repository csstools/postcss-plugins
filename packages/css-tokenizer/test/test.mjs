// Reader
import './test-reader.mjs';

// Code points
import './code-points/code-points.mjs';
import './code-points/ranges.mjs';

// Fuzz
import './fuzz/0001.mjs';

// Tokens
import './token/basic.mjs';
import './token/cdo.mjs';
import './token/comment.mjs';
import './token/is-token.mjs';
import './token/numeric.mjs';
import './token/string.mjs';
import './token/unicode-range.mjs';
import './token/url.mjs';

// Complex
import './complex/at-media-params.mjs';
import './complex/parse-error.mjs';

// Community
import './community/bootstrap.mjs';
import './community/open-props.mjs';
import './community/postcss-parser-tests.mjs';
import './community/token-types.mjs';

// Stringify
import './test-stringify.mjs';

// WPT
import './wpt/cdc-vs-ident-tokens.mjs';
import './wpt/decimal-points-in-numbers.mjs';
import './wpt/ident-three-code-points.mjs';
import './wpt/inclusive-ranges.mjs';

// Mutations
import './mutations/ident.mjs';

// css-tokenizer-tests
//
// Keep this as the last test,
// it is only intended to increase test coverage by double checking more obscure cases.
import './css-tokenizer-tests/test.mjs';
