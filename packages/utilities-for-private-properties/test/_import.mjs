import assert from 'node:assert';
import { createPrivatePropertyTranspiler } from '@csstools/utilities-for-private-properties';

assert.ok(typeof createPrivatePropertyTranspiler === 'function');
