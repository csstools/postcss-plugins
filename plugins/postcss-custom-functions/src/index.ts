import type { AtRule, AtRuleProps, Declaration, Plugin, PluginCreator } from 'postcss';
import type { CustomFunctionAndNode } from './custom-functions-from-root';
import { getCustomFunctions } from './custom-functions-from-root';
import { FunctionNode, isFunctionNode, parseCommaSeparatedListOfComponentValues, parseListOfComponentValues, replaceComponentValues, stringify, TokenNode } from '@csstools/css-parser-algorithms';
import { isTokenFunction, tokenize, TokenType } from '@csstools/css-tokenizer';
import type { ContainerWithChildren } from 'postcss/lib/container';
import type { CustomFunction } from '@csstools/custom-function-parser';

/** postcss-custom-functions plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

const HAS_CUSTOM_FUNCTION = /--.*?\(/i;

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
		postcssPlugin: 'postcss-custom-functions',
		prepare(): Plugin {
			// const transformedNodes = new WeakSet();
			let customFunctions: Map<string, CustomFunctionAndNode> = new Map();
			const callingContexts: Array<CallingContext> = [];

			return {
				postcssPlugin: 'postcss-custom-functions',
				Once(root, { result }): void {
					customFunctions = getCustomFunctions(root, result, { preserve: options.preserve });
				},
				OnceExit(root): void {
					callingContexts.forEach((callingContext) => {
						callingContext.registrations.forEach((registration) => {
							root.append(registration);
						});
					});
				},
				Declaration(decl, { atRule }): void {
					if (!HAS_CUSTOM_FUNCTION.test(decl.value)) {
						return;
					}

					const parent = decl.parent;
					if (!parent) {
						return;
					}

					const tokens = tokenize({ css: decl.value });
					if (!tokens.some((x) => isTokenFunction(x) && x[4].value.startsWith('--'))) {
						return;
					}

					const transformed = replaceComponentValues(
						[parseListOfComponentValues(tokens)],
						(componentValue) => {
							if (!isFunctionNode(componentValue)) {
								return;
							}

							const name = componentValue.getName();
							if (!name.startsWith('--')) {
								return;
							}

							const fn = customFunctions.get(name);
							if (!fn) {
								return;
							}

							const callingContext = new CallingContext(
								parent,
								parent,
								decl,
								componentValue,
								fn.function,
								fn.node,
								atRule,
							);

							if (callingContext.invalid) {
								// guaranteed invalid
								return new FunctionNode(
									[TokenType.Function, 'var(', -1, -1, { value: 'var' }],
									[TokenType.CloseParen, ')', -1, -1, undefined],
									[],
								);
							}

							parent.before(callingContext.argumentRule);
							parent.before(callingContext.bodyRule);
							callingContexts.push(callingContext);

							return new FunctionNode(
								[TokenType.Function, 'var(', -1, -1, { value: 'var' }],
								[TokenType.CloseParen, ')', -1, -1, undefined],
								[
									new TokenNode(
										[TokenType.Ident, callingContext.resultIdent, -1, -1, { value: callingContext.resultIdent }],
									)
								],
							);
						}
					);

					const modified = stringify(transformed);

					if (modified === decl.value) {
						return;
					}

					decl.cloneBefore({ value: modified });

					if (!options?.preserve) {
						decl.remove();
					}
				},
			};
		},
	};
};

function generateDashedIdent(type: string, name: string, id: string): string {
	const parts = [
		type,
		id,
		name,
	].filter((x) => !!x);

	return `--csstools-${parts.join('-')}`;
}

creator.postcss = true;

export default creator;

class CallingContext {
	static counter = 0;

	id: string;

	rootElement: ContainerWithChildren;
	element: ContainerWithChildren;
	property: Declaration;
	parent: CallingContext | null = null;

	function: FunctionNode;
	customFunction: CustomFunction;
	customFunctionBody: AtRule;

	registrations: Array<AtRule> = [];

	argumentRule: ContainerWithChildren;
	bodyRule: ContainerWithChildren;

	resultIdent: string;

	varCounter: number = 0;

	invalid: boolean = false;

	// TODO: some ident mapping

	constructor(
		rootElement: ContainerWithChildren,
		element: ContainerWithChildren,
		property: Declaration,

		fn: FunctionNode,
		customFunction: CustomFunction,
		customFunctionBody: AtRule,

		atRule: (defaults?: AtRuleProps) => AtRule,

		parent: CallingContext | null = null,
	) {
		this.id = (CallingContext.counter++).toString(36);

		this.rootElement = rootElement;
		this.element = element;
		this.property = property;

		this.function = fn;
		this.customFunction = customFunction;
		this.customFunctionBody = customFunctionBody;

		this.parent = parent;

		{
			const varCounterValue = (++this.varCounter).toString(36);
			this.resultIdent = generateDashedIdent('custom-function-call', varCounterValue, this.id);

			const args = parseCommaSeparatedListOfComponentValues(this.function.value.flatMap(x => x.tokens()));
			if (args.length > this.customFunction.parameters.length) {
				this.invalid = true;
			}

			this.customFunction.parameters.forEach((parameter) => {
				const parameterName = parameter.getName();
				const parameterType = parameter.getArgumentType() || '*';

				const argumentCustomProperty = atRule({
					name: 'property',
					params: generateDashedIdent('function-argument', parameterName, this.id),
					nodes: [
						this.property.clone({
							prop: 'syntax',
							value: `"${parameterType}"`,
						}),
						this.property.clone({
							prop: 'inherit',
							value: "false",
						})
					],
					source: this.property.source
				});

				this.registrations.push(argumentCustomProperty);

				const bodyCustomProperty = atRule({
					name: 'property',
					params: generateDashedIdent('function-body', parameterName, this.id),
					nodes: [
						this.property.clone({
							prop: 'syntax',
							value: '"*"',
						}),
						this.property.clone({
							prop: 'inherit',
							value: "false",
						})
					],
					source: this.property.source
				});

				this.registrations.push(bodyCustomProperty);
			});

			const returnType = this.customFunction.getReturnType();
			if (returnType) {
				const customProperty = atRule({
					name: 'property',
					params: generateDashedIdent('return-value', '', this.id),
					nodes: [
						this.property.clone({
							prop: 'syntax',
							value: `"${returnType}"`,
						}),
						this.property.clone({
							prop: 'inherit',
							value: "false",
						})
					],
					source: this.property.source
				});

				this.registrations.push(customProperty);
			}

			this.argumentRule = this.element.clone({ nodes: [] });

			this.customFunction.parameters.forEach((parameter, index) => {
				const parameterName = parameter.getName();
				const defaultValue = parameter.getDefaultValue();

				if (defaultValue) {
					this.argumentRule.append(this.property.clone({
						prop: generateDashedIdent('function-argument', parameterName, this.id),
						value: parameter.getDefaultValue(),
					}));
				}

				const argumentValue = args[index];
				// TODO: `{1, 2}` -> `1, 2`
				if (argumentValue) {
					this.argumentRule.append(this.property.clone({
						prop: generateDashedIdent('function-argument', parameterName, this.id),
						value: stringify([argumentValue]),
					}));
				}
			});

			this.bodyRule = this.element.clone({
				nodes: [
					...(this.customFunctionBody.nodes?.map((x) => x.clone()) ?? [])
				]
			});

			this.bodyRule.walkDecls(/^result$/i, (resultDecl) => {
				resultDecl.prop = this.resultIdent;
			});
		}
	}
}
