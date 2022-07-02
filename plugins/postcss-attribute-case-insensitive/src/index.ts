import type { PluginCreator } from 'postcss';
import selectorParser, { Container } from 'postcss-selector-parser';

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

function createSensitiveAtributes(attribute) {
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

		const sensitiveAttributes = createSensitiveAtributes(node);
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

const creator: PluginCreator<never> = () => {
	return {
		postcssPlugin: 'postcss-attribute-case-insensitive',
		Rule(rule) {
			if (rule.selector.includes('i]')) {
				const modifiedSelector = selectorParser(transform).processSync(rule.selector);
				if (modifiedSelector === rule.selector) {
					return;
				}

				rule.replaceWith(rule.clone({ selector: modifiedSelector }));
			}
		},
	};
};

creator.postcss = true;

export default creator;

