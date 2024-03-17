import valueParser from 'postcss-value-parser';

const IMAGE_FUNC_REGEX = /^(cross-fade|image|(repeating-)?(conic|linear|radial)-gradient|url|var)$/i;

export function getImage(node: valueParser.Node): string|false {
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
		IMAGE_FUNC_REGEX.test(node.value)
	) {
		return valueParser.stringify(node);
	}

	return false;
}
