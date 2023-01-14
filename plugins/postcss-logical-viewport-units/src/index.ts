import type { PluginCreator } from 'postcss';
import { hasSupportsAtRuleAncestor } from './has-supports-at-rule-ancestor';
import { transform } from './transform';

/** postcss-logical-viewport-units plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
	/** Control how logical viewport units are replaced. default: "horizontal" */
	writingMode: 'horizontal' | 'vertical',
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			writingMode: 'horizontal',
			preserve: true,
		},
		// Provided options
		opts,
	);

	if (options.writingMode !== 'vertical') {
		options.writingMode = 'horizontal';
	}

	const replacements: { vi: 'vw' | 'vh', vb: 'vw' | 'vh' } = {
		vb: 'vh',
		vi: 'vw',
	};

	if (options.writingMode === 'vertical') {
		replacements.vb = 'vw';
		replacements.vi = 'vh';
	}

	return {
		postcssPlugin: 'postcss-logical-viewport-units',
		Declaration(decl, { atRule }) {
			{
				// Fast check
				const lowerCaseValue = decl.value.toLowerCase();
				if (!(lowerCaseValue.includes('vb') || lowerCaseValue.includes('vi'))) {
					return;
				}

				// Declaration already has a fallback
				const prev = decl.prev();
				if (prev && prev.type === 'decl' && prev.prop === decl.prop) {
					return;
				}

				// Is wrapped in a relevant `@supports`
				if (hasSupportsAtRuleAncestor(decl)) {
					return;
				}
			}

			const modifiedValue = transform(decl.value, replacements);
			if (modifiedValue === decl.value) {
				return;
			}

			decl.cloneBefore({
				value: modifiedValue,
			});

			if (!options.preserve) {
				decl.remove();
				return;
			}

			if (!decl.variable) {
				return;
			}

			const supports = atRule({
				name: 'supports',
				params: '(top: 1vi)',
				source: decl.source,
			});

			const parent = decl.parent;
			const parentClone = decl.parent.cloneAfter({ nodes: [] });

			parentClone.append(decl);
			supports.append(parentClone);

			parent.after(supports);
		},
	};
};

creator.postcss = true;

export default creator;
