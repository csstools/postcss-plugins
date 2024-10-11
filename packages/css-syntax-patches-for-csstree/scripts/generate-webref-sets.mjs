import css from '@webref/css';
import { fork } from 'css-tree-3.0.0';
import { generate_set } from './generate-set.mjs';
import { trim_lt_gt } from './trim-lt-gt.mjs';

const IGNORED_SPECS = new Set([
	// 'a-spec',
]);

const IGNORED_TYPES = new Map([
	['<an+b>', '*'],
	// ['a-type', new Set(['a-spec'])],
]);

function is_ignored_type(type, spec_name) {
	const is_ignored = IGNORED_TYPES.get(type);
	return is_ignored && (is_ignored === '*' || is_ignored.has(spec_name));
}

const CUSTOM_OVERRIDES = {
	'css-gcpm': {
		'content-list': {
			'syntax-b': '[ <string> | <counter()> | <counters()> | <content()> | <attr()> ]+',
			'syntax-a': '[ <string> | <image> | <attr()> | contents | <quote> | <leader()> | <target> | <string()> | <content()> | <counter> | <counter()> | <counters()> ]+',
		},
	},
	'css-color-6': {
		// TODO : remove this override when `css-color-6` is updated
		'contrast-color()': {
			'syntax-b': 'contrast-color( [ [ <color> && [ tbd-fg | tbd-bg ] && <target-contrast>? ] | [ <color> && [ tbd-fg | tbd-bg ] && <target-contrast>, <color># ] ] )',
			'syntax-a': 'contrast-color( <color> max? )',
		},
	},
	'motion': {
		// See : https://github.com/w3c/fxtf-drafts/pull/573
		'ray()': {
			'syntax-b': 'ray( <angle> && <ray-size>? && contain? && [at <position>]? )',
			'syntax-a': 'ray( [ <angle> && <ray-size>? && contain? && [at <position>]? ] )',
		},
	},
};

function maybe_override(spec_name, name, definition) {
	const override = CUSTOM_OVERRIDES[spec_name]?.[name];
	if (!override) {
		return definition;
	}

	if (override['syntax-b'] !== definition) {
		throw new Error(`Override is obsolete: '${spec_name}' - '${name}'`);
	}

	return override['syntax-a'];
}

