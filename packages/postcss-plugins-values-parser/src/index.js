/*
Copyright © 2018 Andrew Powell

This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of this Source Code Form.
*/
import { Input } from 'postcss';

import { ValuesParser } from './ValuesParser';
import { ValuesStringifier } from './ValuesStringifier';

// export { Node } from './nodes/Node';
// export { Numeric } from './nodes/Numeric';
export { Punctuation } from './nodes/Punctuation';

export function parse(css, options) {
	const input = new Input(css, options);
	const parser = new ValuesParser(input, parse, options);

	parser.parse();

	const { root } = parser;
	const ogToString = root.toString;

	function toString() {
		return ogToString.bind(root)(ValuesStringifier.stringify);
	}

	root.toString = toString.bind(root);

	return parser.root;
}

export function nodeToString(node) {
	let result = '';

	module.exports.stringify(node, (bit) => {
		result += bit;
	});

	return result;
}
