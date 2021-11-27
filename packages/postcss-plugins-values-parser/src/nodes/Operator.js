/*
Copyright © 2018 Andrew Powell

This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of this Source Code Form.
*/
import { Node } from './Node';

const operators = ['+', '-', '/', '*', '%', '=', '<=', '>=', '<', '>'];
const operRegex = new RegExp('([/|*}])');

export class Operator extends Node {
	constructor(options) {
		super(options);
		this.type = 'operator';
	}

	static get chars() {
		return operators;
	}

	static fromTokens(tokens, parser) {
		parser.fromFirst(tokens, Operator);
	}

	static get regex() {
		return operRegex;
	}

	static tokenize(tokens, parser) {
		const [first, ...rest] = tokens;
		const [, value, startLine, , endLine, endChar] = first;
		const parts = value.split(operRegex).filter((t) => !!t);
		let [, , , startChar] = first;

		const newTokens = parts.map((part) => {
			const newToken = ['word', part, startLine, startChar, endLine, endChar];

			startChar += part.length;

			return newToken;
		});

		parser.back(newTokens.concat(rest));
	}
}

