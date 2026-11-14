import assert from 'node:assert';
import { generateUniqueDashedIdent, hashFileBasenameAndDir } from '@csstools/generate-idents';

assert.ok(typeof generateUniqueDashedIdent === 'function');
assert.ok(typeof hashFileBasenameAndDir === 'function');
