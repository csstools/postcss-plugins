import type { Rule } from 'postcss';
import type { NodeList } from '../../node-list';

export enum AttributeMatchingFlag {
	Exact = '',
	StartsWith = '^',
	EndsWith = '$',
	Contains = '*',
}

export function matchAttribute(list: NodeList, attributeName: string, attributeValue: string | null | undefined, flag: AttributeMatchingFlag, caseInsensitive = false): NodeList {
	if (attributeName.startsWith('__proto__') || attributeValue?.startsWith('__proto__')) {
		return [];
	}

	let attributeValueIsNullish = false;
	if (!attributeValue && attributeValue !== '') {
		attributeValueIsNullish = true;
	}

	let attributeValueString = '';
	if (!attributeValueIsNullish) {
		attributeValueString = attributeValue.toString();
	}

	if (caseInsensitive) {
		attributeValueString = attributeValueString.toLowerCase();
	}

	const filtered = list.filter((node) => {
		let matchingPropertyName = '';
		if (attributeName.toLowerCase() === 'variable' && node.type === 'decl' && ('variable' in node)) {
			matchingPropertyName = 'variable';
		} else {
			matchingPropertyName = Object.keys(node).find((nodePropertyKey) => {
				if (nodePropertyKey.toLowerCase() !== attributeName.toLowerCase()) {
					return false;
				}

				return Object.prototype.hasOwnProperty.call(node, nodePropertyKey);
			});
		}

		if (!matchingPropertyName) {
			return false;
		}

		if (typeof node[matchingPropertyName] === 'boolean') {
			// Matches when the value is true
			return node[matchingPropertyName];
		}

		if (attributeValueIsNullish) {
			// Already checked that "x" has a property for this name above.
			return true;
		}

		let foundValues = [node[matchingPropertyName].toString()];
		if (node.type === 'rule' && (matchingPropertyName === 'selector' || matchingPropertyName === 'selectors')) {
			foundValues = (node as Rule).selectors;
		}

		if (caseInsensitive) {
			foundValues = foundValues.map((foundValue) => foundValue.toLowerCase());
		}

		switch (flag) {
			case AttributeMatchingFlag.StartsWith:
				return !!foundValues.find((foundValue) => foundValue.startsWith(attributeValueString));
			case AttributeMatchingFlag.EndsWith:
				return !!foundValues.find((foundValue) => foundValue.endsWith(attributeValueString));
			case AttributeMatchingFlag.Contains:
				return !!foundValues.find((foundValue) => foundValue.includes(attributeValueString));
			case AttributeMatchingFlag.Exact:
			default:
				return !!foundValues.find((foundValue) => foundValue === attributeValueString);
		}
	});

	return filtered;
}