const SPECS = [
	['CSS', []],
	['SVG', []],
	['compat', []],
	['compositing', []],
	['css-align', []],
	['css-animations', []],
	['css-animations-2', []],
	['css-backgrounds', []],
	['css-backgrounds-4', []],
	['css-borders', []],
	['css-box', []],
	['css-break', []],
	['css-cascade', []],
	['css-cascade-6', []],
	['css-color', []],
	['css-color-5', []],
	['css-color-6', []],
	['css-color-adjust', []],
	['css-color-hdr', ['css-color-5']],
	['css-conditional', []],
	['css-conditional-4', []],
	['css-conditional-5', []],
	['css-contain', []],
	['css-content', []],
	['css-counter-styles', []],
	['css-display', []],
	['css-easing', []],
	['css-env', []],
	['css-exclusions', []],
	['css-extensions', []],
	['css-flexbox', []],
	['css-fonts', []],
	['css-fonts-5', []],
	['css-page-floats', []],
	['css-grid', []],
	['css-grid-3', []],
	['css-highlight-api', []],
	['css-images', []],
	['css-images-4', []],
	['css-images-5', []],
	['css-inline', []],
	['css-layout-api', []],
	['css-line-grid', []],
	['css-link-params', []],
	['css-lists', []],
	['css-logical', []],
	['css-masking', []],
	['css-mixins', []],
	['css-multicol', []],
	['css-multicol-2', []],
	['css-namespaces', []],
	['css-nav', []],
	['css-nesting', []],
	['css-overflow', []],
	['css-overflow-4', []],
	['css-overflow-5', []],
	['css-overscroll', []],
	['css-page', []],
	['css-paint-api', []],
	['css-position', []],
	['css-gcpm', ['css-content', 'css-position', 'css-page-floats']],
	['css-gcpm-4', []],
	['css-position-4', []],
	['css-properties-values-api', []],
	['css-pseudo', []],
	['css-regions', []],
	['css-rhythm', []],
	['css-round-display', []],
	['css-ruby', []],
	['css-scoping', []],
	['css-scroll-anchoring', []],
	['css-scroll-snap', []],
	['css-scroll-snap-2', []],
	['css-scrollbars', []],
	['css-shadow-parts', []],
	['css-shapes', []],
	['css-shapes-2', []],
	['css-size-adjust', []],
	['css-sizing', ['css-multicol']],
	['css-sizing-4', ['css-logical']],
	['css-anchor-position', ['css-box', 'css-position', 'css-position-4', 'css-sizing', 'css-sizing-4']],
	['css-speech', []],
	['css-syntax', []],
	['css-tables', []],
	['css-text', []],
	['mathml-core', ['css-text', 'css-display', 'css-grid-3']],
	['css-text-4', ['mathml-core']],
	['css-text-decor', []],
	['css-text-decor-4', []],
	['css-transforms', []],
	['css-transforms-2', []],
	['css-transitions', []],
	['css-transitions-2', []],
	['css-ui', []],
	['css-values', []],
	['css-values-5', []],
	['css-variables', []],
	['css-view-transitions', []],
	['css-view-transitions-2', []],
	['css-viewport', []],
	['css-will-change', []],
	['css-writing-modes', []],
	['fill-stroke', []],
	['filter-effects', []],
	['filter-effects-2', []],
	['html', []],
	['mediaqueries', []],
	['mediaqueries-5', []],
	['motion', []],
	['scroll-animations', []],
	['selectors', []],
	['svg-strokes', []],
	['upgrade-insecure-requests', []],
	['webvtt', []],
];

SPECS.forEach(([spec, dependencies], index) => {
	if (!dependencies.length) {
		return;
	}

	const dependencyIndices = dependencies.map((dependency) => {
		return SPECS.findIndex((x) => x[0] === dependency);
	});

	if (Math.min(...dependencyIndices) > index) {
		console.log(spec, index, dependencies, dependencyIndices);

		throw new Error('SPECS in correctly sorted by dependency');
	}
});

function type_delta_key(name, from_spec, to_spec) {
	return `type;;${name};;${from_spec};;${to_spec}`;
}

const type_deltas = new Set([
	type_delta_key('media-feature', 'mediaqueries', 'mediaqueries-5'),
	type_delta_key('media-in-parens', 'mediaqueries', 'mediaqueries-5'),

	type_delta_key('letter-spacing', 'css-text', 'css-text-4'),

	type_delta_key('single-transition', 'css-transitions', 'css-transitions-2'),

	type_delta_key('linear-color-stop', 'css-images', 'css-images-4'),
	type_delta_key('radial-gradient-syntax', 'css-images', 'css-images-4'),
	type_delta_key('linear-gradient-syntax', 'css-images', 'css-images-4'),
	type_delta_key('gradient', 'css-images', 'css-images-4'),
	type_delta_key('image', 'css-images', 'css-images-4'),

	type_delta_key('content-list', 'css-content', 'css-gcpm'),

	type_delta_key('supports-feature', 'css-conditional', 'css-conditional-4'),

	type_delta_key('supports-feature', 'css-conditional', 'css-conditional-5'),

	type_delta_key('supports-feature', 'css-conditional-4', 'css-conditional-5'),

	type_delta_key('predefined-rgb', 'css-color-5', 'css-color-hdr'),
	type_delta_key('colorspace-params', 'css-color-5', 'css-color-hdr'),

	type_delta_key('color-interpolation-method', 'css-color', 'css-color-5'),
	type_delta_key('color-space', 'css-color', 'css-color-5'),
	type_delta_key('oklch()', 'css-color', 'css-color-5'),
	type_delta_key('lch()', 'css-color', 'css-color-5'),
	type_delta_key('oklab()', 'css-color', 'css-color-5'),
	type_delta_key('lab()', 'css-color', 'css-color-5'),
	type_delta_key('hwb()', 'css-color', 'css-color-5'),
	type_delta_key('modern-hsla-syntax', 'css-color', 'css-color-5'),
	type_delta_key('modern-hsl-syntax', 'css-color', 'css-color-5'),
	type_delta_key('modern-rgba-syntax', 'css-color', 'css-color-5'),
	type_delta_key('modern-rgb-syntax', 'css-color', 'css-color-5'),
	type_delta_key('color-base', 'css-color', 'css-color-5'),
	type_delta_key('color', 'css-color', 'css-color-5'),

	type_delta_key('bg-position', 'css-backgrounds', 'css-backgrounds-4'),
	type_delta_key('repeat-style', 'css-backgrounds', 'css-backgrounds-4'),

	type_delta_key('single-animation', 'css-animations', 'css-animations-2'),

	type_delta_key('position', 'css-values', 'css-values-5'),
]);

