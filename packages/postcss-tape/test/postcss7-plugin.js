const postcss = require('postcss')

module.exports = postcss.plugin('test-plugin', options => {
	return (root, result) => {
		if (Object(options).shouldFail) {
			throw new Error('This should fail.')
		} else if (Object(options).shouldWarn) {
			result.warn('This should warn.')
		}
	}
})
