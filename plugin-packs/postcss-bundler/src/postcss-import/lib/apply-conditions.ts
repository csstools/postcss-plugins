import type { AtRule, AtRuleProps } from 'postcss';
import type { Stylesheet} from './statement';
import { isImportStatement, isPreImportStatement, isWarning } from './statement';
import { base64EncodedConditionalImport } from './base64-encoded-import';

export function applyConditions(stylesheet: Stylesheet, atRule: (defaults?: AtRuleProps) => AtRule): void {
	stylesheet.statements.forEach((stmt, index) => {
		if (isWarning(stmt) || isPreImportStatement(stmt) || !stmt.conditions?.length) {
			return;
		}

		if (isImportStatement(stmt)) {
			stmt.node.params = base64EncodedConditionalImport(stmt.fullUri, stmt.conditions);
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

			if (typeof condition.scope !== 'undefined') {
				const scopeNode = atRule({
					name: 'scope',
					params: condition.scope,
					source: stmt.importingNode?.source ?? parent.source,
				});

				atRules.push(scopeNode);
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

		// wrap new rules with media query and/or layer at rule
		innerAtRule.append(nodes);

		stylesheet.statements[index] = {
			type: 'nodes',
			nodes: [outerAtRule],
			conditions: stmt.conditions,
			from: stmt.from,
			importingNode: stmt.importingNode,
		};
	});
}
