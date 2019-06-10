// tooling
import postcss from 'postcss';

// internal tooling
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

// supported transforms
const transforms = {
	// Flow-Relative Values
	'clear': transformFloat,
	'float': transformFloat,
	'resize': transformResize,
	'text-align': transformTextAlign,

	// Logical Height and Logical Width
	'block-size': transformSize, 'max-block-size': transformSize, 'min-block-size': transformSize,
	'inline-size': transformSize, 'max-inline-size': transformSize, 'min-inline-size': transformSize,

	// Flow-relative Margins
	'margin': transformDirectionalShorthands, 'margin-inline': transformSide['inline'], 'margin-inline-end': transformSide['inline-end'], 'margin-inline-start': transformSide['inline-start'], 'margin-block': transformSide['block'], 'margin-block-end': transformSide['block-end'], 'margin-block-start': transformSide['block-start'],

	// Flow-relative Offsets
	'inset': transformInset, 'inset-inline': transformSide['inline'], 'inset-inline-end': transformSide['inline-end'], 'inset-inline-start': transformSide['inline-start'], 'inset-block': transformSide['block'], 'inset-block-end': transformSide['block-end'], 'inset-block-start': transformSide['block-start'],

	// Flow-relative Padding
	'padding': transformDirectionalShorthands, 'padding-inline': transformSide['inline'], 'padding-inline-end': transformSide['inline-end'], 'padding-inline-start': transformSide['inline-start'], 'padding-block': transformSide['block'], 'padding-block-end': transformSide['block-end'], 'padding-block-start': transformSide['block-start'],

	// Flow-relative Borders
	'border-block':        transformBorder['border-block'],        'border-block-color':        transformBorder['border-block'],        'border-block-style':        transformBorder['border-block'],        'border-block-width':        transformBorder['border-block'],
	'border-block-end':    transformBorder['border-block-end'],    'border-block-end-color':    transformBorder['border-block-end'],    'border-block-end-style':    transformBorder['border-block-end'],    'border-block-end-width':    transformBorder['border-block-end'],
	'border-block-start':  transformBorder['border-block-start'],  'border-block-start-color':  transformBorder['border-block-start'],  'border-block-start-style':  transformBorder['border-block-start'],  'border-block-start-width':  transformBorder['border-block-start'],
	'border-inline':       transformBorder['border-inline'],       'border-inline-color':       transformBorder['border-inline'],       'border-inline-style':       transformBorder['border-inline'],       'border-inline-width':       transformBorder['border-inline'],
	'border-inline-end':   transformBorder['border-inline-end'],   'border-inline-end-color':   transformBorder['border-inline-end'],   'border-inline-end-style':   transformBorder['border-inline-end'],   'border-inline-end-width':   transformBorder['border-inline-end'],
	'border-inline-start': transformBorder['border-inline-start'], 'border-inline-start-color': transformBorder['border-inline-start'], 'border-inline-start-style': transformBorder['border-inline-start'], 'border-inline-start-width': transformBorder['border-inline-start'],

	// Flow-relative Corner Rounding
	'border-end-end-radius': transformBorderRadius, 'border-end-start-radius': transformBorderRadius, 'border-start-end-radius': transformBorderRadius, 'border-start-start-radius': transformBorderRadius,

	// Four-Directional Shorthand Border Properties
	'border-color': transformDirectionalShorthands, 'border-style': transformDirectionalShorthands, 'border-width': transformDirectionalShorthands,

	// Transition helpers
	'transition': transformTransition, 'transition-property': transformTransition
};

const transformsRegExp = new RegExp(`^(${Object.keys(transforms).join('|')})$`, 'i');

// properties whose values will not be split
const unsplitPropRegExp = /^(border-block|border-block-end|border-block-start|border-inline|border-inline-end|border-inline-start)$/i;

// plugin
export default postcss.plugin('postcss-logical-properties', opts => {
	opts = Object(opts);

	const preserve = Boolean(opts.preserve);
	const dir = !preserve && typeof opts.dir === 'string'
		? /^rtl$/i.test(opts.dir)
			? 'rtl'
		: 'ltr'
	: false;

	return root => {
		root.walkDecls(transformsRegExp, decl => {
			const parent = decl.parent;
			const values = unsplitPropRegExp.test(decl.prop) ? [decl.value] : splitBySpace(decl.value, true);
			const prop = decl.prop.toLowerCase();

			const replacer = transforms[prop](decl, values, dir);

			if (!replacer) {
				return;
			}

			[].concat(replacer).forEach(replacement => {
				if (replacement.type === 'rule') {
					parent.before(replacement);
				} else {
					decl.before(replacement);
				}
			});

			if (preserve) {
				return;
			}

			decl.remove();

			if (!parent.nodes.length) {
				parent.remove();
			}
		});
	};
});
