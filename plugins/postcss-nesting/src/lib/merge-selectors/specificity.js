import parser from 'postcss-selector-parser';

export function nodesAreEquallySpecific(nodes) {
	// Selector specificity is important when the parent selector is a list.
	// These cases should be resolved with `:is()` pseudo.
	// Since browser support for `:is()` is not great, we try to avoid it.
	// If the selector specificity is equal for all items in the selector list, we don't need `:is`.

	const specificities = nodes.map((node) => {
		return parser().astSync(node);
	}).map((ast) => {
		return selectorSpecificity(ast);
	});

	const first = specificities[0];
	for (let i = 1; i < specificities.length; i++) {
		if (first.a === specificities[i].a && first.b === specificities[i].b && first.c === specificities[i].c) {
			continue;
		}

		return false;
	}

	return true;
}

export function selectorSpecificity(node) {
	let a = 0;
	let b = 0;
	let c = 0;

	if (node.type == 'universal') {
		return {
			a: 0,
			b: 0,
			c: 0,
		};
	} else if (node.type === 'id') {
		a += 1;
	} else if (node.type === 'tag') {
		c += 1;
	} else if (node.type === 'class') {
		b += 1;
	} else if (node.type === 'attribute') {
		b += 1;
	} else if (node.type === 'pseudo' && node.value.indexOf('::') === 0) {
		c += 1;
	} else if (node.type === 'pseudo') {
		switch (node.value) {
			case ':after':
			case ':before':
				c += 1;
				break;

			case ':is':
			case ':has':
			case ':not':
			{
				if (node.nodes && node.nodes.length > 0) {
					let mostSpecificListItem = {
						a: 0,
						b: 0,
						c: 0,
					};

					node.nodes.forEach((child) => {
						const itemSpecificity = selectorSpecificity(child);
						if (itemSpecificity.a > mostSpecificListItem.a) {
							mostSpecificListItem = itemSpecificity;
							return;
						} else if (itemSpecificity.a < mostSpecificListItem.a) {
							return;
						}

						if (itemSpecificity.b > mostSpecificListItem.b) {
							mostSpecificListItem = itemSpecificity;
							return;
						} else if (itemSpecificity.b < mostSpecificListItem.b) {
							return;
						}

						if (itemSpecificity.c > mostSpecificListItem.c) {
							mostSpecificListItem = itemSpecificity;
							return;
						}
					});

					a += mostSpecificListItem.a;
					b += mostSpecificListItem.b;
					c += mostSpecificListItem.c;
				}
				break;
			}

			case 'where':
				break;

			case ':nth-child':
			case ':nth-last-child':
				{
					const ofSeparatorIndex = node.nodes.findIndex((x) => {
						x.value === 'of';
					});

					if (ofSeparatorIndex > -1) {
						const ofSpecificity = selectorSpecificity(parser.selector({ nodes: node.nodes.slice(ofSeparatorIndex + 1), value: '' }));
						a += ofSpecificity.a;
						b += ofSpecificity.b;
						c += ofSpecificity.c;
					} else {
						a += a;
						b += b;
						c += c;
					}
				}
				break;

			default:
				b += 1;
		}
	} else if (node.nodes && node.nodes.length > 0) {
		node.nodes.forEach((child) => {
			const specificity = selectorSpecificity(child);
			a += specificity.a;
			b += specificity.b;
			c += specificity.c;
		});
	}

	return {
		a,
		b,
		c,
	};
}
