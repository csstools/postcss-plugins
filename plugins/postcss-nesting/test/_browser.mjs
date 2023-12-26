import puppeteer from 'puppeteer';
import http from 'http';
import { promises as fsp } from 'fs';
import plugin from 'postcss-nesting';
import postcss from 'postcss';
import test from 'node:test';
import process from 'node:process';

const requestListener = async function (req, res) {

	const parsedUrl = new URL(req.url, 'http://localhost:8080');
	const pathname = parsedUrl.pathname;

	switch (pathname) {
		case '':
		case '/':
			res.setHeader('Content-type', 'text/html');
			res.writeHead(200);

			// write html string with list of links to cases.
			res.end(`<!DOCTYPE html>
					<html>
						<head>
							<title>Cascade Layers Test</title>
						</head>
						<body>
							<h1>Cascade Layers Test</h1>
							<ul>
								<li><a href="/wpt/conditional.html">conditional.html</a></li>
								<li><a href="/wpt/implicit-nesting.html">implicit-nesting.html</a></li>
								<li><a href="/wpt/nest-containing.html">nest-containing.html</a></li>
								<li><a href="/wpt/nesting-basics.html">nesting-basics.html</a></li>
							</ul>
						</body>
					</html>
				`);
			break;
		case '/wpt/conditional.html':
		case '/wpt/implicit-nesting.html':
		case '/wpt/nest-containing.html':
		case '/wpt/nesting-basics.html':
			res.setHeader('Content-type', 'text/html');
			res.writeHead(200);
			res.end(await fsp.readFile('test' + pathname, 'utf8'));
			break;
		case '/test/styles.css':
			if (req.method === 'POST') {
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

				const css = await postcss([plugin]).process(data, { from: 'test/styles.css', to: 'test/styles.css' });
				res.setHeader('Content-type', 'text/css');
				res.writeHead(200);
				res.end(css.css);
				break;
			}

		// eslint-disable-next-line no-fallthrough
		default:
			res.setHeader('Content-type', 'text/plain');
			res.writeHead(404);
			res.end('Not found');
			break;
	}
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

		const browser = await puppeteer.launch({
			headless: 'new',
		});

		const page = await browser.newPage();
		page.on('pageerror', (msg) => {
			throw msg;
		});

		for (const url of [
			'wpt/conditional.html',
			'wpt/implicit-nesting.html',
			'wpt/nest-containing.html',
			'wpt/nesting-basics.html',
		]) {
			await page.goto('http://localhost:8080/' + url);
			const result = await page.evaluate(async () => {
				// eslint-disable-next-line no-undef
				return await window.runTest();
			});
			if (!result) {
				throw new Error('Test failed, expected "window.runTest()" to return true');
			}
		}

		await browser.close();

		await cleanup();
	});
} else {
	startServers();

	console.log('visit : http://localhost:8080');
}
