import { featureIsInsertedOrHasAPlugin } from '../../lib/feature-is-inserted-or-has-plugin.mjs';
import { strict as assert } from 'assert';
import { insertAfterKey, insertBeforeKey } from '../../own-keys/keys.mjs';

// regular features
assert.strictEqual(
	featureIsInsertedOrHasAPlugin({id: 'lab-function'}),
	true,
);

// unknown
assert.strictEqual(
	featureIsInsertedOrHasAPlugin({id: 'unknown'}),
	false,
);

// inserted features
assert.strictEqual(
	featureIsInsertedOrHasAPlugin({[insertBeforeKey]: true}),
	true,
);

assert.strictEqual(
	featureIsInsertedOrHasAPlugin({[insertAfterKey]: true}),
	true,
);


assert.strictEqual(
	featureIsInsertedOrHasAPlugin({id: 'toString'}),
	false,
);