const seen_type_definitions = new Map();
function is_conflicting_type(spec_name, name, syntax) {
	if (seen_type_definitions.has(name)) {
		const other_occurrences = seen_type_definitions.get(name);
		other_occurrences.forEach((other_occurrence) => {
			if (syntax === other_occurrence.syntax) {
				return;
			}

			if (type_deltas.has(type_delta_key(name, other_occurrence.spec_name, spec_name))) {
				return;
			}

			console.log(`
Type '${name}' from '${spec_name}' previously occurred in '${other_occurrence.spec_name}'
    ours: ${syntax}
  theirs: ${other_occurrence.syntax}

  // type_delta_key('${name}', '${other_occurrence.spec_name}', '${spec_name}'),
  --
`);
			throw new Error('Ambiguous spec definition');
		});

		other_occurrences.push({
			name: name,
			spec_name: spec_name,
			syntax: syntax,
		});

		seen_type_definitions.set(name, other_occurrences);

		return;
	}

	seen_type_definitions.set(name, [{
		name: name,
		spec_name: spec_name,
		syntax: syntax,
	}]);
}

function property_delta_key(name, from_spec, to_spec) {
	return `property;;${name};;${from_spec};;${to_spec}`;
}

const property_deltas = new Set([
	property_delta_key('text-underline-position', 'css-text-decor', 'css-text-decor-4'),

	property_delta_key('text-transform', 'css-text', 'mathml-core'),

	property_delta_key('display', 'css-display', 'mathml-core'),

	property_delta_key('text-shadow', 'css-text-decor', 'css-text-decor-4'),
	property_delta_key('text-decoration', 'css-text-decor', 'css-text-decor-4'),
	property_delta_key('text-decoration-line', 'css-text-decor', 'css-text-decor-4'),

	property_delta_key('letter-spacing', 'css-text', 'css-text-4'),
	property_delta_key('word-spacing', 'css-text', 'css-text-4'),
	property_delta_key('text-justify', 'css-text', 'css-text-4'),
	property_delta_key('text-align-all', 'css-text', 'css-text-4'),
	property_delta_key('text-align', 'css-text', 'css-text-4'),
	property_delta_key('word-break', 'css-text', 'css-text-4'),
	property_delta_key('white-space', 'css-text', 'css-text-4'),
	property_delta_key('text-transform', 'css-text', 'css-text-4'),

	property_delta_key('max-block-size', 'css-logical', 'css-sizing-4'),
	property_delta_key('max-inline-size', 'css-logical', 'css-sizing-4'),
	property_delta_key('min-block-size', 'css-logical', 'css-sizing-4'),
	property_delta_key('min-inline-size', 'css-logical', 'css-sizing-4'),
	property_delta_key('block-size', 'css-logical', 'css-sizing-4'),
	property_delta_key('inline-size', 'css-logical', 'css-sizing-4'),

	property_delta_key('max-height', 'css-sizing', 'css-sizing-4'),
	property_delta_key('max-width', 'css-sizing', 'css-sizing-4'),
	property_delta_key('min-height', 'css-sizing', 'css-sizing-4'),
	property_delta_key('min-width', 'css-sizing', 'css-sizing-4'),
	property_delta_key('height', 'css-sizing', 'css-sizing-4'),
	property_delta_key('width', 'css-sizing', 'css-sizing-4'),

	property_delta_key('column-width', 'css-multicol', 'css-sizing'),

	property_delta_key('text-overflow', 'css-overflow', 'css-overflow-4'),
	property_delta_key('continue', 'css-overflow-4', 'css-overflow-5'),

	property_delta_key('column-span', 'css-multicol', 'css-multicol-2'),

	property_delta_key('object-fit', 'css-images', 'css-images-4'),

	property_delta_key('grid-template-rows', 'css-grid', 'css-grid-3'),
	property_delta_key('grid-template-columns', 'css-grid', 'css-grid-3'),

	property_delta_key('float', 'css-page-floats', 'css-gcpm'),

	property_delta_key('content', 'css-content', 'css-gcpm'),

	property_delta_key('position', 'css-position', 'css-gcpm'),

	property_delta_key('font-size-adjust', 'css-fonts', 'css-fonts-5'),

	property_delta_key('background-clip', 'css-backgrounds', 'css-backgrounds-4'),

	property_delta_key('animation-duration', 'css-animations', 'css-animations-2'),

	property_delta_key('align-items', 'css-align', 'css-anchor-position'),
	property_delta_key('justify-items', 'css-align', 'css-anchor-position'),
	property_delta_key('align-self', 'css-align', 'css-anchor-position'),
	property_delta_key('justify-self', 'css-align', 'css-anchor-position'),

	property_delta_key('margin-top', 'css-box', 'css-anchor-position'),
	property_delta_key('margin-left', 'css-box', 'css-anchor-position'),
	property_delta_key('margin-right', 'css-box', 'css-anchor-position'),
	property_delta_key('margin-bottom', 'css-box', 'css-anchor-position'),

	property_delta_key('top', 'css-position', 'css-anchor-position'),
	property_delta_key('left', 'css-position', 'css-anchor-position'),
	property_delta_key('right', 'css-position', 'css-anchor-position'),
	property_delta_key('bottom', 'css-position', 'css-anchor-position'),

	property_delta_key('width', 'css-sizing', 'css-anchor-position'),
	property_delta_key('height', 'css-sizing', 'css-anchor-position'),
	property_delta_key('min-width', 'css-sizing', 'css-anchor-position'),
	property_delta_key('min-height', 'css-sizing', 'css-anchor-position'),
	property_delta_key('max-width', 'css-sizing', 'css-anchor-position'),
	property_delta_key('max-height', 'css-sizing', 'css-anchor-position'),

	property_delta_key('width', 'css-sizing-4', 'css-anchor-position'),
	property_delta_key('height', 'css-sizing-4', 'css-anchor-position'),
	property_delta_key('min-width', 'css-sizing-4', 'css-anchor-position'),
	property_delta_key('min-height', 'css-sizing-4', 'css-anchor-position'),
	property_delta_key('max-width', 'css-sizing-4', 'css-anchor-position'),
	property_delta_key('max-height', 'css-sizing-4', 'css-anchor-position'),

	property_delta_key('grid-auto-flow', 'css-grid', 'css-grid-3'),

	property_delta_key('display', 'css-display', 'css-grid-3'),

	property_delta_key('display', 'css-grid-3', 'mathml-core'),
]);

