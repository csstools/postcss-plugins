const cloneRule = require('./clone-rule');

const matchLogical = /^\s*logical\s+/i;
const matchLogicalBorder = /^border(-width|-style|-color)?$/i;
const matchLogicalBorderSide = /^border-(block|block-start|block-end|inline|inline-start|inline-end|start|end)(-(width|style|color))?$/i;

// border
module.exports['border'] = (decl, values) => {
	const isLogical = matchLogical.test(values[0]);

	if (isLogical) {
		values[0] = values[0].replace(matchLogical, '');
	}

	return isLogical ? 1 === values.length
		? decl.clone({
			value: decl.value.replace(matchLogical, '')
		})
		: !values[3] || values[3] === values[1]
			? [
				decl.clone({
					prop: `border-top${decl.prop.replace(matchLogicalBorder, '$1')}`,
					value: values[0]
				}),
				decl.clone({
					prop: `border-right${decl.prop.replace(matchLogicalBorder, '$1')}`,
					value: values[3] || values[1] || values[0]
				}),
				decl.clone({
					prop: `border-bottom${decl.prop.replace(matchLogicalBorder, '$1')}`,
					value: values[2] || values[0]
				}),
				decl.clone({
					prop: `border-left${decl.prop.replace(matchLogicalBorder, '$1')}`,
					value: values[1] || values[0]
				})
			]
			: [
				cloneRule(decl, 'ltr').append([
					decl.clone({
						prop: `border-top${decl.prop.replace(matchLogicalBorder, '$1')}`,
						value: values[0]
					}),
					decl.clone({
						prop: `border-left${decl.prop.replace(matchLogicalBorder, '$1')}`,
						value: values[1] || values[0]
					}),
					decl.clone({
						prop: `border-bottom${decl.prop.replace(matchLogicalBorder, '$1')}`,
						value: values[2] || values[0]
					}),
					decl.clone({
						prop: `border-right${decl.prop.replace(matchLogicalBorder, '$1')}`,
						value: values[3] || values[1] || values[0]
					})
				]),
				cloneRule(decl, 'rtl').append([
					decl.clone({
						prop: `border-top${decl.prop.replace(matchLogicalBorder, '$1')}`,
						value: values[0]
					}),
					decl.clone({
						prop: `border-right${decl.prop.replace(matchLogicalBorder, '$1')}`,
						value: values[1] || values[0]
					}),
					decl.clone({
						prop: `border-bottom${decl.prop.replace(matchLogicalBorder, '$1')}`,
						value: values[2] || values[0]
					}),
					decl.clone({
						prop: `border-left${decl.prop.replace(matchLogicalBorder, '$1')}`,
						value: values[3] || values[1] || values[0]
					})
				])
			]
		: null;
};


// border-block
module.exports['border-block'] = (decl, values) => [
	decl.clone({
		prop: `border-top${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
		value: values[0]
	}),
	decl.clone({
		prop: `border-bottom${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
		value: values[0]
	})
];

// border-block-start
module.exports['border-block-start'] = (decl) => {
	decl.prop = 'border-top';
};

// border-block-end
module.exports['border-block-end'] = (decl) => {
	decl.prop = 'border-bottom';
};

// border-inline
module.exports['border-inline'] = (decl, values) => 1 === values.length || 2 === values.length && values[0] === values[1]
? [
	decl.clone({
		prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
		value: values[0]
	}),
	decl.clone({
		prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
		value: values[1] || values[0]
	})
]
: [
	cloneRule(decl, 'ltr').append([
		decl.clone({
			prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[0]
		}),
		decl.clone({
			prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[1] || values[0]
		})
	]),
	cloneRule(decl, 'rtl').append([
		decl.clone({
			prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[0]
		}),
		decl.clone({
			prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[1] || values[0]
		})
	])
];

// border-inline-start
module.exports['border-inline-start'] = (decl) => [
	cloneRule(decl, 'ltr').append(
		decl.clone({
			prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`
		})
	),
	cloneRule(decl, 'rtl').append(
		decl.clone({
			prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`
		})
	)
];

// border-inline-end
module.exports['border-inline-end'] = (decl) => [
	cloneRule(decl, 'ltr').append(
		decl.clone({
			prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`
		})
	),
	cloneRule(decl, 'rtl').append(
		decl.clone({
			prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`
		})
	)
];

// border-start
module.exports['border-start'] = (decl, values) => [
	cloneRule(decl, 'ltr').append([
		decl.clone({
			prop: `border-top${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[0]
		}),
		decl.clone({
			prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[1] || values[0]
		})
	]),
	cloneRule(decl, 'rtl').append([
		decl.clone({
			prop: `border-top${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[0]
		}),
		decl.clone({
			prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[1] || values[0]
		})
	])
];

// border-end
module.exports['border-end'] = (decl, values) => [
	cloneRule(decl, 'ltr').append([
		decl.clone({
			prop: `border-bottom${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[0]
		}),
		decl.clone({
			prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[1] || values[0]
		})
	]),
	cloneRule(decl, 'rtl').append([
		decl.clone({
			prop: `border-bottom${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[0]
		}),
		decl.clone({
			prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[1] || values[0]
		})
	])
];
