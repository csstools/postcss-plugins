import valueParser from 'postcss-value-parser';
import { colord } from 'colord';

const defaultSelectorRegExp = [/^\*$/, /^html$/i, /^:root$/i];

function isWantRule(node, regs): boolean {
	return node
		&& node.type === 'rule'
		&& node.selector.split(',').some(i => regs.some(j => j.test(i)))
		&& node.nodes.length > 0;
}

export function isDeclColor(value) {
	return /(?:#|0x)(?:[a-f0-9]{3}){1,2}\b|(?:rgb|hsl)\([^)]*\)/i.test(value);
}

export function convertColorToRgb(color) {
	const rgb = colord(color).toRgb();
}

export default function getCssVariables(root, options?): Map<string, valueParser.ParsedValue> {
	const output: Map<string, valueParser.ParsedValue> = new Map();

	// console.dir(root, { depth: null });

	root.nodes.forEach((rule,index) => {
		// console.log(index, '\n');
		// console.dir(rule, { depth: null });
		if(!isWantRule(rule, defaultSelectorRegExp)) {
			return;
		}
		rule.nodes.forEach(decl => {
			// console.log(1111, decl.prop);
			// console.dir(valueParser(decl.value), { depth: null });
			if (decl.variable && isDeclColor(decl.value)) {
				// console.log(1111, decl.prop, decl.value, valueParser(decl.value));
				// console.dir(decl, { depth: null });

				output.set(decl.prop, valueParser(decl.value));
			}
		});
	});

	// console.dir(output, { depth: null });

	return output;
}
