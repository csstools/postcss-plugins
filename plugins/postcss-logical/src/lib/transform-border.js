import cloneRule from './clone-rule';

const matchLogicalBorderSide = /^border-(block|block-start|block-end|inline|inline-start|inline-end)(-(width|style|color))?$/i;

export default {
	// border-block
	'border-block': (decl, values, dir, preserve) => {
		decl.cloneBefore({
			prop: `border-top${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[0],
		});
		decl.cloneBefore({
			prop: `border-bottom${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			value: values[1] || values[0],
		});
		clean(decl, preserve);
	},

	// border-block-start
	'border-block-start': (decl, values, dir, preserve) => {
		decl.cloneBefore({
			prop: `border-top${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
		});
		clean(decl, preserve);
	},

	// border-block-end
	'border-block-end': (decl, values, dir, preserve) => {
		decl.cloneBefore({
			prop: `border-bottom${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
		});
		clean(decl, preserve);
	},

	// border-inline
	'border-inline': (decl, values, dir, preserve) => {
		const ltrDecls = () => {
			return [
				decl.cloneBefore({
					prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
					value: values[0],
				}),
				decl.cloneBefore({
					prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
					value: values[1] || values[0],
				}),
			];
		};

		const rtlDecls = () => {
			return [
				decl.clone({
					prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
					value: values[0],
				}),
				decl.clone({
					prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
					value: values[1] || values[0],
				}),
			];
		};

		const isLTR = 1 === values.length || 2 === values.length && values[0] === values[1];
		if (isLTR || dir === 'ltr') {
			ltrDecls();
			clean(decl, preserve);
			return;
		} else if (dir === 'rtl') {
			rtlDecls();
			clean(decl, preserve);
			return;
		} else {
			cloneRule(decl, 'ltr').append(ltrDecls());
			cloneRule(decl, 'rtl').append(rtlDecls());
			clean(decl, preserve);
			return;
		}
	},

	// border-inline-start
	'border-inline-start': (decl, values, dir, preserve) => {
		const ltrDecl = () => {
			return decl.cloneBefore({
				prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			});
		};

		const rtlDecl = () => {
			return decl.cloneBefore({
				prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			});
		};

		if (dir === 'ltr') {
			ltrDecl();
			clean(decl, preserve);
			return;
		} else if (dir === 'rtl') {
			rtlDecl();
			clean(decl, preserve);
			return;
		} else {
			cloneRule(decl, 'ltr').append(ltrDecl());
			cloneRule(decl, 'rtl').append(rtlDecl());
			clean(decl, preserve);
			return;
		}
	},

	// border-inline-end
	'border-inline-end': (decl, values, dir, preserve) => {
		const ltrDecl = () => {
			return decl.cloneBefore({
				prop: `border-right${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			});
		};

		const rtlDecl = () => {
			return decl.cloneBefore({
				prop: `border-left${decl.prop.replace(matchLogicalBorderSide, '$2')}`,
			});
		};

		if (dir === 'ltr') {
			ltrDecl();
			clean(decl, preserve);
			return;
		} else if (dir === 'rtl') {
			rtlDecl();
			clean(decl, preserve);
			return;
		} else {
			cloneRule(decl, 'ltr').append(ltrDecl());
			cloneRule(decl, 'rtl').append(rtlDecl());
			clean(decl, preserve);
			return;
		}
	},
};

function clean(decl, preserve) {
	if (!preserve) {
		decl.remove();
	}
}
