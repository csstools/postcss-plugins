import valueParser from 'postcss-value-parser';

const imageFuncRegexp = /^(cross-fade|image|(repeating-)?(conic|linear|radial)-gradient|url|var)$/i;

export function getImage(node) {
	// <url> | <image()> | <cross-fade()> | <gradient>
	// the image-set() function can not be nested inside of itself
	if (!node || !node.type) {
		return false;
	}

	if (node.type === 'string') {
		return 'url('+valueParser.stringify(node)+')';
	}

	if (
		node.type === 'function' &&
		imageFuncRegexp.test(node.value.toLowerCase())
	) {
		return valueParser.stringify(node);
	}

	return false;
}
