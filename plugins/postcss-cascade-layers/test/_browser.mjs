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
								<li><a href="/wpt/layer-basic.html">basic</a></li>
								<li><a href="/wpt/layer-counter-style-override.html">counter style override</a></li>
								<li><a href="/wpt/layer-important.html">important</a></li>
								<li><a href="/wpt/layer-keyframes-override.html">keyframes override</a></li>
								<li><a href="/wpt/layer-media-query.html">media query</a></li>
								<li><a href="/wpt/layer-property-override.html">property override</a></li>
								<li><a href="/wpt/layer-vs-inline-style.html">layer vs. inline style</a></li>
							</ul>
						</body>
					</html>
				`);
				break;
			case '/wpt/layer-basic.html':
			case '/wpt/layer-counter-style-override.html':
			case '/wpt/layer-important.html':
			case '/wpt/layer-keyframes-override.html':
			case '/wpt/layer-media-query.html':
			case '/wpt/layer-property-override.html':
			case '/wpt/layer-vs-inline-style.html':
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

		for (const url of [
			'wpt/layer-basic.html',
			'wpt/layer-counter-style-override.html',
			'wpt/layer-important.html',
			'wpt/layer-keyframes-override.html',
			'wpt/layer-media-query.html',
			'wpt/layer-property-override.html',
			'wpt/layer-vs-inline-style.html',
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

		await server.close();
	} else {
		console.log('visit : http://localhost:8080');
	}
})();
