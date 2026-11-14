import assert from 'node:assert';
import { generatedName } from '@csstools/generate-idents';

assert.ok(typeof generatedName === 'function');
