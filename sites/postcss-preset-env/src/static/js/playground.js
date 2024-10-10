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

const stateAtLoad = (() => {
	try {
		const hash = window.location.hash.slice(1);
		if (!hash) {
			return {};
		}

		const maybeState = JSON.parse(window.decodeURIComponent(window.atob(hash)));
		if (!maybeState.config) {
			return {};
		}

		if (!maybeState.source || (typeof maybeState.source !== 'string')) {
			return {};
		}

		return maybeState;
	} catch (err) {
		// eslint-disable-next-line no-console
		console.warn(err);
		return {};
	}
})();

const currentConfig = stateAtLoad.config ?? {
	browsers: ['> 0.2% and not dead'],
	minimumVendorImplementations: 0,
	stage: 2,
	logical: {
		inlineDirection: 'left-to-right',
		blockDirection: 'top-to-bottom',
	},
};

function processCss(source, config, isDefaultState = false) {
	if (!isDefaultState) {
		try {
			window.location.hash = window.btoa(window.encodeURIComponent(JSON.stringify({
				source: source,
				config: config,
			})));
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error(err);
		}
	}

	let presetEnv;
	try {
		presetEnv = postcssPresetEnv(config);
	} catch (err) {
		if (err.browserslist) {
			alert(`${err.message}\n\nTry changing the browserslist config.`);
		}

		// eslint-disable-next-line no-console
		console.warn(err);
		return Promise.resolve();
	}

	return postcss([presetEnv]).process(
		source,
		{
			from: 'input',
			to: 'output',
		},
	).then((result) => {
		return result.css;
	}).catch((err) => {
		// eslint-disable-next-line no-console
		console.warn(err);
	});
}

function renderConfig(config) {
	const copy = JSON.parse(JSON.stringify(config));
	if (typeof copy.preserve !== 'boolean') {
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

	let presetVersionPlayground = document.getElementById('config-editor')?.getAttribute('data-preset-env-version') ?? '';
	if (presetVersionPlayground) {
		presetVersionPlayground = ` // v${presetVersionPlayground}`;
	}

	return `const postcssPresetEnv = require('postcss-preset-env');${presetVersionPlayground}

module.exports = {
	plugins: [
		postcssPresetEnv(${JSON.stringify(copy, null, '\t').replaceAll('\n', '\n\t\t')})
	]
}
`;
}

let inputState = EditorState.create({
	doc: stateAtLoad.source ?? `:root {
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

	> span {
		color: color-mix(in oklch, cyan, green 25%);
	}

	@media (prefers-color-scheme: dark) {
		color: oklab(from oklab(54.3% -22.5% -5%) calc(1.0 - l) calc(a * 0.8) b);
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

@custom-media --tablet (48rem <= width < 64rem);

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
		processCss(view.state.doc.toString(), currentConfig).then((output) => {
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
	parent: document.getElementById('input-editor'),
	dispatch: tr => syncDispatch(tr, inputView, outputView),
});

let configView = new EditorView({
	state: configState,
	parent: document.getElementById('config-editor'),
});

let outputView = new EditorView({
	state: outputState,
	parent: document.getElementById('output-editor'),
});

processCss(inputState.doc.toString(), currentConfig, true).then((output) => {
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
	} else {
		controls.preserve.value = '';
	}
}

for (const control of Object.values(controls)) {
	control.addEventListener('change', () => {
		let preserve = undefined;
		if (controls.preserve.value === 'true') {
			preserve = true;
		} else if (controls.preserve.value === 'false') {
			preserve = false;
		}

		currentConfig.browsers = controls.browsers.value.split(',').filter((x) => !!x);
		currentConfig.minimumVendorImplementations = parseInt(controls.minimumVendorImplementations.value || '0', 10);
		currentConfig.stage = parseInt(controls.stage.value || '0', 10);

		if (typeof preserve !== 'undefined') {
			currentConfig.preserve = preserve;
		} else {
			delete currentConfig.preserve;
		}

		currentConfig.logical = {
			inlineDirection: controls.inlineDirection.value || 'left-to-right',
			blockDirection: controls.blockDirection.value || 'top-to-bottom',
		};

		processCss(inputView.state.doc.toString(), currentConfig).then((output) => {
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
