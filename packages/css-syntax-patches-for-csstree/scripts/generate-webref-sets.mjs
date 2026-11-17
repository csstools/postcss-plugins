import fs from 'node:fs/promises';
import path from 'node:path';
import css from '@webref/css';
import { definitionSyntax, fork } from 'css-tree';
import { generate_atrule_set, generate_set } from './generate-set.mjs';
import { trim_at } from './trim-at.mjs';

function assign_new_definition(set, name, definition) {
	const exists_in_set = set[name];

	if (exists_in_set && exists_in_set !== definition) {
		// eslint-disable-next-line no-console
		console.error(`duplicate definition ${name}`, definition);
	}

	set[name] = definition;
}

function is_block_marker(term) {
	if (term.type === 'Token') {
		return term.value === '{';
	}

	if (term.type === 'Group') {
		return term.terms.at(0)?.type === 'Token' &&
			term.terms.at(0).value === '{' &&
			term.terms.at(-1)?.type === 'Token' &&
			term.terms.at(-1).value === '}';
	}

	if (term.type === 'Multiplier') {
		return is_block_marker(term.term);
	}

	return false;
}

function prelude_of_atrule_alternative(atrule, alternative) {
	const terms = alternative.type === 'Group' ? alternative.terms : [alternative];

	if (terms.at(0)?.type !== 'AtKeyword' || terms.at(0).name !== atrule) {
		return null;
	}

	const prelude_terms = [];

	for (const term of terms.slice(1)) {
		if (is_block_marker(term)) {
			break;
		}

		prelude_terms.push(term);
	}

	if (prelude_terms.at(-1)?.type === 'Token' && prelude_terms.at(-1).value === ';') {
		prelude_terms.pop();
	}

	if (!prelude_terms.length) {
		return '';
	}

	return definitionSyntax.generate({
		...alternative,
		terms: prelude_terms,
	});
}

function assign_new_atrule_syntax(set, syntax) {
	const parsedSyntax = definitionSyntax.parse(syntax.trim());

	// At-rules with both a block and a statement form list one alternative per form.
	// `@layer <layer-name>? { <rule-list> } | @layer <layer-name>#;`
	const alternatives = parsedSyntax.combinator === '|' ? parsedSyntax.terms : [parsedSyntax];
	const first_alternative = alternatives.at(0);
	const first_terms = first_alternative.type === 'Group' ? first_alternative.terms : [first_alternative];
	const at_keyword = first_terms.at(0);

	if (at_keyword?.type !== 'AtKeyword') {
		return;
	}

	const atrule = at_keyword.name;
	const exists_in_set = set[atrule]?.prelude;

	if (exists_in_set) {
		// eslint-disable-next-line no-console
		console.error(`duplicate atrule prelude @${atrule} ${exists_in_set}`);
	}

	set[atrule] ??= Object.create(null);

	const preludes = [];
	let allows_empty_prelude = false;

	for (const alternative of alternatives) {
		const prelude = prelude_of_atrule_alternative(atrule, alternative);

		if (prelude === null) {
			return;
		}

		if (!prelude) {
			allows_empty_prelude = true;
			continue;
		}

		preludes.push(prelude);
	}

	if (!preludes.length) {
		return;
	}

	const prelude = preludes.join(' | ');

	set[atrule].prelude = allows_empty_prelude ? `[ ${prelude} ]?` : prelude;
}

function assign_new_atrule_descriptor_definition(set, atrule, name, definition) {
	const exists_in_set = set[atrule]?.descriptors?.[name];

	if (exists_in_set) {
		// eslint-disable-next-line no-console
		console.error(`duplicate atrule descriptor @${atrule} ${name}`);
	}

	set[atrule] ??= Object.create(null);
	set[atrule].descriptors ??= Object.create(null);

	set[atrule].descriptors[name] = definition;
}

