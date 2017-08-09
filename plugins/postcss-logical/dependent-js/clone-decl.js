const matchSide = require('./match-side');
const matchInsetPrefix = require('./match-inset-prefix');

module.exports = (decl, suffix, value) => decl.clone({
	prop: `${decl.prop.replace(matchSide, '$1')}${suffix}`.replace(matchInsetPrefix, ''),
	value
});
