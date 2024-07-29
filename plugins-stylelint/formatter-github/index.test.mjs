import { spawn } from 'node:child_process';
import { platform } from 'node:process';
import assert from 'node:assert';

{
	const child = spawn(
		'npx',
		[
			'stylelint',
			'--stdin',
			'--stdin-filename',
			'/example.css',
			'--custom-formatter',
			'@csstools/stylelint-formatter-github',
		],
		{
			shell: platform === 'win32',
		},
	);

	let stdoutBuffer = '';
	let stderrBuffer = '';

	child.stdout.setEncoding('utf8');
	child.stdout.on('data', (data) => {
		data = data.toString();
		stdoutBuffer += data;
	});

	child.stderr.setEncoding('utf8');
	child.stderr.on('data', (data) => {
		data = data.toString();
		stderrBuffer += data;
	});

	child.stdin.write(`
		a {}
		b {
			color: red;
			color: blue;
		}
	`);
	child.stdin.end();

	child.on('close', () => {
		assert.strictEqual(
			stdoutBuffer,
			'',
		);

		assert.strictEqual(
			stderrBuffer,
			'::warning file=/example.css,line=3,col=3,endLine=6,endColumn=4,title=Stylelint problem::Expected empty line before rule (rule-empty-line-before) [maybe fixable] - https://stylelint.io/user-guide/rules/rule-empty-line-before\n' +
			'::error file=/example.css,line=4,col=4,endLine=4,endColumn=9,title=Stylelint problem::Unexpected duplicate "color" (declaration-block-no-duplicate-properties) [maybe fixable] - https://stylelint.io/user-guide/rules/declaration-block-no-duplicate-properties\n',
		);
	});
}
