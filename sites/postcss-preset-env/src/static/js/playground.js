import { EditorState, Transaction, Annotation } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import postcss from 'postcss';
import postcssPresetEnv from 'postcss-preset-env';

// hack to make browserslist work in a browser. (irony...)
self.process = { env: {} };

function processCss(source) {
	return postcss([postcssPresetEnv({
		browsers: ['chrome 30'],
		stage: 0,
	})]).process(
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

let inputState = EditorState.create({
	doc: `:root {
	--mainColor: #12345678;
}

body {
	color: var(--mainColor);
	font-family: system-ui;
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

let syncAnnotation = Annotation.define();

function syncDispatch(tr, view, other) {
	view.update([tr]);
	if (!tr.changes.empty && !tr.annotation(syncAnnotation)) {
		let annotations = [syncAnnotation.of(true)];
		let userEvent = tr.annotation(Transaction.userEvent);
		if (userEvent) {
			annotations.push(Transaction.userEvent.of(userEvent));
		}

		processCss(view.state.doc).then((output) => {
			let update = other.state.update({ changes: { from: 0, to: other.state.doc.length, insert: output } });
			other.update([update]);
		});
	}
}

let inputView = new EditorView({
	state: inputState,
	parent: document.querySelector('#editor1'),
	dispatch: tr => syncDispatch(tr, inputView, outputView),
});

let outputView = new EditorView({
	state: outputState,
	parent: document.querySelector('#editor2'),
});

processCss(inputState.doc).then((output) => {
	let update = outputView.state.update({ changes: { from: 0, to: outputView.state.doc.length, insert: output } });
	outputView.update([update]);
});
