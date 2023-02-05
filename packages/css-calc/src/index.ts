import { tokenizer, TokenType } from '@csstools/css-tokenizer';
import { FunctionNode, isCommentNode, isFunctionNode, isWhitespaceNode, parseComponentValue, TokenNode } from '@csstools/css-parser-algorithms';

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

		console.log(node);
	});
}

function calcHandler(calcNode: FunctionNode) {
	console.log(calcNode);

	for (let i = 0; i < calcNode.value.length; i++) {
		const child = calcNode.value[i];
		if (isWhitespaceNode(child) || isCommentNode(child)) {
			continue;
		}

		// nested expressions

		// * and /

		// + and -
	}
}

function sum(a: TokenNode, b: TokenNode) {
	if (a.value[0] === TokenType.Percentage && b.value[0] === TokenType.Percentage) {
		const aToken = a.value;
		const bToken = b.value;
		const sumResult = a.value[4].value + b.value[4].value;

		return new TokenNode([TokenType.Percentage, sumResult.toString() + '%', aToken[2], bToken[3], {
			value: sumResult,
		}]);
	}
}
