export function parallelBuildsNotice(label) {
	return `> [!IMPORTANT]\n> [${label}] assumes to process your complete CSS bundle.<br>If your build tool processes files individually or processes files in parallel the output will be incorrect.<br>Using [\`@csstools/postcss-bundler\`](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-bundler) and \`@import\` statements is one way to make sure your CSS is bundled before it is processed by this plugin.\n`;
}
