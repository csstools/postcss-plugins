import test from 'node:test';
import fs from 'node:fs/promises';
import path from 'node:path';

import postcss from 'postcss';
import { find, fork, parse, walk } from 'css-tree-3.0.0';

async function get_files(dir, recursive = true) {
	dir = path.resolve(dir);
	const dirents = await fs.readdir(dir, { withFileTypes: true });
	const files = await Promise.all(dirents.map((dirent) => {
		const res = path.resolve(dir, dirent.name);
		if (!res.startsWith(dir)) {
			return [];
		}

		if (dirent.isSymbolicLink()) {
			return [];
		}

		if (recursive && dirent.isDirectory()) {
			return get_files(res);
		}

		if (path.extname(res) !== '.css') {
			return [];
		}

		if (path.basename(res).includes('ignored')) {
			return [];
		}

		return [res];
	}));

	return files.flat();
}

function contains_unsupported_function(cssTreeNode) {
	return Boolean(
		find(
			cssTreeNode,
			(node) => node.type === 'Function' && ['var', 'env'].includes(node.name),
		),
	);
}

const css_files = await get_files('tests');

const patches = JSON.parse(await fs.readFile(path.join('dist', 'index.json'), 'utf-8')).next;

const forkedLexer = fork({
	properties: patches.properties,
	types: patches.types,
}).lexer;

for (const css_file of css_files) {
	await test(path.basename(css_file), async (t) => {
		const css_file_contents = await fs.readFile(css_file);

		const root = postcss.parse(css_file_contents, { from: css_file });

		const all_declarations = [];
		root.walkDecls((decl) => {
			all_declarations.push(decl);
		});

		for (let i = 0; i < all_declarations.length; i++) {
			const decl = all_declarations[i];
			if (decl.variable) {
				continue;
			}

			if (
				decl.parent?.type === 'atrule' &&
				(
					decl.parent.name === 'page' ||
					decl.parent.name === 'font-face'
				)
			) {
				// Remove this when adding support for descriptors.
				continue;
			}

			if (
				(
					css_file.includes('bootstrap.') ||
					css_file.includes('foundation.') ||
					css_file.includes('pure.')
				) &&
				/^-(?:o|moz|ms|webkit|khtml)-/i.test(decl.prop)
			) {
				// Bootstrap contains too many generated vendor prefixed props.
				// We don't want to test cycles between tools, only CSS written by humans.
				continue;
			}

			if (
				(
					css_file.includes('bootstrap.') ||
					css_file.includes('foundation.') ||
					css_file.includes('pure.')
				) &&
				(
					/-(?:o|moz|ms|webkit|khtml)-/i.test(decl.value) ||
					decl.value.includes('progid:') ||
					decl.value.includes('alpha(opacity=')
				)
			) {
				// Bootstrap contains too many generated vendor prefixed props.
				// We don't want to test cycles between tools, only CSS written by humans.
				continue;
			}

			const { prop, value } = decl;

			const csstree_value_node = parse(value, { context: 'value' });
			patch_relative_color_keywords(csstree_value_node);

			if (contains_unsupported_function(csstree_value_node)) {
				continue;
			}

			const result = forkedLexer.matchProperty(prop, csstree_value_node);
			if (!result.error) {
				continue;
			}

			await t.test(`(${path.basename(css_file) } - ${i}) ${decl}`, () => {
				throw result.error;
			});
		}
	});
}

function patch_relative_color_keywords(csstree_value_node) {
	let color_function_stack = 0;
	let relative_color_functions = /^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)$/i;
	let relative_color_channel_keywords = /^(?:r|g|b|h|s|l|a|b|c|w|b|x|y|z)$/i;

	walk(
		csstree_value_node,
		{
			enter: function (node) {
				if (
					node.type === 'Function' &&
					relative_color_functions.test(node.name)
				) {
					color_function_stack++;

					return;
				}

				if (
					node.type === 'Identifier' &&
					color_function_stack > 0 &&
					relative_color_channel_keywords.test(node.name)
				) {
					node.type = 'Number';
					node.value = '0';
					delete node.name;

					return;
				}
			},
			exit: function (node) {
				if (
					node.type === 'Function' &&
					relative_color_functions.test(node.name)
				) {
					color_function_stack--;

					return;
				}
			},
		},
	);
}
