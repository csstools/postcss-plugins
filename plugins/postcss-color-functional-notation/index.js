import postcss from 'postcss';
import parser from 'postcss-values-parser';

export default postcss.plugin('postcss-color-functional-notation', opts => {
	const preserve = 'preserve' in Object(opts) ? Boolean(opts.preserve) : false;

	return root => {
		root.walkDecls(decl => {
			const { value } = decl;

			if (colorAnyRegExp.test(value)) {
				const ast = parser(value).parse();

				ast.walkType('func', node => {
					if (colorRegExp.test(node.value)) {
						const children = node.nodes.slice(1, -1);
						const isFunctionalHSL = matchFunctionalHSL(children);
						const isFunctionalRGB1 = matchFunctionalRGB1(children);
						const isFunctionalRGB2 = matchFunctionalRGB2(children);

						if (isFunctionalHSL || isFunctionalRGB1 || isFunctionalRGB2) {
							const slashNode = children[3];
							const alphaNode = children[4];

							if (alphaNode) {
								if (isPercentage(alphaNode) && !isCalc(alphaNode)) {
									alphaNode.unit = '';
									alphaNode.value = String(alphaNode.value / 100);
								}

								if (isHslRgb(node)) {
									node.value += 'a';
								}
							} else if (isHslaRgba(node)) {
								node.value = node.value.slice(0, -1);
							}

							if (isSlash(slashNode)) {
								slashNode.replaceWith( newComma() );
							}

							if (isFunctionalRGB2) {
								children[0].unit = children[1].unit = children[2].unit = '';

								children[0].value = String(Math.floor(children[0].value * 255 / 100));
								children[1].value = String(Math.floor(children[1].value * 255 / 100));
								children[2].value = String(Math.floor(children[2].value * 255 / 100));
							}

							node.nodes.splice(3, 0, [ newComma() ]);
							node.nodes.splice(2, 0, [ newComma() ]);
						}
					}
				});

				const newValue = String(ast);

				if (preserve) {
					decl.cloneBefore({ value: newValue });
				} else {
					decl.value = newValue;
				}
			}
		});
	};
});

const alphaUnitMatch = /^%?$/i;
const calcFuncMatch = /^calc$/i;
const colorAnyRegExp = /(^|[^\w-])(hsla?|rgba?)\(/i;
const colorRegExp = /^(hsla?|rgba?)$/i;
const hslRgbFuncMatch = /^(hsl|rgb)$/i;
const hslaRgbaFuncMatch = /^(hsla|rgba)$/i;
const hueUnitMatch = /^(deg|grad|rad|turn)?$/i;
const isAlphaValue = node => isCalc(node) || Object(node).type === 'number' && alphaUnitMatch.test(node.unit);
const isCalc = node => Object(node).type === 'func' && calcFuncMatch.test(node.value);
const isHue = node => isCalc(node) || Object(node).type === 'number' && hueUnitMatch.test(node.unit);
const isNumber = node => isCalc(node) || Object(node).type === 'number' && node.unit === '';
const isPercentage = node => isCalc(node) || Object(node).type === 'number' && (node.unit === '%' || node.unit === '' && node.value === '0');
const isHslRgb = node => Object(node).type === 'func' && hslRgbFuncMatch.test(node.value);
const isHslaRgba = node => Object(node).type === 'func' && hslaRgbaFuncMatch.test(node.value);
const isSlash = node => Object(node).type === 'operator' && node.value === '/';
const functionalHSLMatch = [isHue, isPercentage, isPercentage, isSlash, isAlphaValue];
const functionalRGB1Match = [isNumber, isNumber, isNumber, isSlash, isAlphaValue];
const functionalRGB2Match = [isPercentage, isPercentage, isPercentage, isSlash, isAlphaValue];

const matchFunctionalHSL = children => children.every(
	(child, index) => typeof functionalHSLMatch[index] === 'function' && functionalHSLMatch[index](child)
);
const matchFunctionalRGB1 = children => children.every(
	(child, index) => typeof functionalRGB1Match[index] === 'function' && functionalRGB1Match[index](child)
);
const matchFunctionalRGB2 = children => children.every(
	(child, index) => typeof functionalRGB2Match[index] === 'function' && functionalRGB2Match[index](child)
);

const newComma = () => parser.comma({ value: ',' })
