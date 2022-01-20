import parser from 'postcss-selector-parser';

export function handleLinkAndVisited(rule, result, preserve) {
	const rawSelector = rule.raws.selector && rule.raws.selector.raw || rule.selector;

	let updatedSelector;

	try {
		// update the selector
		updatedSelector = parser((selectorsAST) => {
			selectorsAST.walkPseudos((pseudo) => {
				if (pseudo.value !== ':any-link' || (pseudo.nodes && pseudo.nodes.length)) {
					return;
				}

				pseudo.value = ':is(:link, :visited)';
			});
		}).processSync(rawSelector);
	} catch (_) {
		rule.warn(result, `Failed to parse selector : ${rule.selector}`);
		return;
	}

	if (typeof updatedSelector === 'undefined') {
		return;
	}

	if (updatedSelector === rawSelector) {
		return;
	}

	if (preserve) {
		rule.cloneBefore({
			selector: updatedSelector,
		});
	} else {
		rule.selector = updatedSelector;
	}
}
