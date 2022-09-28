import type { NodeList } from '../node-list';

export function notPseudo(list: NodeList, exclude: NodeList): NodeList {
	return list.filter((node) => {
		return !exclude.includes(node);
	});
}
