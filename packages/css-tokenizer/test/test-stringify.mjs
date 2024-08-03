import assert from 'node:assert';
import { stringify } from 'querystring';

{
	assert.equal(stringify(null), '');
	assert.equal(stringify(undefined), '');
	assert.equal(stringify(), '');
}
