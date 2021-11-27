/*
Copyright © 2018 Andrew Powell

This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of this Source Code Form.
*/
import { Node } from './Node';

function isUrl(string) {
	string = string.trim();
	if (string.includes(' ')) {
		return false;
	}

	try {
		new URL(string);
		return true;
	} catch {
		return false;
	}
}

const escapeRegex = /^\\(.+)/;
const hexRegex = /^#(.+)/;
const colorRegex = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const colorNames = [
	'aliceblue',
	'antiquewhite',
	'aqua',
	'aquamarine',
	'azure',
	'beige',
	'bisque',
	'black',
	'blanchedalmond',
	'blue',
	'blueviolet',
	'brown',
	'burlywood',
	'cadetblue',
	'chartreuse',
	'chocolate',
	'coral',
	'cornflowerblue',
	'cornsilk',
	'crimson',
	'cyan',
	'darkblue',
	'darkcyan',
	'darkgoldenrod',
	'darkgray',
	'darkgreen',
	'darkgrey',
	'darkkhaki',
	'darkmagenta',
	'darkolivegreen',
	'darkorange',
	'darkorchid',
	'darkred',
	'darksalmon',
	'darkseagreen',
	'darkslateblue',
	'darkslategray',
	'darkslategrey',
	'darkturquoise',
	'darkviolet',
	'deeppink',
	'deepskyblue',
	'dimgray',
	'dimgrey',
	'dodgerblue',
	'firebrick',
	'floralwhite',
	'forestgreen',
	'fuchsia',
	'gainsboro',
	'ghostwhite',
	'gold',
	'goldenrod',
	'gray',
	'green',
	'greenyellow',
	'grey',
	'honeydew',
	'hotpink',
	'indianred',
	'indigo',
	'ivory',
	'khaki',
	'lavender',
	'lavenderblush',
	'lawngreen',
	'lemonchiffon',
	'lightblue',
	'lightcoral',
	'lightcyan',
	'lightgoldenrodyellow',
	'lightgray',
	'lightgreen',
	'lightgrey',
	'lightpink',
	'lightsalmon',
	'lightseagreen',
	'lightskyblue',
	'lightslategray',
	'lightslategrey',
	'lightsteelblue',
	'lightyellow',
	'lime',
	'limegreen',
	'linen',
	'magenta',
	'maroon',
	'mediumaquamarine',
	'mediumblue',
	'mediumorchid',
	'mediumpurple',
	'mediumseagreen',
	'mediumslateblue',
	'mediumspringgreen',
	'mediumturquoise',
	'mediumvioletred',
	'midnightblue',
	'mintcream',
	'mistyrose',
	'moccasin',
	'navajowhite',
	'navy',
	'oldlace',
	'olive',
	'olivedrab',
	'orange',
	'orangered',
	'orchid',
	'palegoldenrod',
	'palegreen',
	'paleturquoise',
	'palevioletred',
	'papayawhip',
	'peachpuff',
	'peru',
	'pink',
	'plum',
	'powderblue',
	'purple',
	'rebeccapurple',
	'red',
	'rosybrown',
	'royalblue',
	'saddlebrown',
	'salmon',
	'sandybrown',
	'seagreen',
	'seashell',
	'sienna',
	'silver',
	'skyblue',
	'slateblue',
	'slategray',
	'slategrey',
	'snow',
	'springgreen',
	'steelblue',
	'tan',
	'teal',
	'thistle',
	'tomato',
	'turquoise',
	'violet',
	'wheat',
	'white',
	'whitesmoke',
	'yellow',
	'yellowgreen',
];

export class Word extends Node {
	constructor(options) {
		super(options);
		this.type = 'word';
		this.isColor = false;
		this.isHex = false;
		this.isUrl = false;
		this.isVariable = false;
	}

	static fromTokens(tokens, parser) {
		parser.fromFirst(tokens, Word);

		const { lastNode } = parser;
		const { value } = lastNode;
		lastNode.isColor = colorRegex.test(value) || colorNames.includes(value.toLowerCase());
		lastNode.isHex = hexRegex.test(value);
		lastNode.isUrl = value.startsWith('//') ? isUrl(`http:${value}`) : isUrl(value);
		lastNode.isVariable = Word.testVariable(tokens[0], parser);
	}

	static testEscaped(tokens) {
		const [first, next] = tokens;
		const [type, value] = first;

		return (
			type === 'word' &&
			(escapeRegex.test(value) || (value === '\\' && next && !/^\s+$/.test(next[1])))
		);
	}

	static testHex(token) {
		const [type, value] = token;

		return type === 'word' && hexRegex.test(value);
	}

	static testVariable(token, parser) {
		const [type, value] = token;
		const { prefixes } = parser.options.variables;
		const varRegex = new RegExp(`^(${prefixes.join('|')})`);

		return type === 'word' && varRegex.test(value);
	}

	static testWord(tokens, parser) {
		const [token] = tokens;

		return Word.testEscaped(tokens) || Word.testHex(token) || Word.testVariable(token, parser);
	}
}
