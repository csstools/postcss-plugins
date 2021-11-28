import matchSize from './match-size';

export default (decl, values, dir, preserve) => {
	decl.cloneBefore({
		prop: decl.prop.replace(
			matchSize,
			($0, minmax, flow) => `${minmax || ''}${'block' === flow ? 'height' : 'width'}`,
		),
	});

	if (!preserve) {
		decl.remove();
	}
};
