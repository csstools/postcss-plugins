import assert from 'node:assert';
import { generateUniqueIdent, hashFileBasenameAndDir } from '@csstools/generate-idents';

assert.ok(typeof generateUniqueIdent === 'function');
assert.ok(typeof hashFileBasenameAndDir === 'function');
