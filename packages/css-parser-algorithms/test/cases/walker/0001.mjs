import { TokenType, tokenize } from '@csstools/css-tokenizer';
import assert from 'assert';
import { parseCommaSeparatedListOfComponentValues, isFunctionNode, isTokenNode } from '@csstools/css-parser-algorithms';

const onParseError = (err) => {
	throw err;
};

{
	const tokens = tokenize({ css: '(image-set( url("image1.jpg") calc(2 * 1x)), 50px)' }, { onParseError: onParseError });
	const list = parseCommaSeparatedListOfComponentValues(tokens, { onParseError: onParseError });
	list.forEach((listItem) => {
		listItem.forEach((componentValue) => {
			componentValue.walk((entry) => {
				assert.equal(entry.state, undefined);
			});
		});
	});
}

{
	const tokens = tokenize({ css: '(image-set( url("image1.jpg") calc(2 * 1x)), 50px, [bar], { some })' }, { onParseError: onParseError });
	const list = parseCommaSeparatedListOfComponentValues(tokens, { onParseError: onParseError });
	list.forEach((listItem) => {
		listItem.forEach((componentValue) => {
			componentValue.walk((entry) => {
				assert.equal(entry.state.foo, 1);
			}, { foo: 1 });
		});
	});
}

{
	const tokens = tokenize({ css: '(image-set( url("image1.jpg") calc(2 * 1x)), 50px)' }, { onParseError: onParseError });
	const list = parseCommaSeparatedListOfComponentValues(tokens, { onParseError: onParseError });
	list.forEach((listItem) => {
		listItem.forEach((componentValue) => {
			componentValue.walk((entry) => {
				if (isFunctionNode(entry.node) && entry.node.getName() === 'image-set') {
					entry.state.inImageSet = true;
					return;
				}

				if (isTokenNode(entry.node) && entry.node.value[0] === TokenType.Dimension) {
					if (entry.state.inImageSet) {
						assert.equal(entry.node.value[4].unit, 'x');
					} else {
						assert.equal(entry.node.value[4].unit, 'px');
					}
				}
			}, { inImageSet: false });
		});
	});
}

{
	const tokens = tokenize({ css: '(50px, image-set( url("image1.jpg") calc(2 * 1x)))' }, { onParseError: onParseError });
	const list = parseCommaSeparatedListOfComponentValues(tokens, { onParseError: onParseError });
	list.forEach((listItem) => {
		listItem.forEach((componentValue) => {
			componentValue.walk((entry) => {
				if (isFunctionNode(entry.node) && entry.node.getName() === 'image-set') {
					entry.state.inImageSet = true;
					return;
				}

				if (isTokenNode(entry.node) && entry.node.value[0] === TokenType.Dimension) {
					if (entry.state.inImageSet) {
						assert.equal(entry.node.value[4].unit, 'x');
					} else {
						assert.equal(entry.node.value[4].unit, 'px');
					}
				}
			}, { inImageSet: false });
		});
	});
}

{
	const tokens = tokenize({ css: '(50px, image-set( url("image1.jpg") calc(2 * 1x)), 50px, image-set( url("image1.jpg") 5x))' }, { onParseError: onParseError });
	const list = parseCommaSeparatedListOfComponentValues(tokens, { onParseError: onParseError });
	list.forEach((listItem) => {
		listItem.forEach((componentValue) => {
			componentValue.walk((entry) => {
				if (isFunctionNode(entry.node) && entry.node.getName() === 'image-set') {
					entry.state.inImageSet = true;
					return;
				}

				if (isTokenNode(entry.node) && entry.node.value[0] === TokenType.Dimension) {
					if (entry.state.inImageSet) {
						assert.equal(entry.node.value[4].unit, 'x');
					} else {
						assert.equal(entry.node.value[4].unit, 'px');
					}
				}
			}, { inImageSet: false });
		});
	});
}
