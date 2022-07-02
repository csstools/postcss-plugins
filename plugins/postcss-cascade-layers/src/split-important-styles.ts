import type { AtRule, Container } from 'postcss';
import { removeEmptyDescendantBlocks } from './clean-blocks';
import { ATRULES_WITH_NON_SELECTOR_BLOCK_LISTS } from './constants';

// Declarations with !important have inverse priority in layers.
// Splitting rules allows us to assign different specificity to rules with or without !important declarations.
export function splitImportantStyles(root: Container) {
	root.walkDecls((decl) => {
		if (!decl.important) {
			return;
		}

		const parent = decl.parent;
		if (parent.parent && parent.parent.type === 'atrule' && ATRULES_WITH_NON_SELECTOR_BLOCK_LISTS.includes((parent.parent as AtRule).name.toLowerCase())) {
			return;
		}

		const parentClone = parent.clone();

		parentClone.each((node) => {
			if (node.type === 'decl' && node.important) {
				return;
			}

			node.remove();
		});

		parent.each((node) => {
			if (node.type === 'decl' && node.important) {
				node.remove();
			}
		});

		parent.before(parentClone);
		removeEmptyDescendantBlocks(parent);
	});
}
