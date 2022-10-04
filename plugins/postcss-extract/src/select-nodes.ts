import type { Node, Container } from 'postcss';
import selectorParser from 'postcss-selector-parser';
import type { NodeList } from './node-list';
import { notPseudo } from './pseudos/not';
import { adjacentSiblingCombinator } from './selector-engine/combinators/adjacent-sibling';
import { childCombinator } from './selector-engine/combinators/child';
import { descendantCombinator } from './selector-engine/combinators/descendant';
import { generalSiblingCombinator } from './selector-engine/combinators/general-sibling';
import { AttributeMatchingFlag, matchAttribute } from './selector-engine/matchers/attribute';
import { matchTagName } from './selector-engine/matchers/tag-name';
import { simplifyASTNode } from './simplify-ast-nodes';

export function extract(container: Container<Node>, selectors: Map<string, selectorParser.Root>): Record<string, Array<Record<string, unknown>>> {
	const output: Record<string, Array<Record<string, unknown>>> = {};

	for (const [key, selectorRoot] of selectors) {
		let result: Set<Node> = new Set();

		selectorRoot.each((selector) => {
			result = selectNodesForSingleQuery(container, selector, result);
		});

		output[key] = [];
		for (const node of result) {
			output[key].push(simplifyASTNode(node));
		}
	}

	return output;
}

export function selectNodesForSingleQuery(container: Container<Node>, selector: selectorParser.Selector, previouslyMatchedNodes: Set<Node>): Set<Node> {
	const query = buildQuery(selector);
	const matchingNodes: Set<Node> = new Set(previouslyMatchedNodes);

	container.walk((candidate) => {
		if (matchingNodes.has(candidate)) {
			return;
		}

		const matchingTreeRoots = executeConditions(query, [candidate]);
		if (matchingTreeRoots.length > 0) {
			matchingNodes.add(candidate);
		}
	});

	return matchingNodes;
}

function buildQuery(selector: selectorParser.Selector) {
	if (!selector || !selector.nodes) {
		return;
	}

	let currentCondition: Condition|null = null;
	selector.each((selectorPart) => {
		switch (selectorPart.type) {
			case 'universal': {
				currentCondition = {
					next: currentCondition,
					run: (list: NodeList): NodeList => {
						return list;
					},
				};
				break;
			}
			case 'combinator': {
				switch (selectorPart.value) {
					case ' ':
						currentCondition = {
							next: currentCondition,
							run: (list: NodeList): NodeList => {
								return descendantCombinator(list);
							},
						};
						break;
					case '>':
						currentCondition = {
							next: currentCondition,
							run: (list: NodeList): NodeList => {
								return childCombinator(list);
							},
						};
						break;
					case '+':
						currentCondition = {
							next: currentCondition,
							run: (list: NodeList): NodeList => {
								return adjacentSiblingCombinator(list);
							},
						};
						break;
					case '~':
						currentCondition = {
							next: currentCondition,
							run: (list: NodeList): NodeList => {
								return generalSiblingCombinator(list);
							},
						};
						break;
					default:
						currentCondition = {
							next: currentCondition,
							run: (): NodeList => {
								return [];
							},
						};
				}
				break;
			}
			case 'tag': {
				currentCondition = {
					next: currentCondition,
					run: (list: NodeList): NodeList => {
						return matchTagName(list, selectorPart.value);
					},
				};
				break;
			}
			case 'pseudo': {
				switch (selectorPart.value) {
					case ':not': {
						currentCondition = {
							next: currentCondition,
							run: (list: NodeList): NodeList => {
								const notQueries = selectorPart.nodes.map((notSelectorPart) => {
									return buildQuery(notSelectorPart);
								});

								const exclude = list.filter((excludeCandidate) => {
									return notQueries.flatMap((notQuery) => {
										return executeConditions(notQuery, [excludeCandidate]);
									}).length > 0;
								});

								return notPseudo(list, exclude);
							},
						};
						break;
					}
					default:
						currentCondition = {
							next: currentCondition,
							run: (): NodeList => {
								return [];
							},
						};
						break;
				}
				break;
			}
			case 'attribute': {
				switch (selectorPart.operator) {
					case '^=':
						currentCondition = {
							next: currentCondition,
							run: (list: NodeList): NodeList => {
								return matchAttribute(list, selectorPart.attribute, selectorPart.value, AttributeMatchingFlag.StartsWith, selectorPart.insensitive);
							},
						};
						break;
					case '$=':
						currentCondition = {
							next: currentCondition,
							run: (list: NodeList): NodeList => {
								return matchAttribute(list, selectorPart.attribute, selectorPart.value, AttributeMatchingFlag.EndsWith, selectorPart.insensitive);
							},
						};
						break;
					case '*=':
						currentCondition = {
							next: currentCondition,
							run: (list: NodeList): NodeList => {
								return matchAttribute(list, selectorPart.attribute, selectorPart.value, AttributeMatchingFlag.Contains, selectorPart.insensitive);
							},
						};
						break;
					case '=':
					default:
						currentCondition = {
							next: currentCondition,
							run: (list: NodeList): NodeList => {
								return matchAttribute(list, selectorPart.attribute, selectorPart.value, AttributeMatchingFlag.Exact, selectorPart.insensitive);
							},
						};
						break;
				}
				break;
			}
			default:
				currentCondition = {
					next: currentCondition,
					run: (): NodeList => {
						return [];
					},
				};
		}
	});

	return currentCondition;
}

type Condition = {
	next?: Condition,
	run: (list: NodeList) => NodeList,
}

function executeConditions(condition: Condition, list: NodeList): NodeList {
	let currentCondition = condition;
	let currentList = list;

	while (currentCondition && currentList.length > 0) {
		currentList = currentCondition.run(currentList);
		currentCondition = currentCondition.next;
	}

	return currentList;
}
