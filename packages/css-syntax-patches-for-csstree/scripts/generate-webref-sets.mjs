import fs from 'node:fs/promises';
import path from 'node:path';
import css from '@webref/css';
import { fork } from 'css-tree';
import { generate_atrule_set, generate_set } from './generate-set.mjs';
import { trim_at } from './trim-at.mjs';

function assign_new_definition(set, name, definition) {
	const exists_in_set = set[name];

	if (exists_in_set && exists_in_set !== definition) {
		// eslint-disable-next-line no-console
		console.error(`duplicate definition ${name}`);
	}

	set[name] = definition;
}

function assign_new_atrule_descriptor_definition(set, atrule, name, definition) {
	const exists_in_set = set[atrule]?.descriptors?.[name];

	if (exists_in_set) {
		// eslint-disable-next-line no-console
		console.error(`duplicate atrule descriptor @${atrule} ${name}`);
	}

	set[atrule] ??= {
		descriptors: Object(null),
	};

	set[atrule].descriptors[name] = definition;
}

export async function generate_webref_sets() {
	const atrules = Object(null);
	const properties = Object(null);
	const types = Object(null);

	// Set missing definitions
	{
		types['attr-unit'] = JSON.parse(await fs.readFile(path.join('raw-data', 'units.json'))).join(' | ');

		types['size-keyword'] = JSON.parse(await fs.readFile(path.join('raw-data', 'size-keywords.json'))).join(' | ');

		// https://github.com/w3c/csswg-drafts/issues/11127
		types['scroll-state-feature'] = '<ident> : <ident>';

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
		types['url-set'] = 'image-set( [ [ <url> | <string> ] [ <resolution> || type(<string>) ]? ]# )';

		// https://drafts.csswg.org/css-conditional-5/
		types['style-feature-value'] = '<declaration-value>';

		// https://drafts.csswg.org/css-animations-2/#typedef-animation-action
		types['animation-action'] = 'none | play | pause | play-forwards | play-backwards | pause | reset | replay';

		// https://drafts.csswg.org/css-shapes-1/#typedef-shape-command
		types['move-command'] = 'move <command-end-point>';
		types['line-command'] = 'line <command-end-point>';
		types['horizontal-line-command'] = 'hline [ to [ <length-percentage> | left | center | right | x-start | x-end ] | by <length-percentage> ]';
		types['vertical-line-command'] = 'vline [ to [ <length-percentage> | top | center | bottom | y-start | y-end ] | by <length-percentage> ]';
		types['curve-command'] = 'curve [ [ to <position> with <control-point> [ / <control-point> ]? ] | [ by <coordinate-pair> with <relative-control-point> [ / <relative-control-point> ]? ] ]';
		types['smooth-command'] = 'smooth [ [ to <position> [ with <control-point> ]? ] | [ by <coordinate-pair> [ with <relative-control-point> ]? ] ]';
		types['arc-command'] = 'arc <command-end-point> [ [ of <length-percentage>{1,2} ] && <arc-sweep>? && <arc-size>? && [rotate <angle>]? ]';
		types['command-end-point'] = '[ to <position> | by <coordinate-pair> ]';
		types['control-point'] = '[ <position> | <relative-control-point> ]';
		types['relative-control-point'] = '<coordinate-pair> [ from [ start | end | origin ] ]?';
		types['coordinate-pair'] = '<length-percentage>{2}';
		types['arc-sweep'] = 'cw | ccw';
		types['arc-size'] = 'large | small';
	}

	const data = await css.listAll();

	for (const atrule of data.atrules) {
		if (!atrule.descriptors?.length) {
			continue;
		}

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

	for (const property of data.properties) {
		if (property.name.startsWith('-webkit-')) {
			continue;
		}

		if (property.name === 'clip') {
			property.syntax = 'rect( <top>, <right>, <bottom>, <left> ) | auto';
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

		if (t.name === 'content-list' && t.syntax === '[ <string> | <counter()> | <counters()> | <content()> | <attr()> ]+') {
			continue;
		}

		if (t.name === 'an+b') {
			continue;
		}

		if (t.name === 'boolean-expr') {
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

	// https://github.com/csstree/csstree/issues/292
	types_set['ray()'] = {
		syntax: 'ray( [ <angle> && <ray-size>? && contain? && [ at <position> ]? ] )',
	};

	return {
		atrules: atrules_set,
		properties: properties_set,
		types: types_set,
	};
}
