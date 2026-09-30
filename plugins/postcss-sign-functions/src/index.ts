import type { PluginCreator } from 'postcss';
import { calcFromComponentValues } from '@csstools/css-calc';
import { NumberType, tokenize, TokenType } from '@csstools/css-tokenizer';
import type { ComponentValue} from '@csstools/css-parser-algorithms';
import { FunctionNode, isFunctionNode, parseCommaSeparatedListOfComponentValues, parseListOfComponentValues, replaceComponentValues, SimpleBlockNode, stringify, TokenNode, WhitespaceNode } from '@csstools/css-parser-algorithms';

/** postcss-sign-functions plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

const FUNCTION_CALL_REGEX = /(?<![-\w])(?:sign|abs)\(/i;
const ABS_CALL_REGEX = /(?<![-\w])(?:sign|abs)\(/i;
const IS_PROPERTY_REGEX = /^property$/i;

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options: pluginOptions = Object.assign(
		// Default options
		{
			preserve: false,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-sign-functions',
		Declaration(decl): void {
			if (!FUNCTION_CALL_REGEX.test(decl.value)) {
				return;
			}

			if (options.preserve && decl.parent?.type === 'atrule' && IS_PROPERTY_REGEX.test(decl.parent.name)) {
				return;
			}

			let componentValues: Array<Array<ComponentValue>>;
			if (ABS_CALL_REGEX.test(decl.value)) {
				componentValues = replaceComponentValues(
					parseCommaSeparatedListOfComponentValues(tokenize({ css: decl.value })),
					replacer,
				);
			} else {
				componentValues = parseCommaSeparatedListOfComponentValues(tokenize({ css: decl.value }));
			}

			const modifiedValue = stringify(calcFromComponentValues(componentValues, {
				precision: 5,
				toCanonicalUnits: true,
				calcWrapper: true,
			}));
			if (modifiedValue === decl.value) {
				return;
			}

			decl.cloneBefore({ value: modifiedValue });

			if (!options.preserve) {
				decl.remove();
			}
		},
	};
};

// `abs()` is expanded into a `max()` that references its contents twice.
// Nesting therefore doubles the amount of work at every level.
// Bound the number of tokens produced by a single expansion.
const MAX_EXPANSION_TOKENS = 100_000;

function replacer(componentValue: ComponentValue): Array<ComponentValue> | void {
	if (!isFunctionNode(componentValue)) {
		return;
	}

	if (componentValue.getName().toLowerCase() !== 'abs') {
		return;
	}

	const [value] = replaceComponentValues(
		[componentValue.value],
		replacer
	);

	// Materialize the tokens once and reuse them for both operands.
	// `parseListOfComponentValues` copies the tokens, so the resulting trees are independent.
	const tokens = value.flatMap(x => x.tokens());
	if (tokens.length > MAX_EXPANSION_TOKENS) {
		throw new Error('Maximum sign function expansion size exceeded, reduce the complexity of your expression');
	}

	return [new FunctionNode(
		[TokenType.Function, 'max(', -1, -1, { value: 'max' }],
		[TokenType.CloseParen, ')', -1, -1, undefined],
		[
			new SimpleBlockNode(
				[TokenType.OpenParen, '(', -1, -1, undefined],
				[TokenType.CloseParen, ')', -1, -1, undefined],
				parseListOfComponentValues(tokens)
			),
			new TokenNode(
				[TokenType.Comma, ',', -1, -1, undefined],
			),
			new WhitespaceNode(
				[[TokenType.Whitespace, ' ', -1, -1, undefined]],
			),
			new TokenNode(
				[TokenType.Number, '-1', -1, -1, { value: -1, type: NumberType.Integer, signCharacter: '-' }],
			),
			new WhitespaceNode(
				[[TokenType.Whitespace, ' ', -1, -1, undefined]],
			),
			new TokenNode(
				[TokenType.Delim, '*', -1, -1, { value: '*' }],
			),
			new WhitespaceNode(
				[[TokenType.Whitespace, ' ', -1, -1, undefined]],
			),
			new SimpleBlockNode(
				[TokenType.OpenParen, '(', -1, -1, undefined],
				[TokenType.CloseParen, ')', -1, -1, undefined],
				parseListOfComponentValues(tokens)
			)
		]
	)];
}

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
