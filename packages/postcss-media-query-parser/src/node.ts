/* eslint-disable @typescript-eslint/no-this-alias */
import { Source } from './interfaces/source';

type NodeConstructable<T> = { constructor: new () => T };

function cloneNode<T extends Node>(obj: NodeConstructable<T>, parent?): T {
	const cloned = new obj.constructor();

	for (const i in obj) {
		if (!Object.prototype.hasOwnProperty.call(obj, i)) {
			continue;
		}

		let value = obj[i];
		const type = typeof value;

		if (i === 'parent' && type === 'object') {
			if (parent) {
				cloned[i] = parent;
			}
		} else if (i === 'source') {
			cloned[i] = value;
		} else if (Array.isArray(value)) {
			cloned[i] = value.map(j => cloneNode(j, cloned));
		} else {
			if (type === 'object' && value !== null) {
				value = cloneNode(value);
			}
			cloned[i] = value;
		}
	}

	return cloned;
}

interface ChildRemover {
	removeChild(child: Node | number): this
}

interface InsertBeforer {
	insertBefore(
		oldNode: Node | number,
		newNode: Node | Node[]
	): this
}

interface InsertAfterer {
	insertAfter(
		oldNode: Node | number,
		newNode: Node | Node[]
	): this
}

interface NodeIndexer {
	index(node: Node): number
}

interface NodeContainer {
	nodes: Array<Node>
}

interface NodeContainerChild {
	parent?: NodeContainer & NodeContainerChild
}

type ParentNode = ChildRemover & InsertBeforer & InsertAfterer & NodeContainer & NodeIndexer & NodeContainerChild;

export abstract class Node {
	source: Source;
	parent?: ParentNode;

	constructor() {
		/* noop */
	}

	remove() {
		if (this.parent) {
			this.parent.removeChild(this);
		}
		this.parent = undefined;
		return this;
	}

	toString(): string {
		return '';
	}

	clone(overrides = {}) {
		const cloned = cloneNode((this as unknown) as NodeConstructable<this>);
		for (const name in overrides) {
			cloned[name] = overrides[name];
		}
		return cloned;
	}

	cloneBefore(overrides = {}) {
		const cloned = this.clone(overrides);
		this.parent.insertBefore(this, cloned);
		return cloned;
	}

	cloneAfter(overrides = {}) {
		const cloned = this.clone(overrides);
		this.parent.insertAfter(this, cloned);
		return cloned;
	}

	replaceWith(...nodes) {
		if (this.parent) {
			let bookmark = this;
			let foundSelf = false;
			for (const node of nodes) {
				if (node === this) {
					foundSelf = true;
				} else if (foundSelf) {
					this.parent.insertAfter(bookmark, node);
					bookmark = node;
				} else {
					this.parent.insertBefore(bookmark, node);
				}
			}

			if (!foundSelf) {
				this.remove();
			}
		}

		return this;
	}

	next() {
		if (!this.parent) {
			return undefined;
		}
		const index = this.parent.index(this);
		return this.parent.nodes[index + 1];
	}

	prev() {
		if (!this.parent) {
			return undefined;
		}
		const index = this.parent.index(this);
		return this.parent.nodes[index - 1];
	}

	before(add) {
		this.parent.insertBefore(this, add);
		return this;
	}

	after(add) {
		this.parent.insertAfter(this, add);
		return this;
	}

	root(): NodeContainerChild | this {
		if (!this.parent) {
			return this;
		}

		let result: NodeContainerChild = this.parent as NodeContainerChild;

		while (result.parent) {
			result = result.parent;
		}

		return result;
	}
}
