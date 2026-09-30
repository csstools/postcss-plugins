import puppeteer from 'puppeteer';
import http from 'node:http';
import fs from 'node:fs/promises';
import plugin from '@csstools/postcss-mixins';
import postcss from 'postcss';
import test from 'node:test';
import process from 'node:process';

// Chrome Canary implements `@mixin` / `@apply` behind the experimental
// web platform features flag.
//
// - The transformed cases run the source through this plugin.
// - The untransformed cases are handed to the browser as-is and only pass
//   when the browser itself implements the feature.
//
// Point Puppeteer at such a browser via `PUPPETEER_EXECUTABLE_PATH`.

const PAGES = [
	'wpt/mixin-basic.html',
	'wpt/mixin-arguments.html',
	'wpt/mixin-contents.html',
	'wpt/mixin-nested.html',
	'wpt/mixin-private.html',
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
						<title>Mixins Test</title>
					</head>
					<body>
						<h1>Mixins Test</h1>
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

			for (const url of PAGES) {
				await page.goto('http://localhost:8080/' + url);
				const result = await page.evaluate(async () => {
					// eslint-disable-next-line no-undef
					return await window.runTest();
				});
				if (!result) {
					throw new Error('Test failed, expected "window.runTest()" to return true');
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
