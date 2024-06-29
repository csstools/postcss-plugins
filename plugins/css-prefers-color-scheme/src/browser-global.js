import { default as prefersColorSchemeInit } from './browser';

(function (global) {
	global.prefersColorSchemeInit = prefersColorSchemeInit;
}('object' === typeof window && window || 'object' === typeof self && self || {}));