export async function generate_webref_sets() {
	const atrules = Object.create(null);
	const properties = Object.create(null);
	const types = Object.create(null);

	// Set missing definitions
	{
		types['size-keyword'] = JSON.parse(await fs.readFile(path.join('raw-data', 'size-keywords.json'))).join(' | ');

		// https://github.com/w3c/csswg-drafts/issues/11127
		types['scroll-state-feature'] = '[ <scroll-state-feature-plain> | <scroll-state-feature-boolean> ]';
		types['scroll-state-feature-plain'] = '<scroll-state-feature-name> : <scroll-state-feature-value>';
		types['scroll-state-feature-boolean'] = '<scroll-state-feature-name>';
		types['scroll-state-feature-name'] = '<ident>';
		types['scroll-state-feature-value'] = '<ident>';

		// https://drafts.csswg.org/css-ui-4/#cursor
		types['url-set-option'] = '[ <url> | <string> ] [ <resolution> || type( <string> ) ]?';
		types['url-set()'] = 'url-set( <url-set-option># )';

		types['font-src-list'] = '[ <url> [ format(<font-format>)]? [ tech( <font-tech>#)]? | local(<family-name>) ]#';

		// https://drafts.csswg.org/pointer-animations-1/#animation-range-centering
		types['timeline-range-center-subject'] = '<ident>';

		// https://drafts.csswg.org/css-conditional-5/#typedef-supports-condition-name
		types['supports-condition-name'] = '<custom-ident>';

		// https://github.com/csstree/csstree/issues/300
		types['whole-value'] = '<declaration-value>';

		// https://github.com/w3c/csswg-drafts/issues/13092
		types['anchored-feature'] = 'fallback: <\'position-try-fallbacks\'>';

		// https://drafts.csswg.org/css-ui-4/
		types['url-set-option'] = '[ <url> | <string> ] [ <resolution> || type(<string>) ]?';
		types['url-set'] = 'image-set( <url-set-option># )';

		// https://drafts.csswg.org/css-conditional-5/
		types['style-feature-value'] = '<declaration-value>';

		// https://github.com/w3c/csswg-drafts/issues/13311
		types['voice-family-name'] = '<string> | <custom-ident>+';

		// https://github.com/w3c/csswg-drafts/issues/14466
		// https://github.com/w3c/webref/issues/2046
		types['sibling-index'] = 'sibling-index()';
		types['sibling-count'] = 'sibling-count()';

		// https://github.com/w3c/svgwg/issues/1259
		types['marker-ref'] = '<url>';

		assign_new_atrule_descriptor_definition(
			atrules,
			trim_at('position-try'),
			'position-anchor',
			'<\'position-anchor\'>',
		);

		assign_new_atrule_descriptor_definition(
			atrules,
			trim_at('position-try'),
			'position-area',
			'<\'position-area\'>',
		);

		[
			'margin',
			'margin-top',
			'margin-right',
			'margin-bottom',
			'margin-left',
		].forEach((prop) => {
			assign_new_atrule_descriptor_definition(
				atrules,
				trim_at('page'),
				prop,
				`<'${prop}'>`,
			);
		});
	}

	const data = await css.listAll();

	for (const atrule of data.atrules) {
		if (atrule.syntax) {
			assign_new_atrule_syntax(
				atrules,
				atrule.syntax,
			);
		}

		if (atrule.descriptors?.length) {
			for (const descriptor of atrule.descriptors) {
				if (descriptor.name.startsWith('-webkit-')) {
					continue;
				}

				if (!descriptor.syntax) {
					continue;
				}

				if (descriptor.type === 'discrete' || descriptor.type === 'range') {
					// definitions for features in `@container` and `@media`
					continue;
				}

				assign_new_atrule_descriptor_definition(
					atrules,
					trim_at(atrule.name),
					descriptor.name,
					descriptor.syntax,
				);
			}
		}
	}

	for (const property of data.properties) {
		if (property.name.startsWith('-webkit-')) {
			continue;
		}

		if (property.name === 'clip') {
			property.syntax = 'rect( <top> , <right> , <bottom> , <left> ) | rect( <top> <right> <bottom> <left> ) | auto';
		}

		if (!property.syntax) {
			continue;
		}

		assign_new_definition(
			properties,
			property.name,
			property.syntax,
		);
	}

	for (const t of data.types) {
		if (!t.syntax) {
			continue;
		}

		// A type can describe a complete at-rule, e.g. `location-rule`
		// is `@location <dashed-ident> { <declaration-list> }`.
		if (t.syntax.trimStart().startsWith('@')) {
			assign_new_atrule_syntax(atrules, t.syntax);
			continue;
		}

		if (t.name === 'content-list' && t.syntax === '[ <string> | <counter()> | <counters()> | <content()> | <attr()> ]+') {
			continue;
		}

		assign_new_definition(
			types,
			t.name,
			t.syntax,
		);
	}

	for (const f of data.functions) {
		if (f.name === 'type()' && f.for.length === 1 && f.for[0] === 'image-set()') {
			continue;
		}

		if (f.name === 'rect()' && f.for.length === 1 && f.for[0] === 'clip') {
			continue;
		}

		if (f.name === 'fit-content()' && f.syntax === 'fit-content(<length-percentage [0,∞]>)') {
			continue;
		}

		if (f.name === 'scale()' && f.syntax === 'scale( <number> , <number>? )') {
			continue;
		}

		if (f.name === 'scaleX()' && f.syntax === 'scaleX( <number> )') {
			continue;
		}

		if (f.name === 'scaleY()' && f.syntax === 'scaleY( <number> )') {
			continue;
		}

		if (f.name === 'calc-size()' && f.syntax === 'calc-size( <calc-size-basis>, <calc-sum> )') {
			f.syntax = 'calc-size( [ [ <calc-size-basis> , [ <calc-sum> | size ] ] | [ any , <calc-sum> ] ] )';
		}

		if (f.name === 'circle()' && f.syntax === 'circle( <radial-size>? [ at <position> ]? )') {
			f.syntax = 'circle( [ <radial-extent> | <length-percentage [0,∞]> ]? [ at <position> ]? )';
		}

		if (!f.syntax) {
			continue;
		}

		assign_new_definition(
			types,
			f.name,
			f.syntax,
		);
	}

	const forkedLexer = fork({
		atrules: atrules,
		properties: properties,
		types: types,
	}).lexer;

	const atrules_set = generate_atrule_set(forkedLexer.atrules);
	const properties_set = generate_set(forkedLexer.properties);
	const types_set = generate_set(forkedLexer.types);

	// https://drafts.csswg.org/css-conditional-5/
	types_set['style-feature-name'] = {
		syntax: '<dashed-ident> | ' + Object.keys(properties_set).sort().filter((x) => x !== '--*').join(' | '),
	};

	return {
		atrules: atrules_set,
		properties: properties_set,
		types: types_set,
	};
}
