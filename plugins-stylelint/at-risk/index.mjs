import stylelint from 'stylelint';

const ruleName = '@csstools/stylelint-at-risk';

const messages = stylelint.utils.ruleMessages(ruleName, {
	rejectedNestingDeclOrder: () => {
		return 'Declarations after nested rules or at-rules are currently re-ordered but might not be in the future. Place all declarations before any nested rules or at-rules to prevent future compat issues.';
	},
	rejectedAtRiskPropertyReplacement: (atRisk, replacement) => {
		return `The '${atRisk}' property is being replaced with '${replacement}'.`;
	},
	rejectedAtRiskPropertyRemoval: (atRisk) => {
		return `The '${atRisk}' property is being removed.`;
	},
});

const atRiskProperties = {
	replacements: [
		[
			'inset-area',
			'position-area',
		],
	],
	removals: [],
};

const meta = {
	url: 'https://github.com/csstools/postcss-plugins/blob/main/plugins-stylelint/at-risk',
	fixable: true,
};

const ruleFunction = (primaryOption) => {
	return (postcssRoot, postcssResult) => {
		if (!primaryOption) {
			return;
		}

		// Nested Declarations after Rules/At-Rules
		{
			postcssRoot.walkDecls((decl) => {
				checkNestingDeclOrder(decl, postcssResult);

				checkAtRiskProperties(decl, postcssResult);
			});
		}

	};
};

function checkNestingDeclOrder(decl, postcssResult) {
	let prev = decl.prev();

	while (prev && prev.type === 'comment') {
		prev = prev.prev();
	}

	if (!prev) {
		return;
	}

	if (prev?.type !== 'decl') {
		stylelint.utils.report({
			message: messages.rejectedNestingDeclOrder(),
			node: decl,
			index: 0,
			endIndex: decl.prop.length,
			result: postcssResult,
			ruleName,
		});
	}
}

function checkAtRiskProperties(decl, postcssResult) {
	const lowerCaseProp = decl.prop.toLowerCase();

	atRiskProperties.replacements.forEach(([atRisk, replacement]) => {
		if (lowerCaseProp !== atRisk) {
			return;
		}

		stylelint.utils.report({
			message: messages.rejectedAtRiskPropertyReplacement(atRisk, replacement),
			node: decl,
			index: 0,
			endIndex: decl.prop.length,
			result: postcssResult,
			ruleName,
		});
	});

	atRiskProperties.removals.forEach((atRisk) => {
		if (lowerCaseProp !== atRisk) {
			return;
		}

		stylelint.utils.report({
			message: messages.rejectedAtRiskPropertyRemoval(atRisk),
			node: decl,
			index: 0,
			endIndex: decl.prop.length,
			result: postcssResult,
			ruleName,
		});
	});
}

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

export default stylelint.createPlugin(ruleName, ruleFunction);
