const matchSize = require('./match-size');

module.exports = (decl) => {
	decl.prop = decl.prop.replace(
		matchSize,
		($0, minmax, flow) => `${minmax||''}${'block' === flow ? 'height' : 'width'}`
	);
};
