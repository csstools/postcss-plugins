module.exports = function testPlugin(options) {
	return {
		postcssPlugin: 'test-plugin',
		Root(root, { result }) {
			if (Object(options).shouldFail) {
				throw new Error('This should fail.')
			} else if (Object(options).shouldWarn) {
				result.warn('This should warn.')
			}
		},
	}
}

module.exports.postcss = true
