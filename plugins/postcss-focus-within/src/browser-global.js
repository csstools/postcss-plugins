import { default as focusWithinInit } from './browser';

(function (global) {
	global.focusWithinInit = focusWithinInit;
}('object' === typeof window && window || 'object' === typeof self && self || {}));
