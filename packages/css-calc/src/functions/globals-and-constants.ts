import { NumberType, TokenType } from '@csstools/css-tokenizer';
import { ComponentValue, isTokenNode, TokenNode } from '@csstools/css-parser-algorithms';
import { Globals } from '../util/globals';

export function resolveGlobalsAndConstants(nodes: Array<ComponentValue>, globals: Globals): Array<ComponentValue> {
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		if (!isTokenNode(node)) {
			continue;
		}

		const token = node.value;
		if (token[0] !== TokenType.Ident) {
			continue;
		}

		const ident = token[4].value.toLowerCase();
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

			default:
				if (globals.has(ident)) {
					const replacement = globals.get(ident);
					nodes.splice(i, 1, new TokenNode(replacement));
				}
				break;
		}
	}

	return nodes;
}
