import type { AtRule, AtRuleProps, ChildNode, Container, Declaration, Rule, RuleProps } from "postcss";

export function newNestedRuleWithSupportsNot(
	decl: Declaration,
	rule: (ruleProps: RuleProps) => Rule,
	atRule: (atRuleProps: AtRuleProps) => AtRule,
	preserve?: boolean,
): { inner: Rule, outer: Container<ChildNode> } {
	const r = rule({
		selector: '& *',
		source: decl.source,
	});

	if (!preserve) {
		return {
			inner: r,
			outer: r
		};
	}

	const supports = atRule({
		name: 'supports',
		params: 'not (color: light-dark(tan, tan))',
		source: decl.source,
	});

	supports.append(r);

	return {
		inner: r,
		outer: supports
	};
}
