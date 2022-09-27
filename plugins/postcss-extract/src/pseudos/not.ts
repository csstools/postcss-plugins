import type { Node } from 'postcss';

export function notPseudo(list: Array<Node>, exclude: Array<Node>): Array<Node> {
	return list.filter((node) => {
		return !exclude.includes(node);
	});
}
