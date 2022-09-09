import type { AtRule, Node, Rule } from 'postcss';

export function isAtRule(node?: Node): node is AtRule {
	return node && node.type === 'atrule';
}

export function isNestRule(node?: Node): node is AtRule {
	return node && isAtRule(node) && node.name === 'nest';
}

export function isRule(node?: Node): node is Rule {
	return node && node.type === 'rule';
}
