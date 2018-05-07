const imageSetFunctionMatchRegExp = /^(-webkit-)?image-set$/i

// return a valid image
export default node =>
	// <url> | <image()> | <cross-fade()> | <gradient>
	// the image-set() function can not be nested inside of itself
	Object(node).type === 'func' && /^(cross-fade|image|(repeating-)?(conic|linear|radial)-gradient|url)$/i.test(node.value) && !(
		node.parent.parent && node.parent.parent.type === 'func' && imageSetFunctionMatchRegExp.test(node.parent.parent.value)
	)
	? String(node)
: Object(node).type === 'string'
	? node.value
: false;
