import type { AtRule, AtRuleProps, Declaration, Rule, RuleProps } from "postcss";

export function newNestedRuleWithSupportsNot(
	decl: Declaration,
	rule: (ruleProps: RuleProps) => Rule,
	atRule: (atRuleProps: AtRuleProps) => AtRule
): { rule: Rule, supports: AtRule } {
	const supports = atRule({
		name: 'supports',
		params: 'not (color: light-dark(tan, tan))',
		source: decl.source,
	});

	const r = rule({
		selector: '& *',
		source: decl.source,
	});

	supports.append(r);

	return {
		rule: r,
		supports: supports
	}
}
