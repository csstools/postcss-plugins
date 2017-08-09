const cloneDecl = require('./clone-decl');
const cloneRule = require('./clone-rule');
const matchSide = require('./match-side');

const matchInsetPrefix = require('./match-inset-prefix');

// inset-block, margin-block, padding-block
module.exports['block'] = (decl, values) => [
	cloneDecl(decl, '-top', values[0]),
	cloneDecl(decl, '-bottom', values[1] || values[0])
];

// inset-block-start, margin-block-start, padding-block-start
module.exports['block-start'] = (decl) => {
	decl.prop = decl.prop.replace(matchSide, '$1-top').replace(matchInsetPrefix, '');
};

// inset-block-end, margin-block-end, padding-block-end
module.exports['block-end'] = (decl) => {
	decl.prop = decl.prop.replace(matchSide, '$1-bottom').replace(matchInsetPrefix, '');
};

// inset-inline, margin-inline, padding-inline
module.exports['inline'] = (decl, values) => 1 === values.length || 2 === values.length && values[0] === values[1]
? [
	cloneDecl(decl, '-left', values[0]),
	cloneDecl(decl, '-right', values[1] || values[0])
]
: [
	cloneRule(decl, 'ltr').append([
		cloneDecl(decl, '-left', values[0]),
		cloneDecl(decl, '-right', values[1] || values[0])
	]),
	cloneRule(decl, 'rtl').append([
		cloneDecl(decl, '-right', values[0]),
		cloneDecl(decl, '-left', values[1] || values[0])
	]),
];

// inset-inline-start, margin-inline-start, padding-inline-start
module.exports['inline-start'] = (decl) => [
	cloneRule(decl, 'ltr').append(
		cloneDecl(decl, '-left', decl.value)
	),
	cloneRule(decl, 'rtl').append(
		cloneDecl(decl, '-right', decl.value)
	)
];

// inset-inline-end, margin-inline-end, padding-inline-end
module.exports['inline-end'] = (decl) => [
	cloneRule(decl, 'ltr').append(
		cloneDecl(decl, '-right', decl.value)
	),
	cloneRule(decl, 'rtl').append(
		cloneDecl(decl, '-left', decl.value)
	)
];

// inset-start, margin-start, padding-start
module.exports['start'] = (decl, values) => [
	cloneRule(decl, 'ltr').append([
		cloneDecl(decl, '-top', values[0]),
		cloneDecl(decl, '-left', values[1] || values[0])
	]),
	cloneRule(decl, 'rtl').append([
		cloneDecl(decl, '-top', values[0]),
		cloneDecl(decl, '-right', values[1] || values[0])
	])
];

// inset-end, margin-end, padding-end
module.exports['end'] = (decl, values) => [
	cloneRule(decl, 'ltr').append([
		cloneDecl(decl, '-bottom', values[0]),
		cloneDecl(decl, '-right', values[1] || values[0])
	]),
	cloneRule(decl, 'rtl').append([
		cloneDecl(decl, '-bottom', values[0]),
		cloneDecl(decl, '-left', values[1] || values[0])
	])
];
