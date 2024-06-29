const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const addHash = require('./eleventy/filters/add-hash.cjs');
const inlineMarkdown = require('./eleventy/filters/inline-markdown.cjs');
const cleanMarkdown = require('./eleventy/filters/clean-markdown.cjs');
const { DateTime } = require('luxon');

module.exports = function (eleventyConfig) {
	// Copy favicon to route of /_site
	eleventyConfig.addPassthroughCopy({ 'src/static/favicon.ico': 'favicon.ico' });
	eleventyConfig.addPassthroughCopy({ 'src/static/images': 'static/images' });

	eleventyConfig.addNunjucksAsyncFilter('addHash', addHash);
	eleventyConfig.addFilter('inlineMarkdown', inlineMarkdown);
	eleventyConfig.addFilter('cleanMarkdown', cleanMarkdown);

	eleventyConfig.addPlugin(syntaxHighlight);
	eleventyConfig.addPlugin(pluginRss);

	eleventyConfig.addFilter('postDate', (dateObj) => {
		return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
	});
	eleventyConfig.addFilter('postDateISO', (dateObj) => {
		return DateTime.fromJSDate(dateObj).toISODate();
	});
	eleventyConfig.addFilter('ghPath', (inputPath) => {
		return inputPath.replace('./', 'https://github.com/csstools/postcss-plugins/tree/main/sites/postcss-preset-env/');
	});

	// Override BrowserSync defaults (used only with --serve)
	eleventyConfig.setBrowserSyncConfig({
		callbacks: {
			ready: function(err, browserSync) {
				browserSync.addMiddleware('*', (req, res) => {
					// Provides the 404 content without redirect.
					res.writeHead(404, {'Content-Type': 'text/html; charset=UTF-8'});
					res.write('');
					res.end();
				});
			},
		},
		ui: false,
		ghostMode: false,
	});


	// Let Eleventy transform HTML files as nunjucks
	// So that we can use .html instead of .njk
	return {
		templateFormats: [
			'md',
			'njk',
			'html',
			'liquid',
		],
		markdownTemplateEngine: 'njk',
		htmlTemplateEngine: 'njk',
		dir: {
			output: 'dist',
		},
	};
};
