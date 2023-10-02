import type { AtRule, Node, Rule } from 'postcss';

export function isAtRule(node?: Node): node is AtRule {
	return node && node.type === 'atrule';
}

export function isRule(node?: Node): node is Rule {
	return node && node.type === 'rule';
}
