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
			case '/dist/browser-global.js':
				res.setHeader('Content-type', 'text/javascript');
				res.writeHead(200);
				res.end(await fsp.readFile('dist/browser-global.js', 'utf8'));
				break;
			case '/replace-with':
				res.setHeader('Content-type', 'text/html');
				res.writeHead(200);
				res.end(await fsp.readFile('test/_browser_replace.html', 'utf8'));
				break;
			case '/test/browser.replacewith.expect.css':
				res.setHeader('Content-type', 'text/css');
				res.writeHead(200);
				res.end(await fsp.readFile('test/browser.replacewith.expect.css', 'utf8'));
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

			await page.evaluate(async () => window._focusWithinInit({ force: true }));

			// None of the elements should have styles
			await page.evaluate(async () => window.checkElement('default', 'a-grand-parent', false));
			await page.evaluate(async () => window.checkElement('default', 'a-grand-parent-input', false));
			await page.evaluate(async () => window.checkElement('default', 'a-parent', false));
			await page.evaluate(async () => window.checkElement('default', 'a-parent-input', false));
			await page.evaluate(async () => window.checkElement('default', 'a-child', false));
			await page.evaluate(async () => window.checkElement('default', 'a-child-input', false));

			await page.click('#a-grand-parent-input');
			await page.evaluate(async () => window.checkElement('default', 'a-grand-parent', true));
			await page.evaluate(async () => window.checkElement('default', 'a-grand-parent-input', true));
			await page.evaluate(async () => window.checkElement('default', 'a-parent', false));
			await page.evaluate(async () => window.checkElement('default', 'a-parent-input', false));
			await page.evaluate(async () => window.checkElement('default', 'a-child', false));
			await page.evaluate(async () => window.checkElement('default', 'a-child-input', false));

			await page.click('#a-parent-input');
			await page.evaluate(async () => window.checkElement('default', 'a-grand-parent', true));
			await page.evaluate(async () => window.checkElement('default', 'a-grand-parent-input', false));
			await page.evaluate(async () => window.checkElement('default', 'a-parent', true));
			await page.evaluate(async () => window.checkElement('default', 'a-parent-input', true));
			await page.evaluate(async () => window.checkElement('default', 'a-child', false));
			await page.evaluate(async () => window.checkElement('default', 'a-child-input', false));

			await page.click('#a-child-input');
			await page.evaluate(async () => window.checkElement('default', 'a-grand-parent', true));
			await page.evaluate(async () => window.checkElement('default', 'a-grand-parent-input', false));
			await page.evaluate(async () => window.checkElement('default', 'a-parent', true));
			await page.evaluate(async () => window.checkElement('default', 'a-parent-input', false));
			await page.evaluate(async () => window.checkElement('default', 'a-child', true));
			await page.evaluate(async () => window.checkElement('default', 'a-child-input', true));

			await page.keyboard.press('Tab');
			await page.evaluate(async () => window.checkElement('default', 'a-grand-parent', false));
			await page.evaluate(async () => window.checkElement('default', 'a-grand-parent-input', false));
			await page.evaluate(async () => window.checkElement('default', 'a-parent', false));
			await page.evaluate(async () => window.checkElement('default', 'a-parent-input', false));
			await page.evaluate(async () => window.checkElement('default', 'a-child', false));
			await page.evaluate(async () => window.checkElement('default', 'a-child-input', false));
		}

		// Replace with
		{
			await page.goto('http://localhost:8080/replace-with');

			await page.evaluate(async () => window._focusWithinInit({ force: true, replaceWith: '.focus-within' }));

			// None of the elements should have styles
			await page.evaluate(async () => window.checkElement('default', 'a-grand-parent', false));
			await page.evaluate(async () => window.checkElement('default', 'a-grand-parent-input', false));
			await page.evaluate(async () => window.checkElement('default', 'a-parent', false));
			await page.evaluate(async () => window.checkElement('default', 'a-parent-input', false));
			await page.evaluate(async () => window.checkElement('default', 'a-child', false));
			await page.evaluate(async () => window.checkElement('default', 'a-child-input', false));

			await page.click('#a-grand-parent-input');
			await page.evaluate(async () => window.checkElement('default', 'a-grand-parent', true));
			await page.evaluate(async () => window.checkElement('default', 'a-grand-parent-input', true));
			await page.evaluate(async () => window.checkElement('default', 'a-parent', false));
			await page.evaluate(async () => window.checkElement('default', 'a-parent-input', false));
			await page.evaluate(async () => window.checkElement('default', 'a-child', false));
			await page.evaluate(async () => window.checkElement('default', 'a-child-input', false));

			await page.click('#a-parent-input');
			await page.evaluate(async () => window.checkElement('default', 'a-grand-parent', true));
			await page.evaluate(async () => window.checkElement('default', 'a-grand-parent-input', false));
			await page.evaluate(async () => window.checkElement('default', 'a-parent', true));
			await page.evaluate(async () => window.checkElement('default', 'a-parent-input', true));
			await page.evaluate(async () => window.checkElement('default', 'a-child', false));
			await page.evaluate(async () => window.checkElement('default', 'a-child-input', false));

			await page.click('#a-child-input');
			await page.evaluate(async () => window.checkElement('default', 'a-grand-parent', true));
			await page.evaluate(async () => window.checkElement('default', 'a-grand-parent-input', false));
			await page.evaluate(async () => window.checkElement('default', 'a-parent', true));
			await page.evaluate(async () => window.checkElement('default', 'a-parent-input', false));
			await page.evaluate(async () => window.checkElement('default', 'a-child', true));
			await page.evaluate(async () => window.checkElement('default', 'a-child-input', true));

			await page.keyboard.press('Tab');
			await page.evaluate(async () => window.checkElement('default', 'a-grand-parent', false));
			await page.evaluate(async () => window.checkElement('default', 'a-grand-parent-input', false));
			await page.evaluate(async () => window.checkElement('default', 'a-parent', false));
			await page.evaluate(async () => window.checkElement('default', 'a-parent-input', false));
			await page.evaluate(async () => window.checkElement('default', 'a-child', false));
			await page.evaluate(async () => window.checkElement('default', 'a-child-input', false));
		}

		await browser.close();
		await server.close();
	} else {
		console.log('visit : http://localhost:8080');
	}
})();
