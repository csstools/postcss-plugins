import parser from 'postcss-selector-parser';

export function handleAreaHref(rule, result) {
	const areaHrefSelectors = [];

	try {
		for (let i = 0; i < rule.selectors.length; i++) {
			parser((selectorAST) => {
				let containsAnyLink = false;

				selectorAST.walkPseudos((pseudo) => {
					if (pseudo.value !== ':any-link' || (pseudo.nodes && pseudo.nodes.length)) {
						return;
					}

					// area[href] does not make sense if the original selector was `a:any-link`
					// look for a tag in the same selector and skip when found
					if (pseudo.parent && pseudo.parent.nodes && pseudo.parent.nodes.length) {
						let hasTag = false;
						let hasAnyLink = false;
						for (let j = 0; j < pseudo.parent.nodes.length; j++) {
							const element = pseudo.parent.nodes[j];

							if (element.type === 'pseudo' && element.value === ':any-link') {
								if (hasTag) {
									return;
								} else {
									hasAnyLink = true;
								}
							}

							if (element.type === 'tag') {
								if (hasAnyLink) {
									return;
								} else {
									hasTag = true;
								}
							}

							if (element.type === 'combinator') {
								hasTag = false;
								hasAnyLink = false;
								continue;
							}
						}
					}

					containsAnyLink = true;
					pseudo.value = ':is(area[href])';
				});

				if (!containsAnyLink) {
					return;
				}

				areaHrefSelectors.push(selectorAST.toString());
			}).processSync(rule.selectors[i]);
		}
	} catch (_) {
		rule.warn(result, `Failed to parse selector : ${rule.selector}`);
		return;
	}

	if (areaHrefSelectors.length > 0) {
		rule.cloneBefore({
			selectors: areaHrefSelectors,
		});
	}
}
