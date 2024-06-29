import { default as cssHasPseudo } from './browser';

(function (global) {
	global.cssHasPseudo = cssHasPseudo;
}('object' === typeof window && window || 'object' === typeof self && self || {}));
