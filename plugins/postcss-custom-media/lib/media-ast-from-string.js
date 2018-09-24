function parse(string, splitByAnd) {
	const array = [];
	let buffer = '';
	let split = false;
	let func = 0;
	let i = -1;

	while (++i < string.length) {
		const char = string[i];

		if (char === '(') {
			func += 1;
		} else if (char === ')') {
			if (func > 0) {
				func -= 1;
			}
		} else if (func === 0) {
			if (splitByAnd && andRegExp.test(buffer + char)) {
				split = true;
			} else if (!splitByAnd && char === ',') {
				split = true;
			}
		}

		if (split) {
			array.push(splitByAnd ? new MediaExpression(buffer + char) : new MediaQuery(buffer));

			buffer = '';
			split = false;
		} else {
			buffer += char
		}
	}

	if (buffer !== '') {
		array.push(splitByAnd ? new MediaExpression(buffer) : new MediaQuery(buffer));
	}

	return array;
}

class MediaQueryList {
	constructor(string) {
		this.nodes = parse(string);
	}

	invert() {
		this.nodes.forEach(node => {
			node.invert();
		})

		return this;
	}

	clone() {
		return new MediaQueryList(String(this));
	}

	toString() {
		return this.nodes.join(',');
	}
}

class MediaQuery {
	constructor(string) {
		const [, before, media, after ] = string.match(spaceWrapRegExp);
		const [, modifier = '', afterModifier = ' ', type = '', beforeAnd = '', and = '', beforeExpression = '', expression1 = '', expression2 = ''] = media.match(mediaRegExp) || [];
		const raws = { before, after, afterModifier, originalModifier: modifier || '', beforeAnd, and, beforeExpression };
		const nodes = parse(expression1 || expression2, true);

		Object.assign(this, {
			modifier,
			type,
			raws,
			nodes
		});
	}

	clone(overrides) {
		const instance = new MediaQuery(String(this));

		Object.assign(instance, overrides);

		return instance;
	}

	invert() {
		this.modifier = this.modifier ? '' : this.raws.originalModifier;

		return this;
	}

	toString() {
		const { raws } = this;

		return `${raws.before}${this.modifier}${this.modifier ? `${raws.afterModifier}` : ''}${this.type}${raws.beforeAnd}${raws.and}${raws.beforeExpression}${this.nodes.join('')}${this.raws.after}`;
	}
}

class MediaExpression {
	constructor(string) {
		const [, value, after = '', and = '', afterAnd = '' ] = string.match(andRegExp) || [null, string];
		const raws = { after, and, afterAnd };

		Object.assign(this, { value, raws });
	}

	clone(overrides) {
		const instance = new MediaExpression(String(this));

		Object.assign(instance, overrides);

		return instance;
	}

	toString() {
		const { raws } = this;

		return `${this.value}${raws.after}${raws.and}${raws.afterAnd}`;
	}
}

const modifierRE = '(not|only)';
const typeRE = '(all|print|screen|speech)';
const noExpressionRE = '([\\W\\w]*)';
const expressionRE = '([\\W\\w]+)';
const noSpaceRE = '(\\s*)';
const spaceRE = '(\\s+)';
const andRE = '(?:(\\s+)(and))';
const andRegExp = new RegExp(`^${expressionRE}(?:${andRE}${spaceRE})$`, 'i');
const spaceWrapRegExp = new RegExp(`^${noSpaceRE}${noExpressionRE}${noSpaceRE}$`);
const mediaRegExp = new RegExp(`^(?:${modifierRE}${spaceRE})?(?:${typeRE}(?:${andRE}${spaceRE}${expressionRE})?|${expressionRE})$`, 'i');

export default string => new MediaQueryList(string);
