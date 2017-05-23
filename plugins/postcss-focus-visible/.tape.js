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
				const expectJSON = '[".focus-ring",".focus-ring test","test .focus-ring","test test.focus-ring","test .focus-ring test","test test.focus-ring test","test .focus-ring .focus-ring test","test :matches(.focus-ring) test","test :matches(.focus-ring test) test","test :matches(test .focus-ring) test","test :matches(test test.focus-ring) test","test :matches(test .focus-ring test) test","test :matches(test test.focus-ring test) test","test :matches(test .focus-ring .focus-ring test) test"]';
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
