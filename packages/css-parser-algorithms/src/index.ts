/**
 * Parse CSS following the {@link https://drafts.csswg.org/css-syntax/#parsing | CSS Syntax Level 3 specification}.
 *
 * @remarks
 * The tokenizing and parsing tools provided by CSS Tools are designed to be low level and generic with strong ties to their respective specifications.
 *
 * Any analysis or mutation of CSS source code should be done with the least powerful tool that can accomplish the task.
 * For many applications it is sufficient to work with tokens.
 * For others you might need to use {@link https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms | @csstools/css-parser-algorithms} or a more specific parser.
 *
 * The implementation of the AST nodes is kept lightweight and simple.
 * Do not expect magic methods, instead assume that arrays and class instances behave like any other JavaScript.
 *
 * @example
 * Parse a string of CSS into a component value:
 * ```js
 * import { tokenize } from '@csstools/css-tokenizer';
 * import { parseComponentValue } from '@csstools/css-parser';
 *
 * const myCSS = `calc(1px * 2)`;
 *
 * const componentValue = parseComponentValue(tokenize({
 * 	css: myCSS,
 * }));
 *
 * console.log(componentValue);
 * ```
 *
 * @example
 * Use the right algorithm for the job.
 *
 * If your context allows a list of component values, use {@link parseListOfComponentValues}:
 * ```js
 * import { tokenize } from '@csstools/css-tokenizer';
 * import { parseListOfComponentValues } from '@csstools/css-parser';
 *
 * parseComponentValue(tokenize({ css: `10x 20px` }));
 * ```
 *
 * If your context allows a comma-separated list of component values, use {@link parseCommaSeparatedListOfComponentValues}:
 * ```js
 * import { tokenize } from '@csstools/css-tokenizer';
 * import { parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser';
 *
 * parseCommaSeparatedListOfComponentValues(tokenize({ css: `20deg, 50%, 30%` }));
 * ```
 *
 * @example
 * Use the stateful walkers to keep track of the context of a given component value.
 *
 * ```js
 * import { tokenize } from '@csstools/css-tokenizer';
 * import { parseComponentValue, isSimpleBlockNode } from '@csstools/css-parser';
 *
 * const myCSS = `calc(1px * (5 / 2))`;
 *
 * const componentValue = parseComponentValue(tokenize({ css: myCSS }));
 *
 * let state = { inSimpleBlock: false };
 * componentValue.walk((entry) => {
 * 	if (isSimpleBlockNode(entry)) {
 * 		entry.state.inSimpleBlock = true;
 * 		return;
 * 	}
 *
 * 	if (entry.state.inSimpleBlock) {
 * 		console.log(entry.node.toString()); // `5`, ...
 * 	}
 * }, state);
 * ```
 *
 * @packageDocumentation
 */

export type {
	ContainerNode,
	ComponentValue,
} from './consume/component-block-function';
export {
	ContainerNodeBaseClass,
	FunctionNode,
	SimpleBlockNode,
	WhitespaceNode,
	CommentNode,
	TokenNode,
} from './consume/component-block-function';
export { parseComponentValue } from './parse/component-value';
export { parseListOfComponentValues } from './parse/list-of-component-values';
export { parseCommaSeparatedListOfComponentValues } from './parse/comma-separated-list-of-component-values';
export { gatherNodeAncestry } from './util/node-ancestry';
export { replaceComponentValues } from './util/replace-component-values';
export { stringify } from './util/stringify';
export { walkerIndexGenerator } from './util/walker-index-generator';
export { ComponentValueType } from './util/component-value-type';
export {
	isCommentNode,
	isFunctionNode,
	isSimpleBlockNode,
	isTokenNode,
	isWhitespaceNode,
} from './util/type-predicates';
export { sourceIndices } from './util/source-indices';
