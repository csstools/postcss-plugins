const imageSetFunctionMatchRegExp = /^(-webkit-)?image-set$/i;

const imageFuncRegexp = /^(cross-fade|image|(repeating-)?(conic|linear|radial)-gradient|url)$/i;

/**
 * return a valid image
 * @param {import('postcss-values-parser').ChildNode} node
 * @returns {string|*|boolean}
 */
module.exports = (node) =>
	// <url> | <image()> | <cross-fade()> | <gradient>
	// the image-set() function can not be nested inside of itself
	Object(node).type === 'func' &&
	imageFuncRegexp.test(node.name) &&
	!(
		node.parent.parent &&
		node.parent.parent.type === 'func' &&
		imageSetFunctionMatchRegExp.test(node.parent.parent.name)
	)
		? (node.raws.before || '') + String(node)
		: Object(node).type === 'quoted'
		? node.value
		: false;
