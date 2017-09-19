'use strict';

// tooling
const postcss   = require('postcss');
const transform = require('./lib/transform');

// plugin
module.exports = postcss.plugin('postcss-nesting', () => {
	return (root) => root.walk(transform);
});
