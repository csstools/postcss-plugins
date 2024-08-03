import assert from 'node:assert';
import { newMediaFeatureBoolean, newMediaFeaturePlain } from '@csstools/media-query-list-parser';
import { TokenType } from '@csstools/css-tokenizer';

assert.strictEqual(
	newMediaFeaturePlain('min-width', [TokenType.Dimension, '300px', 0, 0, { value: 300, unit: 'px' }]).toString(),
	'(min-width:300px)',
);

assert.strictEqual(
	newMediaFeatureBoolean('color').toString(),
	'(color)',
);
