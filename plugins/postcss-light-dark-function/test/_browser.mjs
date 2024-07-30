import puppeteer from 'puppeteer';
import http from 'http';
import { promises as fsp } from 'fs';
import plugin from '@csstools/postcss-light-dark-function';
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
								<li><a href="/wpt/light-dark-basic.html">light-dark-basic.html</a></li>
								<li><a href="/wpt/light-dark-currentcolor-in-color.html">light-dark-currentcolor-in-color.html</a></li>
								<li><a href="/wpt/light-dark-inherited.html">light-dark-inherited.html</a></li>
							</ul>
						</body>
					</html>
				`);
			break;
		case '/wpt/light-dark-basic.html':
		case '/wpt/light-dark-currentcolor-in-color.html':
		case '/wpt/light-dark-inherited.html':
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

				if (parsedUrl.searchParams.has('native')) {
					res.setHeader('Content-type', 'text/css');
					res.writeHead(200);
					res.end(data);
					break;
				}

				const css = await postcss([plugin({preserve: false})]).process(data, { from: 'test/styles.css', to: 'test/styles.css' });
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
	const errors = [];

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
			'wpt/light-dark-basic.html',
			'wpt/light-dark-currentcolor-in-color.html',
			'wpt/light-dark-inherited.html',
		]) {
			await page.goto('http://localhost:8080/' + url);

			try {
				await page.evaluate(async () => {
					// eslint-disable-next-line no-undef
					return await window.runTest();
				});
			} catch (err) {
				errors.push(err);
			}
		}

		await page.emulateMediaFeatures([
			{ name: 'prefers-color-scheme', value: 'dark' },
		]);

		for (const url of [
			'wpt/light-dark-basic.html',
			'wpt/light-dark-currentcolor-in-color.html',
			'wpt/light-dark-inherited.html',
		]) {
			await page.goto('http://localhost:8080/' + url);

			try {
				await page.evaluate(async () => {
					// eslint-disable-next-line no-undef
					return await window.runTest();
				});
			} catch (err) {
				errors.push(err);
			}
		}

		await browser.close();
		await cleanup();

		if (errors.length > 0) {
			errors.forEach((err) => {
				console.error(err);
			});

			process.exit(1);
		}
	});
} else {
	startServers();

	console.log('visit : http://localhost:8080');
}
