import puppeteer from 'puppeteer';
import http from 'http';
import { promises as fsp } from 'fs';
import plugin from '@csstools/postcss-cascade-layers';
import postcss from 'postcss';

// TODO : bring over more tests from WPT

(async () => {
	const requestListener = async function (req, res) {

		const parsedUrl = new URL(req.url, 'http://localhost:8080');
		const pathname = parsedUrl.pathname;

		switch (pathname) {
			case '/wpt/layer-basic.html':
				res.setHeader('Content-type', 'text/html');
				res.writeHead(200);
				res.end(await fsp.readFile('test/wpt/layer-basic.html', 'utf8'));
				break;
			case '/wpt/layer-counter-style-override.html':
				res.setHeader('Content-type', 'text/html');
				res.writeHead(200);
				res.end(await fsp.readFile('test/wpt/layer-counter-style-override.html', 'utf8'));
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

		{
			await page.goto('http://localhost:8080/wpt/layer-basic.html');
			const result = await page.evaluate(async () => {
				// eslint-disable-next-line no-undef
				return await window.runTest();
			});
			if (!result) {
				throw new Error('Test failed, expected "window.runTest()" to return true');
			}
		}

		// TODO : uncomment
		// {
		// 	await page.goto('http://localhost:8080/wpt/layer-counter-style-override.html');
		// 	const result = await page.evaluate(async () => {
		// 		// eslint-disable-next-line no-undef
		// 		return await window.runTest();
		// 	});
		// 	if (!result) {
		// 		throw new Error('Test failed, expected "window.runTest()" to return true');
		// 	}
		// }

		await browser.close();

		await server.close();
	} else {
		console.log('visit : http://localhost:8080');
	}
})();
