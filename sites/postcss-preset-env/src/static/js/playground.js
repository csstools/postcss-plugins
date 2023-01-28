import { EditorState, Transaction, Annotation } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import postcss from 'postcss';
import postcssPresetEnv from 'postcss-preset-env';

// hack to make browserslist work in a browser. (irony...)
self.process = { env: {} };

const startConfig = {
	browsers: ['chrome 70'],
	stage: 0,
};

function processCss(source, config) {
	return postcss([postcssPresetEnv(config)]).process(
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
	return JSON.stringify(config, null, '\t').replaceAll('\n', '\n\t\t');
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
		color: rebeccapurple;
	}

	& span {
		font-weight: bold;
	}
}

:is(input, button):is(:hover, :focus) {
	color: oklch(40% 0.268735435 34.568626);
}`,
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
	doc: `const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
	plugins: [
		postcssPresetEnv(${renderConfig(startConfig)})
	]
}
`,
	extensions: [
		basicSetup,
		javascript(),
		oneDark,
		EditorView.editable.of(false),
	],
});

let syncAnnotation = Annotation.define();

function syncDispatch(tr, view, other) {
	view.update([tr]);
	if (!tr.changes.empty && !tr.annotation(syncAnnotation)) {
		let annotations = [syncAnnotation.of(true)];
		let userEvent = tr.annotation(Transaction.userEvent);
		if (userEvent) {
			annotations.push(Transaction.userEvent.of(userEvent));
		}

		processCss(view.state.doc, startConfig).then((output) => {
			let update = other.state.update({ changes: { from: 0, to: other.state.doc.length, insert: output } });
			other.update([update]);
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

processCss(inputState.doc, startConfig).then((output) => {
	let update = outputView.state.update({ changes: { from: 0, to: outputView.state.doc.length, insert: output } });
	outputView.update([update]);
});
