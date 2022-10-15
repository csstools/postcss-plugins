import type { ShorthandProperty } from './shorthand-property';

export function generateVSCodeCustomDataInDirectory(atRuleName: string, shorthands: Map<string, ShorthandProperty>) {
	const result = {
		'version': 1.1,
		'properties': [],
		'atDirectives': [],
		'pseudoClasses': [],
		'pseudoElements': [],
	};

	if (atRuleName.toLowerCase() !== 'property') {
		result.atDirectives.push({
			'name': `@${atRuleName}`,
			'description': 'Define custom shorthands in CSS',
			'status': 'nonstandard',
			'references': [
				{
					'name': 'CSSWG issue',
					'url': 'https://github.com/w3c/csswg-drafts/issues/7879',
				},
			],
		});
	}

	for (const [name, shorthand] of shorthands) {
		const syntax = [];
		shorthand.constituentProperties.forEach((constituentProperty, index) => {
			const buckets = shorthand.syntax[index].buckets;

			const part = [];
			for (let i = 0; i < buckets; i++) {
				part.push(`<'${constituentProperty}'>`);
			}

			syntax.push(part.join(' '));
		});

		const keywords = Array.from(shorthand.values.keys());

		let syntaxDefinition = '';
		if (keywords.length) {
			syntaxDefinition = `${keywords.join(' | ')} | [ ${syntax.join(' ')} ]`;
		} else {
			syntaxDefinition = syntax.join(' ');
		}

		result.properties.push({
			'name': name,
			'description': 'Syntax: ' + syntaxDefinition,
			'references': shorthand.constituentProperties.filter((constituentProperty) => {
				return !constituentProperty.startsWith('-');
			}).map((constituentProperty) => {
				return {
					'name': constituentProperty,
					'url': `https://developer.mozilla.org/en-US/docs/Web/CSS/${constituentProperty}`,
				};
			}),
		});
	}

	return result;
}
