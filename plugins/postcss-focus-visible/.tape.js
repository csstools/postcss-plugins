const cache = [];

module.exports = {
	'postcss-focus-ring': {
		'basic': {
			message: 'supports basic usage'
		},
		'basic:cache': {
			message: 'supports { assignTo: [] } usage',
			options: {
				assignTo: cache
			},
			after: () => {
				const expectJSON = '[".focus-visible",".focus-visible test","test .focus-visible","test test.focus-visible","test .focus-visible test","test test.focus-visible test","test .focus-visible .focus-visible test","test :matches(.focus-visible) test","test :matches(.focus-visible test) test","test :matches(test .focus-visible) test","test :matches(test test.focus-visible) test","test :matches(test .focus-visible test) test","test :matches(test test.focus-visible test) test","test :matches(test .focus-visible .focus-visible test) test"]';
				const resultJSON = JSON.stringify(cache);

				if (expectJSON !== resultJSON) {
					throw new Error('JSON does not match');
				}
			},
			expect: 'basic.expect.css',
			result: 'basic.result.css'
		},
		'basic:exportas-js': {
			message: 'supports { exportAs: "js" } usage',
			options: {
				exportAs: 'js'
			},
			expect: 'basic.expect.css',
			result: 'basic.result.css'
		},
		'basic:exportas-json': {
			message: 'supports { exportAs: "json" } usage',
			options: {
				exportAs: 'json'
			},
			expect: 'basic.expect.css',
			result: 'basic.result.css'
		}
	}
};
