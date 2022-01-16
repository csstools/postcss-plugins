import transformBorder from './lib/transform-border';
import transformBorderRadius from './lib/transform-border-radius';
import transformDirectionalShorthands from './lib/transform-directional-shorthands';
import transformFloat from './lib/transform-float';
import transformInset from './lib/transform-inset';
import transformResize from './lib/transform-resize';
import transformSide from './lib/transform-side';
import transformSize from './lib/transform-size';
import transformTextAlign from './lib/transform-text-align';
import transformTransition from './lib/transform-transition';
import { splitBySpace } from './lib/split';
import { hasKeyframesAtRuleAncestor } from './lib/has-keyframes-atrule-ancestor';

// plugin
function postcssLogicalProperties(opts) {
	opts = Object(opts);

	const preserve = Boolean(opts.preserve);
	const dir = !preserve && typeof opts.dir === 'string'
		? /^rtl$/i.test(opts.dir)
			? 'rtl'
			: 'ltr'
		: false;

	const makeTransform = (transform) => {
		return (decl) => {
			if (hasKeyframesAtRuleAncestor(decl)) {
				return;
			}
			const parent = decl.parent;
			const values = splitBySpace(decl.value, true);
			transform(decl, values, dir, preserve);
			if (!parent.nodes.length) {
				parent.remove();
			}
		};
	};

	const makeTransformWithoutSplittingValues = (transform) => {
		return (decl) => {
			if (hasKeyframesAtRuleAncestor(decl)) {
				return;
			}
			const parent = decl.parent;
			const values = [decl.value];
			transform(decl, values, dir, preserve);
			if (!parent.nodes.length) {
				parent.remove();
			}
		};
	};

	return {
		postcssPlugin: 'postcss-logical-properties',
		Declaration: {
			// Flow-Relative Values
			'clear': makeTransform(transformFloat),
			'float': makeTransform(transformFloat),
			'resize': makeTransform(transformResize),
			'text-align': makeTransform(transformTextAlign),

			// Logical Height and Logical Width
			'block-size': makeTransform(transformSize),
			'max-block-size': makeTransform(transformSize),
			'min-block-size': makeTransform(transformSize),
			'inline-size': makeTransform(transformSize),
			'max-inline-size': makeTransform(transformSize),
			'min-inline-size': makeTransform(transformSize),

			// Flow-relative Margins
			'margin': makeTransform(transformDirectionalShorthands),
			'margin-inline': makeTransform(transformSide['inline']),
			'margin-inline-end': makeTransform(transformSide['inline-end']),
			'margin-inline-start': makeTransform(transformSide['inline-start']),
			'margin-block': makeTransform(transformSide['block']),
			'margin-block-end': makeTransform(transformSide['block-end']),
			'margin-block-start': makeTransform(transformSide['block-start']),

			// Flow-relative Offsets
			'inset': makeTransform(transformInset),
			'inset-inline': makeTransform(transformSide['inline']),
			'inset-inline-end': makeTransform(transformSide['inline-end']),
			'inset-inline-start': makeTransform(transformSide['inline-start']),
			'inset-block': makeTransform(transformSide['block']),
			'inset-block-end': makeTransform(transformSide['block-end']),
			'inset-block-start': makeTransform(transformSide['block-start']),

			// Flow-relative Padding
			'padding': makeTransform(transformDirectionalShorthands),
			'padding-inline': makeTransform(transformSide['inline']),
			'padding-inline-end': makeTransform(transformSide['inline-end']),
			'padding-inline-start': makeTransform(transformSide['inline-start']),
			'padding-block': makeTransform(transformSide['block']),
			'padding-block-end': makeTransform(transformSide['block-end']),
			'padding-block-start': makeTransform(transformSide['block-start']),

			// Flow-relative Borders
			'border-block': makeTransformWithoutSplittingValues(transformBorder['border-block']),
			'border-block-color': makeTransform(transformBorder['border-block']),
			'border-block-style': makeTransform(transformBorder['border-block']),
			'border-block-width': makeTransform(transformBorder['border-block']),
			'border-block-end': makeTransformWithoutSplittingValues(transformBorder['border-block-end']),
			'border-block-end-color': makeTransform(transformBorder['border-block-end']),
			'border-block-end-style': makeTransform(transformBorder['border-block-end']),
			'border-block-end-width': makeTransform(transformBorder['border-block-end']),
			'border-block-start': makeTransformWithoutSplittingValues(transformBorder['border-block-start']),
			'border-block-start-color': makeTransform(transformBorder['border-block-start']),
			'border-block-start-style': makeTransform(transformBorder['border-block-start']),
			'border-block-start-width': makeTransform(transformBorder['border-block-start']),
			'border-inline': makeTransformWithoutSplittingValues(transformBorder['border-inline']),
			'border-inline-color': makeTransform(transformBorder['border-inline']),
			'border-inline-style': makeTransform(transformBorder['border-inline']),
			'border-inline-width': makeTransform(transformBorder['border-inline']),
			'border-inline-end': makeTransformWithoutSplittingValues(transformBorder['border-inline-end']),
			'border-inline-end-color': makeTransform(transformBorder['border-inline-end']),
			'border-inline-end-style': makeTransform(transformBorder['border-inline-end']),
			'border-inline-end-width': makeTransform(transformBorder['border-inline-end']),
			'border-inline-start': makeTransformWithoutSplittingValues(transformBorder['border-inline-start']),
			'border-inline-start-color': makeTransform(transformBorder['border-inline-start']),
			'border-inline-start-style': makeTransform(transformBorder['border-inline-start']),
			'border-inline-start-width': makeTransform(transformBorder['border-inline-start']),

			// Flow-relative Corner Rounding
			'border-end-end-radius': makeTransform(transformBorderRadius),
			'border-end-start-radius': makeTransform(transformBorderRadius),
			'border-start-end-radius': makeTransform(transformBorderRadius),
			'border-start-start-radius': makeTransform(transformBorderRadius),

			// Four-Directional Shorthand Border Properties
			'border-color': makeTransform(transformDirectionalShorthands),
			'border-style': makeTransform(transformDirectionalShorthands),
			'border-width': makeTransform(transformDirectionalShorthands),

			// Transition helpers
			'transition': makeTransform(transformTransition),
			'transition-property': makeTransform(transformTransition),
		},
	};
}
postcssLogicalProperties.postcss = true;

export default postcssLogicalProperties;
