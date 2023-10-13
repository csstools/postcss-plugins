import css from '@webref/css';
import fs from 'fs/promises';
import postcss from 'postcss';
import presetEnv from 'postcss-preset-env';
import module from 'module';
import assert from 'assert';

const require = module.createRequire(import.meta.url);
const bcd = require('@mdn/browser-compat-data');

const logicalProperties = new Set();
const logicalPropertiesByGroup = new Map();

const parsedFiles = await css.listAll();
for (const [, data] of Object.entries(parsedFiles)) {
	for (const property of data.properties) {
		if (property.logicalPropertyGroup) {
			logicalProperties.add(property);

			if (!logicalPropertiesByGroup.has(property.logicalPropertyGroup)) {
				logicalPropertiesByGroup.set(property.logicalPropertyGroup, new Set());
			}

			logicalPropertiesByGroup.get(property.logicalPropertyGroup).add(property.name);
		}
	}
}

const properties = Array.from(logicalProperties);
properties.sort((a, b) => {
	if (a.logicalPropertyGroup === b.logicalPropertyGroup) {
		return a.name.localeCompare(b.name);
	}

	return a.logicalPropertyGroup.localeCompare(b.logicalPropertyGroup);
});

{
	let buffer = '/* This test aims to make it easy to find new logical properties that don\'t have a transform. */\n\n';

	for (const property of properties) {
		const sample = `.${property.logicalPropertyGroup.toLowerCase()} {
	/* ${property.name} */
	${property.name}: inherit;
}

`;

		buffer += sample;
	}

	await fs.writeFile('test/logical-properties.css', buffer);
}

{
	const knownPhysicalProperties = new Set([
		'background-position-x',
		'background-position-y',
		'border-bottom-color',
		'border-left-color',
		'border-right-color',
		'border-top-color',
		'border-bottom-left-radius',
		'border-bottom-right-radius',
		'border-top-left-radius',
		'border-top-right-radius',
		'border-bottom-style',
		'border-left-style',
		'border-right-style',
		'border-top-style',
		'border-bottom-width',
		'border-left-width',
		'border-right-width',
		'border-top-width',
		'contain-intrinsic-height',
		'contain-intrinsic-width',
		'bottom',
		'left',
		'right',
		'top',
		'margin-bottom',
		'margin-left',
		'margin-right',
		'margin-top',
		'max-height',
		'max-width',
		'min-height',
		'min-width',
		'overflow-x',
		'overflow-y',
		'overflow-clip-margin-bottom',
		'overflow-clip-margin-left',
		'overflow-clip-margin-right',
		'overflow-clip-margin-top',
		'overscroll-behavior-x',
		'overscroll-behavior-y',
		'padding-bottom',
		'padding-left',
		'padding-right',
		'padding-top',
		'scroll-margin-bottom',
		'scroll-margin-left',
		'scroll-margin-right',
		'scroll-margin-top',
		'scroll-padding-bottom',
		'scroll-padding-left',
		'scroll-padding-right',
		'scroll-padding-top',
		'scroll-start-x',
		'scroll-start-y',
		'scroll-start-target-x',
		'scroll-start-target-y',
		'height',
		'width',
	]);

	const propsWithDifferentReleaseDates = new Set([]);

	for (const [, properties] of logicalPropertiesByGroup) {
		let physicalProperty = '';
		let physicalSupport = {};

		for (const propertyName of properties.values()) {
			if (!knownPhysicalProperties.has(propertyName)) {
				continue;
			}

			let support = bcd.css.properties[propertyName]?.__compat?.support;
			if (!support) {
				continue;
			}

			physicalProperty = propertyName;
			physicalSupport = scrubSupport(support);
		}

		if (!physicalProperty || !physicalSupport) {
			continue;
		}

		for (const propertyName of properties.values()) {
			if (propsWithDifferentReleaseDates.has(propertyName)) {
				continue;
			}

			let support = bcd.css.properties[propertyName]?.__compat?.support;
			if (!support) {
				break;
			}

			support = scrubSupport(support);

			try {
				assert.deepStrictEqual(support, physicalSupport, propertyName + ' vs. ' + physicalProperty);
			} catch (error) {
				propsWithDifferentReleaseDates.add(propertyName);
			}
		}
	}

	let unaltered = new Set();

	for (const property of properties) {
		if (knownPhysicalProperties.has(property.name)) {
			continue;
		}

		const sample = `.${property.logicalPropertyGroup.toLowerCase()} {
	/* ${property.name} */
	${property.name}: inherit;
}

`;
		const output = (await postcss([
			presetEnv({
				stage: 0,
				browsers: '> 0%',
				inlineDirection: 'right-to-left',
				blockDirection: 'bottom-to-top',
			}),
		]).process(sample, { from: undefined })).css;

		if (output === sample) {
			if (propsWithDifferentReleaseDates.has(property.name)) {
				console.log('- "' + property.name + '"  has different release dates and was unhandled');
			}

			unaltered.add(property);
			continue;
		}
	}
}

function scrubSupport(support) {
	support = {
		chrome: support.chrome,
		edge: support.edge,
		firefox: support.firefox,
		ie: support.ie,
		safari: support.safari,
	};

	scrubNotes(support);

	return support;
}

function scrubNotes(objectOrArray) {
	if (Array.isArray(objectOrArray)) {
		objectOrArray.forEach(scrubNotes);
		return;
	}

	delete objectOrArray['notes'];

	for (const key in objectOrArray) {
		if (typeof objectOrArray[key] === 'object') {
			scrubNotes(objectOrArray[key]);
		}
	}
}
