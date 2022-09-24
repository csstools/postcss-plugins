const { tokenizer } = require('@csstools/css-tokenizer');

tokenizer({
	css: '.some { css: ""; }',
});
