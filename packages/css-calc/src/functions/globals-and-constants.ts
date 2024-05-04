import { NumberType, TokenType, isTokenIdent } from '@csstools/css-tokenizer';
import { ComponentValue, isTokenNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Globals } from '../util/globals';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';

export function resolveGlobalsAndConstants(nodes: Array<ComponentValue>, globals: Globals): Array<ComponentValue> {
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if (!isTokenNode(node)) {
			continue;
		}

		const token = node.value;
		if (!isTokenIdent(token)) {
			continue;
		}

		const ident = toLowerCaseAZ(token[4].value);
		switch (ident) {
			case 'e':
				nodes.splice(i, 1, new TokenNode([TokenType.Number, Math.E.toString(), token[2], token[3], {
					value: Math.E,
					type: NumberType.Number,
				}]));
				break;
			case 'pi':
				nodes.splice(i, 1, new TokenNode([TokenType.Number, Math.PI.toString(), token[2], token[3], {
					value: Math.PI,
					type: NumberType.Number,
				}]));
				break;
			case 'infinity':
				nodes.splice(i, 1, new TokenNode([TokenType.Number, 'infinity', token[2], token[3], {
					value: Infinity,
					type: NumberType.Number,
				}]));
				break;
			case '-infinity':
				nodes.splice(i, 1, new TokenNode([TokenType.Number, '-infinity', token[2], token[3], {
					value: -Infinity,
					type: NumberType.Number,
				}]));
				break;
			case 'nan':
				nodes.splice(i, 1, new TokenNode([TokenType.Number, 'NaN', token[2], token[3], {
					value: Number.NaN,
					type: NumberType.Number,
				}]));
				break;

			default:
				if (globals.has(ident)) {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					const replacement = globals.get(ident)!;
					nodes.splice(i, 1, new TokenNode(replacement));
				}
				break;
		}
	}

	return nodes;
}
