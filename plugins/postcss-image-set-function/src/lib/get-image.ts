const imageSetFunctionMatchRegExp = /^(-webkit-)?image-set$/i;

const imageFuncRegexp = /^(cross-fade|image|(repeating-)?(conic|linear|radial)-gradient|url)$/i;

export function getImage(node) {
	// <url> | <image()> | <cross-fade()> | <gradient>
	// the image-set() function can not be nested inside of itself
	if (!node || !node.type) {
		return false;
	}

	if (node.type === 'func' &&
		imageFuncRegexp.test(node.name) &&
		!(
			node.parent &&
			node.parent.parent &&
			node.parent.parent.type === 'func' &&
			imageSetFunctionMatchRegExp.test(node.parent.parent.name)
		)) {
		return (node.raws.before || '') + String(node);
	}

	if (node.type === 'quoted') {
		return node.value;
	}

	return false;
}
