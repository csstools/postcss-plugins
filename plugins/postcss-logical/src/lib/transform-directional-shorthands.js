import cloneRule from './clone-rule';
import reduceValues from './reduce-values';

export default (decl, values, dir) => {
	if ('logical' !== values[0]) {
		return null;
	}

	// get logical directions as all, inline, block-end, then inline-end
	const [, all, inline, blockEnd, inlineEnd ] = values;

	// get left-to-right relative directions from logical directions as:
	// → top from all
	// → right from inline-end, inline, or all
	// → bottom from block-end, block, or all
	// → left from inline, or all
	const ltrValues = reduceValues([
		all,
		inlineEnd || inline || all,
		blockEnd || all,
		inline || all
	]);

	const ltrDecl = decl.clone({
		value: ltrValues.join(' ')
	});

	// return the ltr values if the values are flow agnostic (where no second inline value was needed)
	const isFlowAgnostic = ltrValues.length < 4;

	if (isFlowAgnostic || dir === 'ltr') {
		return ltrDecl;
	}

	// get right-to-left relative directions from logical directions as:
	// → top from all
	// → right from inline, or all
	// → bottom from block-end, block, or all
	// → left from inline-end, inline, or all
	const rtlValues = reduceValues([
		all,
		inline || all,
		blockEnd || all,
		inlineEnd || inline || all
	]);

	const rtlDecl = decl.clone({
		value: rtlValues.join(' ')
	});

	if (dir === 'rtl') {
		return rtlDecl;
	}

	return [
		cloneRule(decl, 'ltr').append(ltrDecl),
		cloneRule(decl, 'rtl').append(rtlDecl)
	];
}
