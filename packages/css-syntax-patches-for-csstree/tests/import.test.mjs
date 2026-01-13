import assert from 'node:assert';
import syntax_patches from '@csstools/css-syntax-patches-for-csstree' with { type: 'json' };

assert.ok(syntax_patches.next);
