import type { PluginCreator } from 'postcss';
import selectorParser from 'postcss-selector-parser';
import type { Container } from 'postcss-selector-parser';

function nodeIsInsensitiveAttribute(node) {
	return node.type === 'attribute' && node.insensitive;
}

function selectorHasInsensitiveAttribute(selector) {
	return selector.some(nodeIsInsensitiveAttribute);
}

function transformString(strings, charPos, string) {
	const char = string.charAt(charPos);
	if (char === '') {
		return strings;
	}

	let newStrings = strings.map(x => x + char);
	const upperChar = char.toLocaleUpperCase();

	if (upperChar !== char) {
		newStrings = newStrings.concat(strings.map(x => x + upperChar));
	}

	return transformString(newStrings, charPos + 1, string);
}

function createSensitiveAttributes(attribute) {
	const attributes = transformString([''], 0, attribute.value);
	return attributes.map(x => {
		const newAttribute = attribute.clone({
			spaces: {
				after: attribute.spaces.after,
				before: attribute.spaces.before,
			},
			insensitive: false,
		});

		newAttribute.setValue(x);

		return newAttribute;
	});
}

function createNewSelectors(selector) {
	let newSelectors = [selectorParser.selector({value: '', nodes: []})];

	selector.walk(node => {
		if (!nodeIsInsensitiveAttribute(node)) {
			newSelectors.forEach(newSelector => {
				newSelector.append(node.clone());
			});
			return;
		}

		const sensitiveAttributes = createSensitiveAttributes(node);
		const newSelectorsWithSensitiveAttributes = [];

		sensitiveAttributes.forEach(newNode => {
			newSelectors.forEach(newSelector => {
				const newSelectorWithNewNode = newSelector.clone({}) as Container;
				newSelectorWithNewNode.append(newNode);
				newSelectorsWithSensitiveAttributes.push(newSelectorWithNewNode);
			});
		});

		newSelectors = newSelectorsWithSensitiveAttributes;
	});

	return newSelectors;
}

function transform(selectors) {
	let newSelectors = [];

	selectors.each(selector => {
		if (selectorHasInsensitiveAttribute(selector)) {
			newSelectors = newSelectors.concat(createNewSelectors(selector));
			selector.remove();
		}
	});

	if (newSelectors.length) {
		newSelectors.forEach(newSelector => selectors.append(newSelector));
	}
}

/** postcss-prefers-color-scheme plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			preserve: false,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-attribute-case-insensitive',
		prepare() {
			const transformedNodes = new WeakSet();

			return {
				Rule(rule, { result }) {
					if (transformedNodes.has(rule)) {
						return;
					}

					if (!(/i\s*]/gmi.test(rule.selector))) {
						return;
					}

					let modifiedSelector = rule.selector;

					try {
						modifiedSelector = selectorParser(transform).processSync(rule.selector);
					} catch (err) {
						rule.warn(result, `Failed to parse selector : "${rule.selector}" with message: "${err.message}"`);
						return;
					}

					if (modifiedSelector === rule.selector) {
						return;
					}

					transformedNodes.add(rule);
					rule.cloneBefore({ selector: modifiedSelector });

					if (!options.preserve) {
						rule.remove();
					}
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;

