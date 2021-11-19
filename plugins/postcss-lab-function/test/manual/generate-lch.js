const fs = require('fs');
const uuid = require('crypto').randomUUID;
const postcss = require('postcss');
const plugin = require('../../dist/index.js');

(async () => {
	fs.writeFileSync('./test/manual/index.html', `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Color swatches</title>

	<link rel="stylesheet" href="raw.css">
	<link rel="stylesheet" href="processed.css">

	<style>
		.swatch {
			display: flex;
			flex-direction: row;
			width: 100px;
			height: 50px;
		}

		.swatch div {
			width: 50px;
			height: 50px;
		}
	</style>
</head>
<body>
	`);

	fs.writeFileSync('./test/manual/processed.css', '');
	fs.writeFileSync('./test/manual/raw.css', '');

	let cssProcessed = [];
	let cssRaw = [];
	let html = [];

	const processor = postcss([plugin]);

	{
		const id = uuid();
		cssProcessed.push(`#processed-${id} { background-color: lch(-1% 20 20); }\n`);
		cssRaw.push(`#raw-${id} { background-color: lch(-1% 20 20); }\n`);
		html.push(`
			<div class="swatch">
				<div id="processed-${id}"></div>
				<div id="raw-${id}"></div>
			</div>
		`);
	}

	{
		const id = uuid();
		cssProcessed.push(`#processed-${id} { background-color: lch(100% 50 45); }\n`);
		cssRaw.push(`#raw-${id} { background-color: lch(100% 50 45); }\n`);
		html.push(`
			<div class="swatch">
				<div id="processed-${id}"></div>
				<div id="raw-${id}"></div>
			</div>
		`);
	}

	{
		const id = uuid();
		cssProcessed.push(`#processed-${id} { background-color: lch(100% 50 45deg); }\n`);
		cssRaw.push(`#raw-${id} { background-color: lch(100% 50 45deg); }\n`);
		html.push(`
			<div class="swatch">
				<div id="processed-${id}"></div>
				<div id="raw-${id}"></div>
			</div>
		`);
	}

	{
		const id = uuid();
		cssProcessed.push(`#processed-${id} { background-color: lch(100% 50 0.125turn); }\n`);
		cssRaw.push(`#raw-${id} { background-color: lch(100% 50 45); }\n`);
		html.push(`
			<div class="swatch">
				<div id="processed-${id}"></div>
				<div id="raw-${id}"></div>
			</div>
		`);
	}

	{
		const id = uuid();
		cssProcessed.push(`#processed-${id} { background-color: lch(100% 50 50grad); }\n`);
		cssRaw.push(`#raw-${id} { background-color: lch(100% 50 45); }\n`);
		html.push(`
			<div class="swatch">
				<div id="processed-${id}"></div>
				<div id="raw-${id}"></div>
			</div>
		`);
	}

	{
		const id = uuid();
		cssProcessed.push(`#processed-${id} { background-color: lch(100% 50 0.785398rad); }\n`);
		cssRaw.push(`#raw-${id} { background-color: lch(100% 50 45); }\n`);
		html.push(`
			<div class="swatch">
				<div id="processed-${id}"></div>
				<div id="raw-${id}"></div>
			</div>
		`);
	}

	for (let c = 0; c < 230; c+=15) {
		for (let h = 0; h < 360; h+=15) {
			for (let l = 0; l < 101; l+=15) {
				const id = uuid();
				cssProcessed.push(`#processed-${id} { background-color: lch(${l}% ${c} ${h}); }\n`);
				cssRaw.push(`#raw-${id} { background-color: lch(${l}% ${c} ${h}); }\n`);
				html.push(`
					<div class="swatch">
						<div id="processed-${id}"></div>
						<div id="raw-${id}"></div>
					</div>
				`);

				if (html.length > 250) {
					console.log(`writing out ${l}% ${c} ${h}`);
					fs.writeFileSync('./test/manual/index.html', html.join(''), { flag: 'a+' });
					html = [];
				}

				if (cssProcessed.length > 250) {
					fs.writeFileSync('./test/manual/processed.css', (await processor.process(cssProcessed.join(''))).css, { flag: 'a+' });
					cssProcessed = [];
				}

				if (cssRaw.length > 250) {
					fs.writeFileSync('./test/manual/raw.css', cssRaw.join(''), { flag: 'a+' });
					cssRaw = [];
				}
			}
		}
	}

	{
		let c = 230;
		for (let h = 0; h < 360; h += 15) {
			for (let l = 0; l < 101; l += 15) {
				const id = uuid();
				cssProcessed.push(`#processed-${id} { background-color: lch(${l}% ${c} ${h}); }\n`);
				cssRaw.push(`#raw-${id} { background-color: lch(${l}% ${c} ${h}); }\n`);
				html.push(`
				<div class="swatch">
					<div id="processed-${id}"></div>
					<div id="raw-${id}"></div>
				</div>
			`);

				if (html.length > 250) {
					console.log(`writing out ${l}% ${c} ${h}`);
					fs.writeFileSync('./test/manual/index.html', html.join(''), { flag: 'a+' });
					html = [];
				}

				if (cssProcessed.length > 250) {
					fs.writeFileSync('./test/manual/processed.css', (await processor.process(cssProcessed.join(''))).css, { flag: 'a+' });
					cssProcessed = [];
				}

				if (cssRaw.length > 250) {
					fs.writeFileSync('./test/manual/raw.css', cssRaw.join(''), { flag: 'a+' });
					cssRaw = [];
				}
			}
		}
	}

	{
		let h = 360;
		for (let c = 0; c < 230; c += 15) {
			for (let l = 0; l < 101; l += 15) {
				const id = uuid();
				cssProcessed.push(`#processed-${id} { background-color: lch(${l}% ${c} ${h}); }\n`);
				cssRaw.push(`#raw-${id} { background-color: lch(${l}% ${c} ${h}); }\n`);
				html.push(`
				<div class="swatch">
					<div id="processed-${id}"></div>
					<div id="processed-${id}"></div>
					<div id="raw-${id}"></div>
				</div>
			`);

				if (html.length > 250) {
					console.log(`writing out ${l}% ${c} ${h}`);
					fs.writeFileSync('./test/manual/index.html', html.join(''), { flag: 'a+' });
					html = [];
				}

				if (cssProcessed.length > 250) {
					fs.writeFileSync('./test/manual/processed.css', (await processor.process(cssProcessed.join(''))).css, { flag: 'a+' });
					cssProcessed = [];
				}

				if (cssRaw.length > 250) {
					fs.writeFileSync('./test/manual/raw.css', cssRaw.join(''), { flag: 'a+' });
					cssRaw = [];
				}
			}
		}
	}

	{
		let l = 100;
		for (let c = 0; c < 230; c += 15) {
			for (let h = 0; h < 360; h += 15) {
				const id = uuid();
				cssProcessed.push(`#processed-${id} { background-color: lch(${l}% ${c} ${h}); }\n`);
				cssRaw.push(`#raw-${id} { background-color: lch(${l}% ${c} ${h}); }\n`);
				html.push(`
				<div class="swatch">
					<div id="processed-${id}"></div>
					<div id="raw-${id}"></div>
				</div>
			`);

				if (html.length > 250) {
					console.log(`writing out ${l}% ${c} ${h}`);
					fs.writeFileSync('./test/manual/index.html', html.join(''), { flag: 'a+' });
					html = [];
				}

				if (cssProcessed.length > 250) {
					fs.writeFileSync('./test/manual/processed.css', (await processor.process(cssProcessed.join(''))).css, { flag: 'a+' });
					cssProcessed = [];
				}

				if (cssRaw.length > 250) {
					fs.writeFileSync('./test/manual/raw.css', cssRaw.join(''), { flag: 'a+' });
					cssRaw = [];
				}
			}
		}
	}

	fs.writeFileSync('./test/manual/processed.css', (await processor.process(cssProcessed.join(''))).css, { flag: 'a+' });
	fs.writeFileSync('./test/manual/raw.css', cssRaw.join(''), { flag: 'a+' });

	fs.writeFileSync('./test/manual/index.html', `
		${html.join('')}
</body>
</html>
	`, { flag: 'a+' });
})();
