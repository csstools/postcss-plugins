import parser from 'postcss-selector-parser';

export default function alwaysValidSelector(selector: string): boolean {
	const selectorAST = parser().astSync(selector);

	let alwaysValid = true;

	selectorAST.walk((x) => {
		if (
			x.type === 'class' ||
			x.type === 'comment' ||
			x.type === 'id' ||
			x.type === 'root' ||
			x.type === 'selector' ||
			x.type === 'string' ||
			x.type === 'tag' ||
			x.type === 'universal'
		) {
			return;
		}

		if (x.type === 'attribute' && !x.insensitive) {
			return;
		}

		if (
			x.type === 'combinator' && (
				x.value === '+' ||
				x.value === '>' ||
				x.value === '~' ||
				x.value === ' '
			)
		) {
			return;
		}

		if (
			x.type === 'pseudo' &&
			!x.nodes?.length &&(
				x.value.toLowerCase() === ':hover' ||
				x.value.toLowerCase() === ':focus'
			)
		) {
			return;
		}

		if (
			x.type === 'pseudo' &&
			x.nodes?.length === 1 && (
				x.value.toLowerCase() === ':not'
			)
		) {
			let isSimpleNot = true;
			x.nodes[0].walkCombinators(() => {
				isSimpleNot = false;
			});

			if (isSimpleNot) {
				return;
			}
		}

		alwaysValid = false;
		return false;
	});

	return alwaysValid;
}
