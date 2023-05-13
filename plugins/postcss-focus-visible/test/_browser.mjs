/* global window */
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
				res.setHeader('Content-type', 'text/css');
				res.writeHead(200);
				res.end(await fsp.readFile('test/browser.expect.css', 'utf8'));
				break;
			default:
				res.setHeader('Content-type', 'text/plain');
				res.writeHead(404);
				res.end('Not found');
				break;
		}
	};

	// Use different servers for HTML/CSS/JS to trigger CORS
	const server = http.createServer(requestListener);
	server.listen(8080);

	if (!process.env.DEBUG) {
		const browser = await puppeteer.launch({
			headless: 'new',
		});

		const page = await browser.newPage();
		page.on('pageerror', (msg) => {
			throw msg;
		});

		// Default
		{
			await page.goto('http://localhost:8080');

			// None of the elements should have styles
			await page.evaluate(async () => window.checkElement('default', 'a', false));
			await page.evaluate(async () => window.checkElement('default', 'b', false));
			await page.evaluate(async () => window.checkElement('default', 'c', false));

			await page.keyboard.press('Tab');
			await page.evaluate(async () => window.checkElement('default', 'a', true));
			await page.evaluate(async () => window.checkElement('default', 'b', false));
			await page.evaluate(async () => window.checkElement('default', 'c', false));

			await page.keyboard.press('Tab');
			await page.evaluate(async () => window.checkElement('default', 'a', false));
			await page.evaluate(async () => window.checkElement('default', 'b', true));
			await page.evaluate(async () => window.checkElement('default', 'c', false));

			await page.keyboard.press('Tab');
			await page.evaluate(async () => window.checkElement('default', 'a', false));
			await page.evaluate(async () => window.checkElement('default', 'b', false));
			await page.evaluate(async () => window.checkElement('default', 'c', true));
		}

		// Clicking
		{
			await page.goto('http://localhost:8080');

			// None of the elements should have styles
			await page.evaluate(async () => window.checkElement('click', 'a', false));
			await page.evaluate(async () => window.checkElement('click', 'b', false));
			await page.evaluate(async () => window.checkElement('click', 'c', false));

			await page.click('#a');
			await page.evaluate(async () => window.checkElement('click', 'a', true));

			await page.click('#b');
			await page.evaluate(async () => window.checkElement('click', 'b', true));

			// Clicking on a non-input element should not trigger focus-visible if not with keyboard
			await page.click('#c');
			await page.evaluate(async () => window.checkElement('click', 'c', false));
		}

		await browser.close();

		await server.close();
	} else {
		console.log('visit : http://localhost:8080');
	}
})();
