import cloneRule from './clone-rule';
import reduceValues from './reduce-values';

export default (decl, values, dir, preserve) => {
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
		inline || all,
	]);

	const ltrDecl = () => {
		return decl.cloneBefore({
			value: ltrValues.join(' '),
		});
	};

	// return the ltr values if the values are flow agnostic (where no second inline value was needed)
	const isFlowAgnostic = ltrValues.length < 4;

	if (isFlowAgnostic || dir === 'ltr') {
		ltrDecl();
		clean(decl, preserve);
		return;
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
		inlineEnd || inline || all,
	]);

	const rtlDecl = () => {
		return decl.cloneBefore({
			value: rtlValues.join(' '),
		});
	};

	if (dir === 'rtl') {
		rtlDecl();
		clean(decl, preserve);
		return;
	}

	cloneRule(decl, 'ltr').append(ltrDecl());
	cloneRule(decl, 'rtl').append(rtlDecl());
	clean(decl, preserve);
};

function clean(decl, preserve) {
	if (!preserve) {
		decl.remove();
	}
}
