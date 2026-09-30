// Toposort - Topological sorting for node.js
// Copyright (c) 2012 by Marcel Klehr <mklehr@gmx.net>
// MIT LICENSE
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// Find all nodes that are part of a cyclic reference and remove them from `nodes`.
//
// This uses a single pass of Tarjan's strongly connected components algorithm.
// Any component with more than one node, and any node with a self reference,
// is part of a cycle. This is O(V + E) instead of the previous brute force
// approach which removed one node at a time and re-ran a full traversal,
// making it O(V * (V + E)).
export function removeCyclicReferences(nodes: Map<string, unknown>, edges: Array<Array<string>>): Set<string> {
	const cyclicReferences: Set<string> = new Set();
	const nodeSet = new Set(nodes.keys());

	const outgoing = new Map<string, Array<string>>();
	for (const node of nodeSet) {
		outgoing.set(node, []);
	}

	for (const edge of edges) {
		const from = edge[0];
		const to = edge[1];

		if (!nodeSet.has(from) || !nodeSet.has(to)) {
			continue;
		}

		if (from === to) {
			cyclicReferences.add(from);
			continue;
		}

		const list = outgoing.get(from);
		if (list) {
			list.push(to);
		}
	}

	const indexes = new Map<string, number>();
	const lowLinks = new Map<string, number>();
	const onStack = new Set<string>();
	const stack: Array<string> = [];
	let counter = 0;

	const getIndex = (node: string): number => indexes.get(node) ?? 0;
	const getLowLink = (node: string): number => lowLinks.get(node) ?? 0;

	for (const root of nodeSet) {
		if (indexes.has(root)) {
			continue;
		}

		const work: Array<{ node: string, childIndex: number }> = [{ node: root, childIndex: 0 }];

		indexes.set(root, counter);
		lowLinks.set(root, counter);
		counter++;
		stack.push(root);
		onStack.add(root);

		while (work.length) {
			const frame = work[work.length - 1];
			const children = outgoing.get(frame.node) ?? [];

			if (frame.childIndex < children.length) {
				const child = children[frame.childIndex];
				frame.childIndex++;

				if (!indexes.has(child)) {
					indexes.set(child, counter);
					lowLinks.set(child, counter);
					counter++;
					stack.push(child);
					onStack.add(child);
					work.push({ node: child, childIndex: 0 });
				} else if (onStack.has(child)) {
					lowLinks.set(frame.node, Math.min(getLowLink(frame.node), getIndex(child)));
				}

				continue;
			}

			work.pop();

			const parentFrame = work[work.length - 1];
			if (parentFrame) {
				lowLinks.set(parentFrame.node, Math.min(getLowLink(parentFrame.node), getLowLink(frame.node)));
			}

			if (getLowLink(frame.node) === getIndex(frame.node)) {
				const component: Array<string> = [];
				let current: string | undefined;

				do {
					current = stack.pop();
					if (current === undefined) {
						break;
					}

					onStack.delete(current);
					component.push(current);
				} while (current !== frame.node);

				if (component.length > 1) {
					for (const node of component) {
						cyclicReferences.add(node);
					}
				}
			}
		}
	}

	for (const cyclicReference of cyclicReferences) {
		nodes.delete(cyclicReference);
	}

	return cyclicReferences;
}
