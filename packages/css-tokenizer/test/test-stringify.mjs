import assert from 'node:assert';
import { stringify } from '@csstools/css-tokenizer';

{
	assert.equal(stringify(), '');
}
