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

				adjustNodesBySelectorEnds(selectorClone.nodes, Number(index));

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

// match selectors by difficult-to-separate ends
const withoutSelectorStartMatch = /^(tag|universal)$/;
const withoutSelectorEndMatch = /^(class|id|pseudo|tag|universal)$/;

const isWithoutSelectorStart = node => withoutSelectorStartMatch.test(Object(node).type);
const isWithoutSelectorEnd = node => withoutSelectorEndMatch.test(Object(node).type);

// adjust nodes by selector ends (so that .class:--h1 becomes h1.class rather than .classh1)
const adjustNodesBySelectorEnds = (nodes, index) => {
	if (index && isWithoutSelectorStart(nodes[index]) && isWithoutSelectorEnd(nodes[index - 1])) {
		let safeIndex = index - 1;

		while (safeIndex && isWithoutSelectorEnd(nodes[safeIndex])) {
			--safeIndex;
		}

		if (safeIndex < index) {
			const node = nodes.splice(index, 1)[0];

			nodes.splice(safeIndex, 0, node);

			nodes[safeIndex].spaces.before = nodes[safeIndex + 1].spaces.before;
			nodes[safeIndex + 1].spaces.before = '';

			if (nodes[index]) {
				nodes[index].spaces.after = nodes[safeIndex].spaces.after;
				nodes[safeIndex].spaces.after = '';
			}
		}
	}
};

