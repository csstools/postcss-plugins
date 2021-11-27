/*
Copyright © 2018 Andrew Powell

This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of this Source Code Form.
*/

function unquote (s) {
	var quote = s[0];
	var single = quote === '\'';

	return s.substring(1, s.length - 1)
		.replace(/\\\\/g, '\\')
		.replace(single ? /\\'/g : /\\"/g, quote);
}

import { Node } from './Node';

export class Quoted extends Node {
	constructor(options) {
		super(options);
		this.type = 'quoted';
		this.contents = unquote(options.value);
		[this.quote] = options.value;
	}

	static fromTokens(tokens, parser) {
		parser.fromFirst(tokens, Quoted);
	}
}
