import puppeteer from 'puppeteer';
import http from 'node:http';
import fs from 'node:fs/promises';
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
			res.end(await fs.readFile('test/_browser.html', 'utf8'));
			break;
		case '/stylesheet-loading':
			res.setHeader('Content-type', 'text/html');
			res.writeHead(200);
			res.end(await fs.readFile('test/_browser-stylesheet-loading.html', 'utf8'));
			break;
		case '/test/basic.expect.css':
			// Stylesheet WITHOUT CORS headers
			res.setHeader('Content-type', 'text/css');
			res.writeHead(200);
			res.end(await fs.readFile('test/basic.expect.css', 'utf8'));
			break;
		case '/test/browser.expect.css':
			// Stylesheet WITH CORS headers
			res.setHeader('Content-type', 'text/css');
			res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
			res.writeHead(200);
			res.end(await fs.readFile('test/browser.expect.css', 'utf8'));
			break;
		case '/test/browser-stylesheet-loading.expect.css':
			await new Promise(resolve => setTimeout(resolve, parseInt(parsedUrl.searchParams.get('delay') ?? '0', 10)));

			// Stylesheet WITH CORS headers
			res.setHeader('Content-type', 'text/css');
			res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
			res.writeHead(200);
			res.end(await fs.readFile('test/browser-stylesheet-loading.expect.css', 'utf8'));
			break;
		case '/dist/browser-global.js':
			res.setHeader('Content-type', 'text/javascript');
			res.writeHead(200);
			res.end(await fs.readFile('dist/browser-global.js', 'utf8'));
			break;

		default:
			res.setHeader('Content-type', 'text/plain');
			res.writeHead(404);
			res.end('Not found');
			break;
	}
};

function startServers() {
	// Use different servers for HTML/CSS/JS to trigger CORS
	//
	// HTML:
	const serverA = http.createServer(requestListener);
	serverA.listen(8080);
	// CSS:
	const serverB = http.createServer(requestListener);
	serverB.listen(8081);
	// JS:
	const serverC = http.createServer(requestListener);
	serverC.listen(8082);

	return () => {
		serverA.close();
		serverB.close();
		serverC.close();
	};
}

if (!process.env.DEBUG) {
	test('browser', { skip: process.env.GITHUB_ACTIONS && !process.env.BROWSER_TESTS }, async () => {
		const cleanup = startServers();

		const browser = await puppeteer.launch({
			headless: 'new',
		});

		try {
			const page = await browser.newPage();
			page.on('pageerror', (msg) => {
				throw msg;
			});

			// Uncomment to verify that the polyfill doesn't break native functionality
			// {
			// 	await page.goto('http://localhost:8080');
			// 	const result = await page.evaluate(async() => {
			// 		// eslint-disable-next-line no-undef
			// 		return await window.runTest();
			// 	});
			// 	if (!result) {
			// 		throw new Error('Test failed, expected "window.runTest()" to return true');
			// 	}
			// }

			{
				await page.goto('http://localhost:8080#force-polyfill');
				const result = await page.evaluate(async () => {
					// eslint-disable-next-line no-undef
					return await window.runTest();
				});
				if (!result) {
					throw new Error('Test failed, expected "window.runTest()" to return true');
				}
			}

			{
				await page.goto('http://localhost:8080/stylesheet-loading#force-polyfill');
				const result = await page.evaluate(async () => {
					// eslint-disable-next-line no-undef
					return await window.runTest();
				});
				if (!result) {
					throw new Error('Test failed, expected "window.runTest()" to return true');
				}
			}
		} finally {
			await browser.close();

			await cleanup();
		}
	});
} else {
	startServers();

	// eslint-disable-next-line no-console
	console.log('visit : http://localhost:8080');
}
