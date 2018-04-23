import { list } from 'postcss';

const { comma } = list;

// merge params
export default (fromParams, toParams) => comma(fromParams).map(
	params1 => comma(toParams).map(
		params2 => params1 + ' and ' + params2
	).join(', ')
).join(', ');
