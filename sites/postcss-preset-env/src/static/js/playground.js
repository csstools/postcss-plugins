import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import postcss from 'postcss';
import postcssPresetEnv from 'postcss-preset-env';

// hack to make browserslist work in a browser. (irony...)
self.process = { env: {} };

const currentConfig = {
	browsers: ['> 0.2% and not dead'],
	minimumVendorImplementations: 0,
	stage: 2,
	preserve: null,
	logical: {
		inlineDirection: 'left-to-right',
		blockDirection: 'top-to-bottom',
	},
};

function processCss(source, config) {
	let presetEnv;
	try {
		presetEnv = postcssPresetEnv(config);
	} catch (err) {
		console.warn(err);
		return Promise.resolve();
	}

	return postcss([presetEnv]).process(
		source,
		{
			form: 'input',
			to: 'output',
		},
	).then((result) => {
		return result.css;
	}).catch((err) => {
		console.warn(err);
	});
}

function renderConfig(config) {
	const copy = JSON.parse(JSON.stringify(config));
	if (!copy.preserve) {
		delete copy.preserve;
	}

	if (copy.stage === 2) {
		delete copy.stage;
	}

	if (copy.minimumVendorImplementations === 0) {
		delete copy.minimumVendorImplementations;
	}

	if (copy.browsers.length === 0) {
		delete copy.browsers;
	}

	if (copy.logical.inlineDirection === 'left-to-right') {
		delete copy.logical.inlineDirection;
	}

	if (copy.logical.blockDirection === 'top-to-bottom') {
		delete copy.logical.blockDirection;
	}

	if (Object.keys(copy.logical).length === 0) {
		delete copy.logical;
	}

	return `const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
	plugins: [
		postcssPresetEnv(${JSON.stringify(copy, null, '\t').replaceAll('\n', '\n\t\t')})
	]
}
`;
}

let inputState = EditorState.create({
	doc: `:root {
	--mainColor: #12345678;
}

body {
	color: var(--mainColor);
}

a {
	color: rgb(0 0 100% / 90%);

	&:hover {
		color: oklch(40% 0.268735435 34.568626);
	}

	& span {
		font-weight: bold;
	}
}

aside {
	margin-block-start: 1rem;
	margin-block-end: 2rem;
	margin-inline-start: 3rem;
	margin-inline-end: 4rem;
	width: 10vi;
	height: 20vb;
}

@custom-media --tablet (min-width: 48rem);

@media (--tablet) {
	:is(input, button):is(:hover, :focus) {
		color: rebeccapurple;
	}
}
`,
	extensions: [
		basicSetup,
		css(),
		oneDark,
	],
});

let outputState = EditorState.create({
	doc: '',
	extensions: [
		basicSetup,
		css(),
		oneDark,
		EditorView.editable.of(false),
	],
});

let configState = EditorState.create({
	doc: renderConfig(currentConfig),
	extensions: [
		basicSetup,
		javascript(),
		oneDark,
		EditorView.editable.of(false),
	],
});

function syncDispatch(tr, view, other) {
	view.update([tr]);
	if (!tr.changes.empty) {
		processCss(view.state.doc, currentConfig).then((output) => {
			other.update([
				other.state.update({
					changes: {
						from: 0,
						to: other.state.doc.length,
						insert: output ?? view.state.doc,
					},
				}),
			]);
		});
	}
}

let inputView = new EditorView({
	state: inputState,
	parent: document.querySelector('#input-editor'),
	dispatch: tr => syncDispatch(tr, inputView, outputView),
});

let configView = new EditorView({
	state: configState,
	parent: document.querySelector('#config-editor'),
});

let outputView = new EditorView({
	state: outputState,
	parent: document.querySelector('#output-editor'),
});

processCss(inputState.doc, currentConfig).then((output) => {
	outputView.update([
		outputView.state.update({
			changes: {
				from: 0,
				to: outputView.state.doc.length,
				insert: output ?? inputView.state.doc,
			},
		}),
	]);
});

let controls = {
	browsers: document.getElementById('browsers'),
	minimumVendorImplementations: document.getElementById('minimumVendorImplementations'),
	stage: document.getElementById('stage'),
	preserve: document.getElementById('preserve'),
	inlineDirection: document.getElementById('inlineDirection'),
	blockDirection: document.getElementById('blockDirection'),
};

{
	controls.browsers.value = currentConfig.browsers.join(', ');
	controls.minimumVendorImplementations.value = currentConfig.minimumVendorImplementations.toString();
	controls.inlineDirection.value = currentConfig.logical.inlineDirection;
	controls.blockDirection.value = currentConfig.logical.blockDirection;

	controls.stage.value = currentConfig.stage.toString();
	if (currentConfig.preserve === true) {
		controls.preserve.value = 'true';
	} else if (currentConfig.preserve === false) {
		controls.preserve.value = 'false';
	}
}

for (const control of Object.values(controls)) {
	control.addEventListener('change', () => {
		let preserve = null;
		if (controls.preserve.value === 'true') {
			preserve = true;
		} else if (controls.preserve.value === 'false') {
			preserve = false;
		}

		currentConfig.browsers = controls.browsers.value.split(',').filter((x) => !!x);
		currentConfig.minimumVendorImplementations = parseInt(controls.minimumVendorImplementations.value || '0', 10);
		currentConfig.stage = parseInt(controls.stage.value || '0', 10);
		currentConfig.preserve = preserve;
		currentConfig.logical = {
			inlineDirection: controls.inlineDirection.value || 'left-to-right',
			blockDirection: controls.blockDirection.value || 'top-to-bottom',
		};

		processCss(inputState.doc, currentConfig).then((output) => {
			configView.update([
				configView.state.update({ changes: { from: 0, to: configView.state.doc.length, insert: renderConfig(currentConfig) } }),
			]);

			outputView.update([
				outputView.state.update({
					changes: {
						from: 0,
						to: outputView.state.doc.length,
						insert: output ?? inputView.state.doc,
					},
				}),
			]);
		});
	});
}