const seen_property_definitions = new Map();
function is_conflicting_property(spec_name, name, syntax) {
	if (seen_property_definitions.has(name)) {
		const other_occurrences = seen_property_definitions.get(name);
		other_occurrences.forEach((other_occurrence) => {
			if (syntax === other_occurrence.syntax) {
				return;
			}

			if (property_deltas.has(property_delta_key(name, other_occurrence.spec_name, spec_name))) {
				return;
			}

			console.log(`
Property '${name}' from '${spec_name}' previously occurred in '${other_occurrence.spec_name}'
    ours: ${syntax}
  theirs: ${other_occurrence.syntax}

  // property_delta_key('${name}', '${other_occurrence.spec_name}', '${spec_name}'),
  --
`);
			throw new Error('Ambiguous spec definition');
		});

		other_occurrences.push({
			name: name,
			spec_name: spec_name,
			syntax: syntax,
		});

		seen_property_definitions.set(name, other_occurrences);

		return;
	}

	seen_property_definitions.set(name, [{
		name: name,
		spec_name: spec_name,
		syntax: syntax,
	}]);
}

function assign_new_definition(spec_name, set, name, definition) {
	const exists_in_set = set[name];
	const is_extension = definition.trimStart()[0] === '|';

	definition = maybe_override(spec_name, name, definition);

	if (exists_in_set && is_extension) {
		set[name] = set[name] + definition;
		return;
	}

	set[name] = definition;
}

