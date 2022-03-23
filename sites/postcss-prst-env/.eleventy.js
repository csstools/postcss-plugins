const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const addHash = require('./eleventy/filters/add-hash');
const inlineMarkdown = require('./eleventy/filters/inline-markdown');
const cleanMarkdown = require('./eleventy/filters/clean-markdown');

module.exports = function (eleventyConfig) {
	// Copy favicon to route of /_site
	eleventyConfig.addPassthroughCopy({ 'src/static/favicon.ico': 'favicon.ico' });
	eleventyConfig.addPassthroughCopy({ 'src/static/images': 'static/images' });

	eleventyConfig.addNunjucksAsyncFilter('addHash', addHash);
	eleventyConfig.addFilter('inlineMarkdown', inlineMarkdown);
	eleventyConfig.addFilter('cleanMarkdown', cleanMarkdown);

	eleventyConfig.addPlugin(syntaxHighlight);

	// Override BrowserSync defaults (used only with --serve)
	eleventyConfig.setBrowserSyncConfig({
		callbacks: {
			ready: function(err, browserSync) {
				browserSync.addMiddleware("*", (req, res) => {
					// Provides the 404 content without redirect.
					res.writeHead(404, {"Content-Type": "text/html; charset=UTF-8"});
					res.write('');
					res.end();
				});
			},
		},
		ui: false,
		ghostMode: false
	});


	// Let Eleventy transform HTML files as nunjucks
	// So that we can use .html instead of .njk
	return {
		templateFormats: [
			'md',
			'njk',
			'html',
			'liquid'
		],
		markdownTemplateEngine: 'njk',
		htmlTemplateEngine: 'njk',
		dir: {
			output: "dist"
		},
	};
};
