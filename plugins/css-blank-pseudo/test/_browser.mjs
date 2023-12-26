/* global window,requestAnimationFrame */
import puppeteer from 'puppeteer';
import http from 'http';
import { promises as fsp } from 'fs';
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
			res.end(await fsp.readFile('test/_browser.html', 'utf8'));
			break;
		case '/replace-with':
			res.setHeader('Content-type', 'text/html');
			res.writeHead(200);
			res.end(await fsp.readFile('test/_browser_replace.html', 'utf8'));
			break;
		case '/test/browser.expect.css':
			res.setHeader('Content-type', 'text/css');
			res.writeHead(200);
			res.end(await fsp.readFile('test/browser.expect.css', 'utf8'));
			break;
		case '/test/browser.replacewith.expect.css':
			res.setHeader('Content-type', 'text/css');
			res.writeHead(200);
			res.end(await fsp.readFile('test/browser.replacewith.expect.css', 'utf8'));
			break;
		case '/dist/browser-global.js':
			res.setHeader('Content-type', 'text/javascript');
			res.writeHead(200);
			res.end(await fsp.readFile('dist/browser-global.js', 'utf8'));
			break;
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

		const clearInput = async (page, selector) => {
			const input = await page.$(selector);
			await input.click({ clickCount: 3 });
			await page.keyboard.press('Backspace');
		};

		// Default
		{
			await page.goto('http://localhost:8080');
			const result = await page.evaluate(async () => {
				// eslint-disable-next-line no-undef
				return await window.runTest();
			});

			if (!result) {
				throw new Error('Test failed, expected "window.runTest()" to return true');
			}
		}

		// Changing values
		{
			await page.goto('http://localhost:8080');

			await page.evaluate(async () => window.runTest());

			await page.type('#tel-input', '1234');
			await page.type('#text-input', '1234');
			await page.type('#number-input', '1234');
			await page.type('#password-input', '1234');
			await page.type('#textarea', '1234');
			await page.select('#select', 'non-empty');

			const fillingResults = await Promise.all([
				page.evaluate(async () => window.checkElement('user typing', 'tel', false)),
				page.evaluate(async () => window.checkElement('user typing', 'text', false)),
				page.evaluate(async () => window.checkElement('user typing', 'number', false)),
				page.evaluate(async () => window.checkElement('user typing', 'password', false)),
				page.evaluate(async () => window.checkElement('user typing', 'textarea', false)),
				page.evaluate(async () => window.checkElement('user typing', 'select', false)),
			]);

			// Reverting now, should revert
			await clearInput(page, '#tel-input');
			await clearInput(page, '#text-input');
			await clearInput(page, '#number-input');
			await clearInput(page, '#password-input');
			await clearInput(page, '#textarea');
			await page.select('#select', '');

			const unfillingResults = await Promise.all([
				page.evaluate(async () => window.checkElement('user typing', 'tel', true)),
				page.evaluate(async () => window.checkElement('user typing', 'text', true)),
				page.evaluate(async () => window.checkElement('user typing', 'number', true)),
				page.evaluate(async () => window.checkElement('user typing', 'password', true)),
				page.evaluate(async () => window.checkElement('user typing', 'textarea', true)),
				page.evaluate(async () => window.checkElement('user typing', 'select', true)),
			]);

			const result = [
				...fillingResults,
				...unfillingResults,
			].every(test => !!test);

			if (!result) {
				throw new Error('Test failed');
			}
		}

		// Changing values via JS
		{
			await page.goto('http://localhost:8080');

			await page.evaluate(async () => window.runTest());

			await page.evaluate(async () => window.document.getElementById('tel-input').value = '1234');
			await page.evaluate(async () => window.document.getElementById('text-input').value = '1234');
			await page.evaluate(async () => window.document.getElementById('number-input').value = '1234');
			await page.evaluate(async () => window.document.getElementById('password-input').value = '1234');
			await page.evaluate(async () => window.document.getElementById('textarea').value = '1234');
			await page.evaluate(async () => window.document.getElementById('select').value = 'non-empty');


			const fillingResults = await Promise.all([
				page.evaluate(async () => window.checkElement('js value change', 'tel', false)),
				page.evaluate(async () => window.checkElement('js value change', 'text', false)),
				page.evaluate(async () => window.checkElement('js value change', 'number', false)),
				page.evaluate(async () => window.checkElement('js value change', 'password', false)),
				page.evaluate(async () => window.checkElement('js value change', 'textarea', false)),
				page.evaluate(async () => window.checkElement('js value change', 'select', false)),
			]);

			// Reverting
			await page.evaluate(async () => window.document.getElementById('tel-input').value = '');
			await page.evaluate(async () => window.document.getElementById('text-input').value = '');
			await page.evaluate(async () => window.document.getElementById('number-input').value = '');
			await page.evaluate(async () => window.document.getElementById('password-input').value = '');
			await page.evaluate(async () => window.document.getElementById('textarea').value = '');
			await page.evaluate(async () => window.document.getElementById('select').value = '');

			const unfillingResults = await Promise.all([
				page.evaluate(async () => window.checkElement('js value change', 'tel', true)),
				page.evaluate(async () => window.checkElement('js value change', 'text', true)),
				page.evaluate(async () => window.checkElement('js value change', 'number', true)),
				page.evaluate(async () => window.checkElement('js value change', 'password', true)),
				page.evaluate(async () => window.checkElement('js value change', 'textarea', true)),
				page.evaluate(async () => window.checkElement('js value change', 'select', true)),
			]);

			await page.evaluate(async () => {
				window.document.getElementById('select').options[1].selected = true;
			});
			await page.evaluate(async () => window.checkElement('js value change', 'select', false));

			const result = [
				...fillingResults,
				...unfillingResults,
			].every(test => !!test);

			if (!result) {
				throw new Error('Test failed');
			}
		}

		// Dynamic element
		{
			await page.goto('http://localhost:8080');
			await page.evaluate(async () => {
				// eslint-disable-next-line no-undef
				return await window.runTest();
			});

			await page.evaluate(async () => {
				const filledInput = window.document.createElement('input');
				const unfilledInput = window.document.createElement('input');
				filledInput.value = 'foo';

				window.document.body.append(filledInput);
				window.document.body.append(unfilledInput);

				requestAnimationFrame(() => {
					// Not blank
					window.checkElement('dynamic input', filledInput, false);
					// Blank
					window.checkElement('dynamic input', unfilledInput, true);
				});
			});
		}

		// Replace with
		{
			await page.goto('http://localhost:8080/replace-with');
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
