import matchSize from './match-size';

export default decl => {
	decl.prop = decl.prop.replace(
		matchSize,
		($0, minmax, flow) => `${minmax||''}${'block' === flow ? 'height' : 'width'}`
	);
}
