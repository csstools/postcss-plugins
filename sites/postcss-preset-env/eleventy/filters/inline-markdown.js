const MarkdownIt = require('markdown-it');

module.exports = function inlineMarkdown(string) {
	const md = new MarkdownIt({
		html: true,
	});

	return md.renderInline(string);
};
