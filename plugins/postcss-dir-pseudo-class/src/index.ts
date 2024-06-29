import type { Plugin, PluginCreator } from 'postcss';
import selectorParser from 'postcss-selector-parser';

/** postcss-dir-pseudo-class plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
	/** Assume a direction for the document. default: null */
	dir?: 'ltr' | 'rtl'
	/** Assume that the CSS is intended to be used in Shadow DOM with Custom Elements. default: false */
	shadow?: boolean,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options: {
		preserve: boolean,
		dir: 'ltr' | 'rtl'
		shadow: boolean,
	} = Object.assign(
		// Default options
		{
			dir: null,
			preserve: false,
			shadow: false,
		},
		// Provided options
		opts,
	);

	return {
		postcssPlugin: 'postcss-dir-pseudo-class',
		prepare(): Plugin {
			const transformedNodes = new WeakSet();

			return {
				postcssPlugin: 'postcss-dir-pseudo-class',
				Rule(rule, { result }): void {
					if (transformedNodes.has(rule)) {
						return;
					}

					let emittedWarningForHierarchicalDir = false;

					// walk rules using the :dir pseudo-class
					if (!rule.selector.toLowerCase().includes(':dir(')) {
						return;
					}

					let modifiedSelector;

					try {
						modifiedSelector = selectorParser(selectors => {
							// for each (comma separated) selector
							selectors.nodes.forEach(selector => {
								// walk all selector nodes that are :dir pseudo-classes
								selector.walk(node => {
									if ('pseudo' !== node.type) {
										return;
									}

									if (':dir' !== node.value.toLowerCase()) {
										return;
									}

									if (!node.nodes || !node.nodes.length) {
										return;
									}

									// value of the :dir pseudo-class
									const value = node.nodes.toString().toLowerCase(); /* needs to be lower case because attribute value selectors are case sensitive */
									if (value !== 'rtl' && value !== 'ltr') {
										return;
									}

									const parent = node.parent as selectorParser.Selector;
									if (!parent) {
										return;
									}

									const otherDirPseudos = parent.nodes.filter((other) => {
										return 'pseudo' === other.type && ':dir' === other.value.toLowerCase();
									});
									if (otherDirPseudos.length > 1 && !emittedWarningForHierarchicalDir) {
										emittedWarningForHierarchicalDir = true;
										rule.warn(result, `Hierarchical :dir pseudo class usage can't be transformed correctly to [dir] attributes. This will lead to incorrect selectors for "${rule.selector}"`);
									}

									// previous and next selector nodes
									const prev = node.prev();
									const next = node.next();

									const prevIsNonCombinator = prev && prev.type && 'combinator' !== prev.type;
									const nextIsNonCombinator = next && next.type && 'combinator' !== next.type;
									const nextIsNonCombinatorOrSpace = next && next.type && ('combinator' !== next.type || ('combinator' === next.type && ' ' === next.value));

									if (prevIsNonCombinator) {
										node.remove();
									} else if (nextIsNonCombinator) {
										node.remove();
									} else if (parent.nodes.indexOf(node) === 0 && nextIsNonCombinatorOrSpace) {
										node.remove();
									} else if (parent.nodes.length === 1) {
										node.remove();
									} else {
										node.replaceWith(
											// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
											selectorParser.universal(),
										);
									}

									// conditionally prepend a combinator before inserting the [dir] attribute
									const first = parent.nodes[0];
									const firstIsSpaceCombinator = first && 'combinator' === first.type && ' ' === first.value;
									const firstIsHtml = first && 'tag' === first.type && 'html' === first.value.toLowerCase();
									const firstIsRoot = first && 'pseudo' === first.type && ':root' === first.value.toLowerCase();

									if (first && !firstIsHtml && !firstIsRoot && !firstIsSpaceCombinator) {
										parent.prepend(
											selectorParser.combinator({
												value: ' ',
											}),
										);
									}

									// whether :dir matches the presumed direction
									const isdir = options.dir === value;

									// [dir] attribute
									const dirAttr = selectorParser.attribute({
										attribute: 'dir',
										operator: '=',
										quoteMark: '"',
										value: `"${value}"`,
										raws: {},
									});

									// :host-context([dir]) for Shadow DOM CSS
									const hostContextPseudo = selectorParser.pseudo({
										value: ':host-context',
									});
									hostContextPseudo.append(selectorParser.selector({
										value: '',
										nodes: [
											dirAttr,
										],
									}));

									// not[dir] attribute
									const notDirAttr = selectorParser.pseudo({
										value: `${firstIsHtml || firstIsRoot ? '' : 'html'}:not`,
									});

									notDirAttr.append(
										selectorParser.selector({
											value: '',
											nodes: [
												selectorParser.attribute({
													attribute: 'dir',
													operator: '=',
													quoteMark: '"',
													value: `"${'ltr' === value ? 'rtl' : 'ltr'}"`,
													raws: {},
												}),
											],
										}),
									);

									if (isdir) {
										// if the direction is presumed
										if (firstIsHtml) {
											// insert :root after html tag
											parent.insertAfter(first, notDirAttr);
										} else {
											// prepend :root
											parent.prepend(notDirAttr);
										}
									} else if (firstIsHtml) {
										// insert dir attribute after html tag
										parent.insertAfter(first, dirAttr);
									} else if (options.shadow && !firstIsRoot) {
										// prepend :host-context([dir])
										parent.prepend(hostContextPseudo);
									} else {
										// otherwise, prepend the dir attribute
										parent.prepend(dirAttr);
									}
								});
							});
						}).processSync(rule.selector);
					} catch {
						rule.warn(result, `Failed to parse selector : ${rule.selector}`);
						return;
					}

					if (typeof modifiedSelector === 'undefined') {
						return;
					}

					if (modifiedSelector === rule.selector) {
						return;
					}

					transformedNodes.add(rule);
					rule.cloneBefore({ selector: modifiedSelector });

					if (!options.preserve) {
						rule.remove();
					}
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
