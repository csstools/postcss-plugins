import matchSide from './match-side';
import matchInsetPrefix from './match-inset-prefix';

export default (decl, suffix, value) => decl.clone({
	prop: `${decl.prop.replace(matchSide, '$1')}${suffix}`.replace(matchInsetPrefix, ''),
	value
});
