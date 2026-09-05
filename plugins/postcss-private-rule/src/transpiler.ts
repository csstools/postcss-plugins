import type { AtRule, Declaration, Node, Rule } from 'postcss';
import crypto from 'node:crypto';
import path from 'node:path';
import { findAllStyleRules, findPrivateRule } from './valid-atrules';
import { isTokenIdent, mutateIdent, tokenize } from '@csstools/css-tokenizer';
import { isFunctionNode, isTokenNode, isWhiteSpaceOrCommentNode, parseListOfComponentValues, stringify, walk } from '@csstools/css-parser-algorithms';

const HAS_VAR_OR_IF_FUNCTION_REGEX = /\b(var|if)\(/i;
const IS_CONTAINER_REGEX = /^container$/i;
const IS_IF_FUNCTION_REGEX = /^if$/i;
const IS_STYLE_FUNCTION_REGEX = /^style$/i;
const IS_VAR_FUNCTION_REGEX = /^var$/i;

export class Transpiler {
	privateForRule: WeakMap<Rule | AtRule, { prefix: string, privateProperties: Set<string> }> = new Map();

	counter = 0;

	getOrFillPrivateForRule(rule: Rule | AtRule): { prefix: string, privateProperties: Set<string> } {
		const existing = this.privateForRule.get(rule);
		if (existing) {
			return existing;
		}

		let fromHash;
		if (rule.source?.input.from) {
			const hash = crypto.createHash('md5');
			hash.update(path.basename(path.dirname(rule.source?.input.from)) + '/' + path.basename(rule.source?.input.from), 'utf8');
			fromHash = hash.digest('hex').slice(0, 8);
		} else {
			const hash = crypto.createHash('md5');
			hash.update('<input>', 'utf8');
			fromHash = hash.digest('hex').slice(0, 8);
		}

		const prefix = `--_csstools-p-${fromHash}-${this.counter.toString(36)}`;
		this.counter++;

		const out: { prefix: string, privateProperties: Set<string> } = {
			prefix: prefix,
			privateProperties: new Set()
		};

		this.privateForRule.set(rule, out);

		return out;
	};

	getStyleRulesWithPrivateProperties(node: Node): Array<{ prefix: string, privateProperties: Set<string>, rule: Rule }> {
		return findAllStyleRules(node).map((rule) => {
			const p = this.privateForRule.get(rule);
			if (!p) {
				return false;
			}

			return {
				prefix: p.prefix,
				privateProperties: p.privateProperties,
				rule: rule,
			};
		}).filter(Boolean) as Array<{ prefix: string, privateProperties: Set<string>, rule: Rule }>;
	};

	registerAndRemovePrivateRules(atRule: AtRule, ownerNode: AtRule | Rule): void {
		if (!atRule.nodes?.length) {
			return;
		}

		const { prefix, privateProperties } = this.getOrFillPrivateForRule(ownerNode);

		atRule.walk((node) => {
			if (node.type === 'decl' && node.variable && node.prop.startsWith('--')) {
				privateProperties.add(node.prop);

				node.prop = `${prefix}${node.prop}`;

				return;
			}

			if (node.type === 'atrule' && findPrivateRule(node) === atRule) {
				// nesting group rules are allowed inside private.
				// these are allowed if we can find a private at rule from the current node
				// and it is the same private at rule as what we started with.
				return;
			}

			// anything else is not allowed and we simply drop it.
			node.remove();
		});

		atRule.nodes.forEach((node) => {
			atRule.before(node.clone());
		});

		atRule.remove();
	}

	transpileDeclaration(decl: Declaration): void {
		this.transpileDeclarationPropertyNames(decl);
		this.transpileDeclarationValues(decl);
	}

	transpileDeclarationPropertyNames(decl: Declaration): void {
		if (!decl.variable || !decl.prop.startsWith('--')) return;

		const styleRulesWithPrivateProperties = this.getStyleRulesWithPrivateProperties(decl);

		if (!styleRulesWithPrivateProperties.length) return;

		let foundPrefix: string | false = false;

		for (const { prefix, privateProperties } of styleRulesWithPrivateProperties) {
			if (privateProperties.has(decl.prop)) {
				foundPrefix = prefix;
				break;
			}
		}

		if (!foundPrefix) return;

		const replacement = `${foundPrefix}${decl.prop}`;

		if (decl.prop === replacement) return;

		decl.prop = replacement;
	}

	transpileDeclarationValues(decl: Declaration): void {
		if (!HAS_VAR_OR_IF_FUNCTION_REGEX.test(decl.value)) return;

		const styleRulesWithPrivateProperties = this.getStyleRulesWithPrivateProperties(decl);

		if (!styleRulesWithPrivateProperties.length) return;

		const componentValues = parseListOfComponentValues(tokenize({ css: decl.value }));

		walk(componentValues, (entry) => {
			if (!isFunctionNode(entry.node)) {
				return;
			}

			if (IS_VAR_FUNCTION_REGEX.test(entry.node.getName())) {
				const args = entry.node.value;
				for (let i = 0; i < args.length; i++) {
					const arg = args[i];

					if (isWhiteSpaceOrCommentNode(arg)) continue;

					if (!isTokenNode(arg) || !isTokenIdent(arg.value) || !arg.value[4].value.startsWith('--')) break;

					const propertyName = arg.value[4].value;
					let foundPrefix: string | false = false;

					for (const { prefix, privateProperties } of styleRulesWithPrivateProperties) {
						if (privateProperties.has(propertyName)) {
							foundPrefix = prefix;
							break;
						}
					}

					if (!foundPrefix) break;

					mutateIdent(arg.value, `${foundPrefix}${arg.value[4].value}`);
					break;
				}

				return;
			}

			if (IS_IF_FUNCTION_REGEX.test(entry.node.getName())) {
				const args = entry.node.value;
				for (let i = 0; i < args.length; i++) {
					const arg = args[i];

					if (isWhiteSpaceOrCommentNode(arg)) continue;

					if (!isFunctionNode(arg) || !IS_STYLE_FUNCTION_REGEX.test(arg.getName())) break;

					const childArgs = arg.value;
					for (let j = 0; j < childArgs.length; j++) {
						const childArg = childArgs[j];

						if (isWhiteSpaceOrCommentNode(childArg)) continue;

						if (!isTokenNode(childArg) || !isTokenIdent(childArg.value) || !childArg.value[4].value.startsWith('--')) break;

						const propertyName = childArg.value[4].value;
						let foundPrefix: string | false = false;

						for (const { prefix, privateProperties } of styleRulesWithPrivateProperties) {
							if (privateProperties.has(propertyName)) {
								foundPrefix = prefix;
								break;
							}
						}

						if (!foundPrefix) return;

						mutateIdent(childArg.value, `${foundPrefix}${childArg.value[4].value}`);
						break;
					}
				}
			}
		});

		const replacement = stringify([componentValues]);
		if (replacement === decl.value) {
			return;
		}

		decl.value = replacement;
	}

	transpileAtRule(atRule: AtRule): void {
		if (!IS_CONTAINER_REGEX.test(atRule.name)) return;

		if (!atRule.params.includes('--')) return;

		const styleRulesWithPrivateProperties = this.getStyleRulesWithPrivateProperties(atRule);

		if (!styleRulesWithPrivateProperties.length) return;

		const componentValues = parseListOfComponentValues(tokenize({ css: atRule.params }));

		walk(componentValues, (entry) => {
			if (!isFunctionNode(entry.node)) return;

			if (!IS_STYLE_FUNCTION_REGEX.test(entry.node.getName())) return;

			const args = entry.node.value;
			for (let i = 0; i < args.length; i++) {
				const arg = args[i];

				if (isWhiteSpaceOrCommentNode(arg)) continue;

				if (!isTokenNode(arg) || !isTokenIdent(arg.value) || !arg.value[4].value.startsWith('--')) break;

				const propertyName = arg.value[4].value;
				let foundPrefix: string | false = false;

				for (const { prefix, privateProperties } of styleRulesWithPrivateProperties) {
					if (privateProperties.has(propertyName)) {
						foundPrefix = prefix;
						break;
					}
				}

				if (!foundPrefix) break;

				mutateIdent(arg.value, `${foundPrefix}${arg.value[4].value}`);
				break;
			}
		});

		const replacement = stringify([componentValues]);
		if (replacement === atRule.params) {
			return;
		}

		atRule.params = replacement;
	}
}
