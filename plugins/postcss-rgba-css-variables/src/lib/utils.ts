import { Colord } from 'colord';
import type valueParser from 'postcss-value-parser';


export function parseColor(color: Colord): string | undefined {
	if(!color.isValid()) {
		return;
	}
	const { r, g, b } = color.toRgb();
	return `${r}, ${g}, ${b}`;
}

export const cssVariablesRegExp = new RegExp('var\\(([^()]*?--[^()]*)\\)', 'g');

export function isCssVariableValue(value: string): boolean {
	return cssVariablesRegExp.test(value);
}

export function isRootRule(selector: string): boolean{
	const defaultSelectorRegExp = [/^\*$/, /^html$/i, /^:root$/i];
	return defaultSelectorRegExp.some(reg => reg.test(selector));
}


export const COMMON_VARIABLES_KEY = 'root';


export function getValueFromParsedVariable(parsed: valueParser.ParsedValue): string | undefined {
	let result: string;

	parsed.walk(node => {
		if (!(node.type === 'function' && node.value === 'var')) {
			return;
		}

		const zero = node.nodes[0];
		if(zero.type !== 'word') {
			return;
		}

		result =  zero.value;
	});

	return result;
}

export function isRgbaCssVariablesDecl(value: string): boolean {
	return /^rgba\(var\(/.test(value);
}
