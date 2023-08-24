import type { AtRule, AtRuleProps } from 'postcss';
import { Statement, isCharsetStatement, isImportStatement, isWarning } from './statement';
import { formatImportPrelude } from './format-import-prelude';

export function applyConditions(bundle: Array<Statement>, atRule: (defaults?: AtRuleProps) => AtRule) {
	bundle.forEach((stmt, index) => {
		if (isWarning(stmt)) {
			return;
		}

		if (!stmt.conditions.length || isCharsetStatement(stmt)) {
			return;
		}

		if (isImportStatement(stmt)) {
			if (stmt.conditions.length === 1) {
				stmt.node.params = `${stmt.fullUri} ${formatImportPrelude(
					stmt.conditions[0].layer,
					stmt.conditions[0].media,
					stmt.conditions[0].supports,
				)}`;
			} else if (stmt.conditions.length > 1) {
				const reverseConditions = stmt.conditions.slice().reverse();
				const first = reverseConditions.pop()!;
				let params = `${stmt.fullUri} ${formatImportPrelude(
					first.layer,
					first.media,
					first.supports,
				)}`;

				for (const condition of reverseConditions) {
					params = `'data:text/css;base64,${Buffer.from(
						`@import ${params}`,
					).toString('base64')}' ${formatImportPrelude(
						condition.layer,
						condition.media,
						condition.supports,
					)}`;
				}

				stmt.node.params = params;
			}

			return;
		}

		const { nodes } = stmt;
		if (!nodes.length) {
			return;
		}

		const { parent } = nodes[0];
		if (!parent) {
			return;
		}

		const atRules = [];

		// Convert conditions to at-rules
		for (const condition of stmt.conditions) {
			if (condition.media.length > 0) {
				const mediaNode = atRule({
					name: 'media',
					params: condition.media.join(', '),
					source: stmt.importingNode?.source ?? parent.source,
				});

				atRules.push(mediaNode);
			}

			if (condition.supports.length > 0) {
				const supportsNode = atRule({
					name: 'supports',
					params:
						condition.supports.length === 1
							? `(${condition.supports[0]})`
							: condition.supports.map(x => `(${x})`).join(' and '),
					source: stmt.importingNode?.source ?? parent.source,
				});

				atRules.push(supportsNode);
			}

			if (condition.layer.length > 0) {
				const layerNode = atRule({
					name: 'layer',
					params: condition.layer.join('.'),
					source: stmt.importingNode?.source ?? parent.source,
				});

				atRules.push(layerNode);
			}
		}

		// Add nodes to AST
		const outerAtRule = atRules[0];
		if (!outerAtRule) {
			return;
		}

		for (let i = 0; i < atRules.length - 1; i++) {
			atRules[i].append(atRules[i + 1]);
		}
		const innerAtRule = atRules[atRules.length - 1];

		parent.insertBefore(nodes[0], outerAtRule);

		// remove nodes
		nodes.forEach(node => {
			node.parent = undefined;
		});

		// better output
		nodes[0].raws.before = nodes[0].raws.before || '\n';

		// wrap new rules with media query and/or layer at rule
		innerAtRule.append(nodes);

		bundle[index] = {
			type: 'nodes',
			nodes: [outerAtRule],
			conditions: stmt.conditions,
			from: stmt.from,
			importingNode: stmt.importingNode,
		};
	});
}
