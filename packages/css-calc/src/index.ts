import { tokenizer } from '@csstools/css-tokenizer';
import { FunctionNode, isCommentNode, isFunctionNode, isWhitespaceNode, parseComponentValue } from '@csstools/css-parser-algorithms';

export function convert(css: string, callback) {
	const t = tokenizer({
		css: css,
	});

	const tokens = [];

	{
		while (!t.endOfFile()) {
			tokens.push(t.nextToken());
		}

		tokens.push(t.nextToken()); // EOF-token
	}

	const options = {
		onParseError: ((err) => {
			throw err;
		}),
	};

	const result = parseComponentValue(tokens, options);
	if (!('walk' in result)) {
		return;
	}

	if (isFunctionNode(result) && result.getName().toLowerCase() === 'calc') {
		calcHandler(result);
	}

	result.walk((entry) => {
		const node = entry.node;
		if (!isFunctionNode(node) || node.getName().toLowerCase() !== 'calc') {
			return;
		}
	});
}

function calcHandler(calcNode: FunctionNode) {
	console.log(calcNode);

	for (let i = 0; i < calcNode.value.length; i++) {
		const child = calcNode.value[i];
		if (isWhitespaceNode(child) || isCommentNode(child)) {
			continue;
		}



		// todo math constants

		// nested expressions

		// * and /

		// + and -
	}
}

// 2 + 3 * 4
//
//     +
//    / \
//   2   *
//      / \
//     3   4
