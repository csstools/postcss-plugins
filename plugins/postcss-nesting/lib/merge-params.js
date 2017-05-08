// tooling
const comma = require('postcss').list.comma;

// merge params
module.exports = (fromParams, toParams) => comma(fromParams).map(
	(params1) => comma(toParams).map(
		(params2) => params1 + ' and ' + params2
	).join(', ')
).join(', ');
