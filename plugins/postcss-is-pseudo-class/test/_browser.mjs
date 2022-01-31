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
			case '/test/browser.expect.css':
				res.writeHead(200);
				res.end(await fsp.readFile('test/browser.expect.css', 'utf8'));
				break;
			default:
				res.setHeader('Content-type', 'text/plain' );
				res.writeHead(404);
				res.end('Not found');
				break;
		}
	};

	const server = http.createServer(requestListener);
	server.listen(8080);

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

		await server.close();
	} else {
		console.log('visit : http://localhost:8080');
	}
})();
