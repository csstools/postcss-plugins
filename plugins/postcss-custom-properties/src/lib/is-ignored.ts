function hasIgnoreComment(input: string) {
	return /(!\s*)?postcss-custom-properties:\s*(?:off|ignore\s+next)\b/.test(input);
}

function isBlockIgnored(ruleOrDeclaration) {
	const rule = ruleOrDeclaration.selector ?
		ruleOrDeclaration : ruleOrDeclaration.parent;

	return /(!\s*)?postcss-custom-properties:\s*off\b/i.test(rule.toString());
}

function isRuleIgnored(rule) {
	const previous = rule.prev();

	return Boolean(isBlockIgnored(rule) ||
		previous &&
		previous.type === 'comment' &&
		/(!\s*)?postcss-custom-properties:\s*ignore\s+next\b/i.test(previous.text));
}

export {
	hasIgnoreComment,
	isBlockIgnored,
	isRuleIgnored,
};
