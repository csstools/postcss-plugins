import puppeteer from 'puppeteer';
import http from 'http';
import { promises as fsp } from 'fs';

(async () => {
	const requestListener = async function (req, res) {

		const parsedUrl = new URL(req.url, 'http://localhost:8080');
		const pathname = parsedUrl.pathname;

		switch (pathname) {
			case '':
			case '/':
				res.setHeader('Content-type', 'text/html');
				res.writeHead(200);
				res.end(await fsp.readFile('test/_browser.html', 'utf8'));
				break;
			case '/test/basic.expect.css':
				// Stylesheet WITHOUT CORS headers
				res.setHeader('Content-type', 'text/css');
				res.writeHead(200);
				res.end(await fsp.readFile('test/basic.expect.css', 'utf8'));
				break;
			case '/test/browser.expect.css':
				// Stylesheet WITH CORS headers
				res.setHeader('Content-type', 'text/css');
				res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
				res.writeHead(200);
				res.end(await fsp.readFile('test/browser.expect.css', 'utf8'));
				break;
			case '/dist/browser-global.js':
				res.setHeader('Content-type', 'text/javascript');
				res.writeHead(200);
				res.end(await fsp.readFile('dist/browser-global.js', 'utf8'));
				break;

			default:
				res.setHeader('Content-type', 'text/plain' );
				res.writeHead(404);
				res.end('Not found');
				break;
		}
	};

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

	if (!process.env.DEBUG) {
		const browser = await puppeteer.launch({
			headless: true,
		});

		const page = await browser.newPage();
		page.on('pageerror', (msg) => {
			throw msg;
		});
		await page.goto('http://localhost:8080');
		const result = await page.evaluate(async() => {
			// eslint-disable-next-line no-undef
			return await window.runTest();
		});
		if (!result) {
			throw new Error('Test failed, expected "window.runTest()" to return true');
		}

		await browser.close();

		await serverA.close();
		await serverB.close();
		await serverC.close();
	} else {
		console.log('visit : http://localhost:8080');
	}
})();
