function isBlockIgnored(ruleOrDeclaration) {
	var rule = ruleOrDeclaration.selector ?
		ruleOrDeclaration : ruleOrDeclaration.parent;

	return /(!\s*)?postcss-custom-properties:\s*off\b/i.test(rule.toString())
}

function isRuleIgnored(rule) {
	var previous = rule.prev();

	return Boolean(isBlockIgnored(rule) ||
		previous &&
		previous.type === 'comment' &&
		/(!\s*)?postcss-custom-properties:\s*ignore\s+next\b/i.test(previous.text));
}

export {
	isBlockIgnored,
	isRuleIgnored
}
