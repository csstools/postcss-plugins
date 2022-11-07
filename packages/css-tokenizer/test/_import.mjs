import { tokenizer } from '@csstools/css-tokenizer';

tokenizer({
	css: '.some { css: ""; }',
});
