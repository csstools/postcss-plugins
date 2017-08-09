const cloneRule = require('./clone-rule');

module.exports = (decl, values) => 'logical' === values[0]
	? !values[4] || values[4] === values[2]
		? decl.clone({
			value: decl.value.replace(/^\s*logical\s+/i, '')
		})
		: [
			cloneRule(decl, 'ltr').append(
				decl.clone({
					value: [
						values[1],
						values[4] || values[2] || values[1],
						values[3] || values[1],
						values[2] || values[1]
					].join(' ')
				})
			),
			cloneRule(decl, 'rtl').append(
				decl.clone({
					value: [
						values[1],
						values[2] || values[1],
						values[3] || values[1],
						values[4] || values[2] || values[1]
					].join(' ')
				})
			)
		]
	: null;
