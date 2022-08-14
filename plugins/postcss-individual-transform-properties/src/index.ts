import { Declaration, PluginCreator } from 'postcss';

type pluginOptions = unknown;

const propNames = [
	'scale',
	'translate',
	'rotate',
	'transform',
];

const props = {
	'scale': 'scale3d',
	'translate': 'translate3d',
	'rotate': 'rotate3d',
	'transform': 'transform',
};

const namespace = 'csstools-itp';
const transformReplacement = `var(--${namespace}-translate, ) var(--${namespace}-scale, ) var(--${namespace}-rotate, ) var(--${namespace}-transform, )`;

const creator: PluginCreator<pluginOptions> = () => {
	return {
		postcssPlugin: 'postcss-individual-transform-properties',
		prepare() {
			let addedRootProps = false;

			return {
				Declaration(decl, { postcss }) {
					const lowerCaseProp = decl.prop.toLowerCase();
					if (!propNames.includes(lowerCaseProp)) {
						return;
					}

					if (lowerCaseProp === 'transform' && decl.value === transformReplacement) {
						return;
					}

					if (lowerCaseProp === 'transform' && decl.important) {
						return;
					}

					// TODO : css wide keywords need special handling

					// TODO : values need syntax mapping

					const propName = `--${namespace}-${lowerCaseProp}`;
					let value = `${props[lowerCaseProp]}(${decl.value})`;
					if (lowerCaseProp === 'transform') {
						value = decl.value;
					}

					decl.cloneBefore({
						prop: propName,
						value: value,
					});

					if (!addedRootProps && lowerCaseProp !== 'transform') {
						const starRule = postcss.rule({ selector: '*' });
						starRule.source = decl.source;

						const transformDecl = postcss.decl({ prop: `--${namespace}-transform`, value: 'initial' });
						transformDecl.source = decl.source;

						const rotateDecl = postcss.decl({ prop: `--${namespace}-rotate`, value: 'initial' });
						rotateDecl.source = decl.source;

						const scaleDecl = postcss.decl({ prop: `--${namespace}-scale`, value: 'initial' });
						scaleDecl.source = decl.source;

						const translateDecl = postcss.decl({ prop: `--${namespace}-translate`, value: 'initial' });
						translateDecl.source = decl.source;

						starRule.append(transformDecl);
						starRule.append(rotateDecl);
						starRule.append(scaleDecl);
						starRule.append(translateDecl);

						decl.root().prepend(starRule);
						addedRootProps = true;
					}

					decl.remove();
				},
				RuleExit(rule) {
					if (!rule.some((x) => x.type === 'decl' && x.prop.startsWith('--csstools-itp-'))) {
						return;
					}

					if (rule.some((x) => x.type === 'decl' && x.prop.toLowerCase() === 'transform' && x.value === transformReplacement)) {
						return;
					}

					let lastMatchingNode: Declaration | null = null;
					rule.each((decl) => {
						if (decl.type !== 'decl') {
							return;
						}

						if (!decl.prop.startsWith('--csstools-itp-')) {
							return;
						}

						if (decl.value.toLowerCase() === 'initial') {
							return;
						}

						lastMatchingNode = decl;
					});

					if (lastMatchingNode) {
						lastMatchingNode.cloneAfter({
							prop: 'transform',
							value: transformReplacement,
						});
					}
				},
				OnceExit(root) {
					if (addedRootProps) {
						addedRootProps = false;
						return;
					}

					root.walkDecls((decl) => {
						if (decl.prop === `--${namespace}-transform`) {
							decl.prop = 'transform';
							return;
						}

						if (decl.value === transformReplacement) {
							decl.remove();
						}
					});
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;

// css wide keywords
const cssWideKeywords = [
	'none',
	'unset',
	'inherit',
	'initial',
	'revert',
	'revert-layer',
];
