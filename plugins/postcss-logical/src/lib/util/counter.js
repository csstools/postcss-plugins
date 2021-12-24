import crypto from 'crypto';

let counter = 0;

export function resetCounter() {
	counter = 0;
}

export function getCounter() {
	counter++;
	return counter;
}

export function varId(node) {
	let parent = node.parent;

	while (parent && parent.type !== 'root') {
		parent = parent.parent;
	}

	const hash = crypto.createHash('md5').update(parent.toString()).digest('hex');
	return `${hash.slice(0, 6)}-${getCounter()}`;
}
