// tooling
const postcss = require('postcss');

// internal tooling
const transformBorder = require('./dependent-js/transform-border');
const transformFloat = require('./dependent-js/transform-float');
const transformInset = require('./dependent-js/transform-inset');
const transformResize = require('./dependent-js/transform-resize');
const transformSide = require('./dependent-js/transform-side');
const transformSize = require('./dependent-js/transform-size');
const transformSpacing = require('./dependent-js/transform-spacing');
const transformTextAlign = require('./dependent-js/transform-text-align');
const matchSupportedProperties = require('./dependent-js/match-supported-properties');

// supported transforms
const transforms = {
	'border': transformBorder['border'], 'border-width': transformBorder['border'], 'border-style': transformBorder['border'], 'border-color': transformBorder['border'],
	'border-block': transformBorder['border-block'], 'border-block-width': transformBorder['border-block'], 'border-block-style': transformBorder['border-block'], 'border-block-color': transformBorder['border-block'],
	'border-block-start': transformBorder['border-block-start'], 'border-block-start-width': transformBorder['border-block-start'], 'border-block-start-style': transformBorder['border-block-start'], 'border-block-start-color': transformBorder['border-block-start'],
	'border-block-end': transformBorder['border-block-end'], 'border-block-end-width': transformBorder['border-block-end'], 'border-block-end-style': transformBorder['border-block-end'], 'border-block-end-color': transformBorder['border-block-end'],
	'border-inline': transformBorder['border-inline'], 'border-inline-width': transformBorder['border-inline'], 'border-inline-style': transformBorder['border-inline'], 'border-inline-color': transformBorder['border-inline'],
	'border-inline-start': transformBorder['border-inline-start'], 'border-inline-start-width': transformBorder['border-inline-start'], 'border-inline-start-style': transformBorder['border-inline-start'], 'border-inline-start-color': transformBorder['border-inline-start'],
	'border-inline-end': transformBorder['border-inline-end'], 'border-inline-end-width': transformBorder['border-inline-end'], 'border-inline-end-style': transformBorder['border-inline-end'], 'border-inline-end-color': transformBorder['border-inline-end'],
	'border-start': transformBorder['border-start'], 'border-start-width': transformBorder['border-start'], 'border-start-style': transformBorder['border-start'], 'border-start-color': transformBorder['border-start'],
	'border-end': transformBorder['border-end'], 'border-end-width': transformBorder['border-end'], 'border-end-style': transformBorder['border-end'], 'border-end-color': transformBorder['border-end'],
	'clear': transformFloat,
	'inset': transformInset,
	'margin': transformSpacing,
	'padding': transformSpacing,
	'block': transformSide['block'],
	'block-start': transformSide['block-start'],
	'block-end': transformSide['block-end'],
	'inline': transformSide['inline'],
	'inline-start': transformSide['inline-start'],
	'inline-end': transformSide['inline-end'],
	'start': transformSide['start'],
	'end': transformSide['end'],
	'float': transformFloat,
	'resize': transformResize,
	'size': transformSize,
	'text-align': transformTextAlign
};

// plugin
module.exports = postcss.plugin('postcss-logical-properties', () => (root) => {
	root.walkDecls((decl) => {
		const values = postcss.list.split(decl.value, /^border(-block|-inline|-start|-end)?(-width|-style|-color)?$/i.test(decl.prop) ? '/' : ' ');
		const prop = decl.prop.replace(matchSupportedProperties, '$2$5').toLowerCase();

		if (prop in transforms) {
			const replacer = transforms[prop](decl, values);

			if (replacer) {
				decl.replaceWith(replacer);
			}
		}
	});
});