export async function generate_webref_sets() {
	const properties = Object(null);
	const values = Object(null);

	const parsedFiles = await css.listAll();
	const entries = Array.from(Object.entries(parsedFiles));

	entries.sort((a, b) => {
		const index_a = SPECS.findIndex((x) => x[0] === a[0]);
		const index_b = SPECS.findIndex((x) => x[0] === b[0]);

		return index_a - index_b;
	});

	for (const [spec_name, data] of entries) {
		if (IGNORED_SPECS.has(spec_name)) {
			continue;
		}

		for (const property of data.properties) {
			if (property.value || property.newValues) {
				assign_new_definition(
					spec_name,
					properties,
					trim_lt_gt(property.name),
					property.newValues ? ' | ' + property.newValues : property.value,
				);

				is_conflicting_property(spec_name, trim_lt_gt(property.name), properties[trim_lt_gt(property.name)]);
			}

			if (property.values) {
				for (const value of property.values) {
					if (value.type === 'type' && value.value) {
						if (is_ignored_type(value.name, spec_name)) {
							continue;
						}

						assign_new_definition(
							spec_name,
							values,
							trim_lt_gt(value.name),
							value.value,
						);

						is_conflicting_type(spec_name, trim_lt_gt(value.name), values[trim_lt_gt(value.name)]);
					}
				}
			}
		}

		for (const value of data.values) {
			if (is_ignored_type(value.name, spec_name)) {
				continue;
			}

			if (value.value || value.newValues) {
				assign_new_definition(
					spec_name,
					values,
					trim_lt_gt(value.name),
					value.newValues ? ' | ' + value.newValues : value.value,
				);

				is_conflicting_type(spec_name, trim_lt_gt(value.name), values[trim_lt_gt(value.name)]);
			}

			if (value.values) {
				for (const child_value of value.values) {
					if (is_ignored_type(child_value.name, spec_name)) {
						continue;
					}

					if (child_value.type === 'type' && child_value.value) {
						assign_new_definition(
							spec_name,
							values,
							trim_lt_gt(child_value.name),
							child_value.value,
						);

						is_conflicting_type(spec_name, trim_lt_gt(child_value.name), values[trim_lt_gt(child_value.name)]);
					}
				}
			}

			if (!value.value && value.values?.length > 0) {
				assign_new_definition(
					spec_name,
					values,
					trim_lt_gt(value.name),
					value.values.map(x => x.value).join(' | '),
				);

				is_conflicting_type(spec_name, trim_lt_gt(value.name), values[trim_lt_gt(value.name)]);
			}
		}
	}

	const forkedLexer = fork({
		properties: properties,
		types: values,
	}).lexer;

	const properties_set = generate_set(forkedLexer.properties);
	const types_set = generate_set(forkedLexer.types);

	return {
		properties: properties_set,
		types: types_set,
	};
}
