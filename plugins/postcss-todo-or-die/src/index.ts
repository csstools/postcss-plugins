import type { AtRule, PluginCreator } from 'postcss';
import { tokenizer } from '@csstools/css-tokenizer';
import { isCommentNode, isFunctionNode, isWhitespaceNode, parseCommaSeparatedListOfComponentValues, ParserError } from '@csstools/css-parser-algorithms';
import { parseIfCondition } from './parse/if';
import { parseNotCondition } from './parse/not';
import { matchIfCondition } from './match/if';
import { matchNotCondition } from './match/not';
import browserslist from 'browserslist';
import { parseBrowserslistCondition } from './parse/browserslist';
import { matchBrowserslistCondition } from './match/browserslist';
import { died } from './died';
import { parseBeforeDateCondition } from './parse/before-data';
import { matchBeforeDateCondition } from './match/before-date';
import { parseIssueOpenCondition } from './parse/issue-open';
import { matchIssueOpenCondition } from './match/issue-open';

const creator: PluginCreator<never> = () => {
	const browsers = new Set(browserslist());

	const cache: Map<string, string> = new Map();

	return {
		postcssPlugin: 'postcss-todo-or-die',
		async Once(root, { result }) {
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
				const errorHandler = (err: ParserError) => {
					throw atRule.error(err.message);
				};

				const t = tokenizer({
					css: atRule.params,
				}, {
					onParseError: errorHandler,
				});

				const tokens = [];

				{
					while (!t.endOfFile()) {
						tokens.push(t.nextToken());
					}

					tokens.push(t.nextToken()); // EOF-token
				}

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
						case 'issue-open': {
							const conditionParams = parseIssueOpenCondition(todoOrDieCondition[0]);
							if (!conditionParams) {
								atRule.warn(result, 'Incorrect arguments in `issue-open()` function.');
								return;
							}

							const conditionResult = await matchIssueOpenCondition(conditionParams.repository, conditionParams.issue, cache);
							if (died(conditionResult)) {
								throw atRule.error(conditionResult);
							}

							break;
						}
						default:
							break;
					}
				}

				if (atRule.nodes && atRule.nodes.length) {
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
