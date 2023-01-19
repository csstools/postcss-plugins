import assert from 'assert';
import { stringify } from 'querystring';

{
	assert.equal(stringify(null), '');
	assert.equal(stringify(undefined), '');
	assert.equal(stringify(), '');
}
