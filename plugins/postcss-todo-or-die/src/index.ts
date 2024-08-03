import type { AtRule, PluginCreator } from 'postcss';
import browserslist from 'browserslist';
import type { ParseError} from '@csstools/css-tokenizer';
import { tokenize } from '@csstools/css-tokenizer';
import { died } from './died';
import { isCommentNode, isFunctionNode, isWhitespaceNode, parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';
import { matchBeforeDateCondition } from './match/before-date';
import { matchBrowserslistCondition } from './match/browserslist';
import { matchIfCondition } from './match/if';
import { matchNotCondition } from './match/not';
import { parseBeforeDateCondition } from './parse/before-data';
import { parseBrowserslistCondition } from './parse/browserslist';
import { parseIfCondition } from './parse/if';
import { parseNotCondition } from './parse/not';

const creator: PluginCreator<never> = () => {
	const browsers = new Set(browserslist());

	return {
		postcssPlugin: 'postcss-todo-or-die',
		Once(root, { result }): void {
			const atRules: Array<AtRule> = [];

			root.walkAtRules((atRule) => {
				if (atRule.name.toLowerCase() !== 'todo-or-die') {
					return;
				}

				if (!atRule.params.trim()) {
					throw atRule.error('Rule must have valid params');
				}

				atRules.push(atRule);
			});

			for (const atRule of atRules) {
				const errorHandler = (err: ParseError): void => {
					throw atRule.error(err.message);
				};

				const tokens = tokenize({
					css: atRule.params,
				}, {
					onParseError: errorHandler,
				});

				const todoOrDieConditions = parseCommaSeparatedListOfComponentValues(tokens, {
					onParseError: errorHandler,
				});

				if (!todoOrDieConditions.length) {
					atRule.warn(result, 'Rule must have some valid params.');
					return;
				}

				for (let i = 0; i < todoOrDieConditions.length; i++) {
					const todoOrDieCondition = todoOrDieConditions[i].filter((x) => {
						return !isWhitespaceNode(x) && !isCommentNode(x);
					});

					if (todoOrDieCondition.length !== 1) {
						atRule.warn(result, 'Conditions must be split by commas when adding multiple in a list.');
						return;
					}

					if (!isFunctionNode(todoOrDieCondition[0])) {
						atRule.warn(result, 'Conditions must be one of the supported functions.');
						return;
					}

					switch (todoOrDieCondition[0].name[4].value.toLowerCase()) {
						case 'if': {
							const conditionParams = parseIfCondition(todoOrDieCondition[0]);
							if (!conditionParams) {
								atRule.warn(result, 'Incorrect arguments in `if()` function.');
								return;
							}

							const conditionResult = matchIfCondition(conditionParams);
							if (died(conditionResult)) {
								throw atRule.error(conditionResult);
							}

							break;
						}
						case 'not': {
							const conditionParams = parseNotCondition(todoOrDieCondition[0]);
							if (!conditionParams) {
								atRule.warn(result, 'Incorrect arguments in `not()` function.');
								return;
							}

							const conditionResult = matchNotCondition(conditionParams);
							if (died(conditionResult)) {
								throw atRule.error(conditionResult);
							}

							break;
						}
						case 'browserslist': {
							const conditionParams = parseBrowserslistCondition(todoOrDieCondition[0]);
							if (!conditionParams) {
								atRule.warn(result, 'Incorrect arguments in `browserslist()` function.');
								return;
							}

							const conditionResult = matchBrowserslistCondition(conditionParams, browsers);
							if (died(conditionResult)) {
								throw atRule.error(conditionResult);
							}

							break;
						}
						case 'before-date': {
							const conditionParams = parseBeforeDateCondition(todoOrDieCondition[0]);
							if (!conditionParams) {
								atRule.warn(result, 'Incorrect arguments in `before-date()` function.');
								return;
							}

							const conditionResult = matchBeforeDateCondition(conditionParams.year, conditionParams.month, conditionParams.day);
							if (died(conditionResult)) {
								throw atRule.error(conditionResult);
							}

							break;
						}
						default:
							break;
					}
				}

				if (atRule.nodes) {
					atRule.replaceWith(atRule.nodes);
				} else {
					atRule.remove();
				}
			}
		},
	};
};

creator.postcss = true;

export default creator;
