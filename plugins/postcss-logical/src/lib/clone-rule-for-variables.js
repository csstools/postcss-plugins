import postcss from 'postcss';

export function cloneRuleAsDir(decl, dir) {
	const rule = Object(decl.parent).type === 'rule' ? decl.parent.cloneBefore({
		raws: {},
	}).removeAll() : postcss.rule({ selector: '&' });

	rule.assign({'selector': `:dir(${dir})`});

	return rule;
}
