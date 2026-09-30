import puppeteer from 'puppeteer';
import http from 'node:http';
import fs from 'node:fs/promises';
import plugin from '@csstools/postcss-custom-functions';
import postcss from 'postcss';
import test from 'node:test';
import process from 'node:process';

// The transformed cases run the source through this plugin.
//
// When the browser implements custom functions natively, the same cases are
// also run untransformed and must produce the same outcome. Point Puppeteer at
// such a browser via `PUPPETEER_EXECUTABLE_PATH`.

const PAGES = [
	'wpt/dashed-function-eval.html',
	'wpt/function-conditionals.html',
	'wpt/dashed-function-standard-property.html',
	'wpt/local-var-substitution.html',
	'wpt/dashed-function-cycles.html',
	'wpt/function-parameter-types.html',
	'wpt/function-layer.html',
	'wpt/function-conditional-definitions.html',
	'wpt/function-in-media.html',
];

const requestListener = async function (req, res) {

	const parsedUrl = new URL(req.url, 'http://localhost:8080');
	const pathname = parsedUrl.pathname;

	if (PAGES.includes(pathname.replace(/^\//, ''))) {
		res.setHeader('Content-type', 'text/html');
		res.writeHead(200);
		res.end(await fs.readFile('test' + pathname, 'utf8'));
		return;
	}

	if (pathname === '' || pathname === '/') {
		res.setHeader('Content-type', 'text/html');
		res.writeHead(200);

		res.end(`<!DOCTYPE html>
				<html>
					<head>
						<title>Custom Functions Test</title>
					</head>
					<body>
						<h1>Custom Functions Test</h1>
						<ul>
							${PAGES.map((page) => `<li><a href="/${page}">${page}</a></li>`).join('\n')}
						</ul>
					</body>
				</html>
			`);
		return;
	}

	if (pathname === '/test/styles.css' && req.method === 'POST') {
		const data = await new Promise((resolve, reject) => {
			let buf = [];
			req.on('data', (chunk) => {
				buf.push(chunk);
			});

			req.on('end', () => {
				resolve(Buffer.concat(buf).toString());
			});

			req.on('error', (err) => {
				reject(err);
			});
		});

		const css = parsedUrl.searchParams.get('transform') === 'false'
			? data
			: (await postcss([plugin()]).process(data, { from: 'test/styles.css', to: 'test/styles.css' })).css;

		res.setHeader('Content-type', 'text/css');
		res.writeHead(200);
		res.end(css);
		return;
	}

	res.setHeader('Content-type', 'text/plain');
	res.writeHead(404);
	res.end('Not found');
};

function startServers() {
	const server = http.createServer(requestListener);
	server.listen(8080);

	return () => {
		server.close();
	};
}

async function hasNativeSupport(page) {
	return await page.evaluate(async () => {
		/* eslint-disable no-undef */
		const css = '@function --support-probe() { result: 12px; } #support-probe { --actual: --support-probe(); }';
		const response = await fetch('/test/styles.css?transform=false', { method: 'POST', body: css });
		const styleElement = document.createElement('style');
		styleElement.textContent = await response.text();
		document.head.append(styleElement);

		const probe = document.createElement('div');
		probe.id = 'support-probe';
		document.body.append(probe);

		const value = window.getComputedStyle(probe).getPropertyValue('--actual');

		probe.remove();
		styleElement.remove();

		return value;
		/* eslint-enable no-undef */
	}) === '12px';
}

if (!process.env.DEBUG) {
	test('browser', { skip: process.env.GITHUB_ACTIONS && !process.env.BROWSER_TESTS }, async () => {
		const cleanup = startServers();

		let browser;

		try {
			browser = await puppeteer.launch({
				headless: 'new',
				executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
				args: ['--enable-experimental-web-platform-features'],
			});

			const page = await browser.newPage();
			page.on('pageerror', (msg) => {
				throw msg;
			});

			await page.goto('http://localhost:8080/');

			const nativeSupport = await hasNativeSupport(page);
			const transforms = nativeSupport ? [true, false] : [true];

			for (const url of PAGES) {
				for (const transform of transforms) {
					await page.evaluateOnNewDocument((value) => {
						// eslint-disable-next-line no-undef
						window.__TRANSFORM__ = value;
					}, transform);

					await page.goto('http://localhost:8080/' + url);

					const result = await page.evaluate(async () => {
						// eslint-disable-next-line no-undef
						return await window.runTest();
					});

					if (!result) {
						throw new Error(`Test failed, expected "window.runTest()" to return true (${url}, transform=${transform})`);
					}
				}
			}
		} finally {
			await browser?.close();

			await cleanup();
		}
	});
} else {
	startServers();

	// eslint-disable-next-line no-console
	console.log('visit : http://localhost:8080');
}
