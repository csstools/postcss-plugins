import type { AtRule, AtRuleProps } from 'postcss';
import { Statement, isCharsetStatement, isImportStatement, isWarning } from './statement';
import { formatImportPrelude } from './format-import-prelude';

export function applyConditions(bundle: Array<Statement>, atRule: (defaults?: AtRuleProps) => AtRule) {
	bundle.forEach((stmt, index) => {
		if (isWarning(stmt) || isCharsetStatement(stmt) || !stmt.conditions?.length) {
			return;
		}

		if (isImportStatement(stmt)) {
			if (stmt.conditions.length === 1) {
				stmt.node.params = `${stmt.fullUri} ${formatImportPrelude(
					stmt.conditions[0].layer,
					stmt.conditions[0].media,
					stmt.conditions[0].supports,
				)}`;
			} else {
				stmt.conditions.reverse();
				const first = stmt.conditions.pop()!;
				let params = `${stmt.fullUri} ${formatImportPrelude(
					first.layer,
					first.media,
					first.supports,
				)}`;

				for (const condition of stmt.conditions) {
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

		const nodes = stmt.nodes;
		if (!nodes.length) {
			return;
		}

		const parent = nodes[0].parent;
		if (!parent) {
			return;
		}

		const atRules = [];

		// Convert conditions to at-rules
		for (const condition of stmt.conditions) {
			if (typeof condition.media !== 'undefined') {
				const mediaNode = atRule({
					name: 'media',
					params: condition.media,
					source: stmt.importingNode?.source ?? parent.source,
				});

				atRules.push(mediaNode);
			}

			if (typeof condition.supports !== 'undefined') {
				const supportsNode = atRule({
					name: 'supports',
					params: '(' + condition.supports + ')',
					source: stmt.importingNode?.source ?? parent.source,
				});

				atRules.push(supportsNode);
			}

			if (typeof condition.layer !== 'undefined') {
				const layerNode = atRule({
					name: 'layer',
					params: condition.layer,
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
