// return transformed selectors, replacing custom pseudo selectors with custom selectors
export default function transformSelectorList(selectorList, customSelectors) {
	let index = selectorList.nodes.length - 1;

	while (index >= 0) {
		const transformedSelectors = transformSelector(selectorList.nodes[index], customSelectors);

		if (transformedSelectors.length) {
			selectorList.nodes.splice(index, 1, ...transformedSelectors);
		}

		--index;
	}

	return selectorList;
}

// return custom pseudo selectors replaced with custom selectors
function transformSelector(selector, customSelectors) {
	const transpiledSelectors = [];

	for (const index in selector.nodes) {
		const { value, nodes } = selector.nodes[index];

		if (value in customSelectors) {
			for (const replacementSelector of customSelectors[value].nodes) {
				const selectorClone = selector.clone();

				selectorClone.nodes.splice(index, 1, ...replacementSelector.clone().nodes.map(node => {
					// use spacing from the current usage
					node.spaces = { ...selector.nodes[index].spaces };

					return node;
				}));

				const retranspiledSelectors = transformSelector(selectorClone, customSelectors);

				if (retranspiledSelectors.length) {
					transpiledSelectors.push(...retranspiledSelectors);
				} else {
					transpiledSelectors.push(selectorClone);
				}
			}

			return transpiledSelectors;
		} else if (nodes && nodes.length) {
			transformSelectorList(selector.nodes[index], customSelectors);
		}
	}

	return transpiledSelectors;
}
