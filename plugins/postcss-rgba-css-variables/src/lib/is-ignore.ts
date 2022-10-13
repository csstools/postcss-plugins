import { PluginName } from './config';

function isBlockIgnored(ruleOrDeclaration) {
	const rule = ruleOrDeclaration.selector ?
		ruleOrDeclaration : ruleOrDeclaration.parent;

	return new RegExp(`(!\\s*)?${PluginName}:\\s*off\\b`, 'i').test(rule.toString());
}

function isRuleIgnored(rule) {
	const previous = rule.prev();

	return Boolean(isBlockIgnored(rule) ||
		previous &&
		previous.type === 'comment' &&
		new RegExp(`(!\\s*)?${PluginName}:\\s*ignore\\s+next\\b`, 'i').test(previous.text));
}

export {
	isBlockIgnored,
	isRuleIgnored,
};
