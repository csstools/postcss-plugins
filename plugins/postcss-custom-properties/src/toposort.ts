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

// Depth first topological sort.
// `visit` was previously implemented with recursion, so the maximum call stack
// depth was proportional to the longest dependency chain. A stylesheet with a
// long chain of custom properties could exhaust the call stack.
// This uses an explicit stack so that the depth is bounded by the input size
// and errors stay controlled.
export function toposort(nodes: Array<string>, edges: Array<Array<string>>): Array<string> {
	let cursor = nodes.length;
	const sorted: Array<string> = new Array(cursor) as Array<string>;
	const visited: Set<number> = new Set();
	// Better data structures make algorithm much faster.
	const outgoingEdges = makeOutgoingEdges(edges);
	const nodesHash = makeNodesHash(nodes);

	type Frame = {
		node: string,
		outgoing: Array<string>,
		next: number,
	};

	for (let i = nodes.length - 1; i >= 0; i--) {
		if (visited.has(i)) {
			continue;
		}

		const root = nodes[i];
		const onPath = new Set<string>();
		const stack: Array<Frame> = [];

		visited.add(i);
		onPath.add(root);
		stack.push({
			node: root,
			outgoing: Array.from(outgoingEdges.get(root) || new Set()),
			next: 0,
		});

		while (stack.length) {
			const frame = stack[stack.length - 1];

			if (frame.next < frame.outgoing.length) {
				// Children are visited in reverse order to match the insertion order of `makeOutgoingEdges`.
				const child = frame.outgoing[frame.outgoing.length - 1 - frame.next];
				frame.next++;

				if (onPath.has(child)) {
					let nodeRep;
					try {
						nodeRep = ', node was:' + JSON.stringify(child);
					} catch {
						nodeRep = '';
					}
					throw new Error('Cyclic dependency' + nodeRep);
				}

				const childIndex = nodesHash.get(child);
				if (typeof childIndex === 'undefined') {
					throw new Error('Found unknown node. Make sure to provided all involved nodes. Unknown node: ' + JSON.stringify(child));
				}

				if (visited.has(childIndex)) {
					continue;
				}

				visited.add(childIndex);
				onPath.add(child);
				stack.push({
					node: child,
					outgoing: Array.from(outgoingEdges.get(child) || new Set()),
					next: 0,
				});
				continue;
			}

			stack.pop();
			onPath.delete(frame.node);
			sorted[--cursor] = frame.node;
		}
	}

	return sorted;
}

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

function makeOutgoingEdges(arr: Array<Array<string>>): Map<string, Set<string>> {
	const edges: Map<string, Set<string>> = new Map();
	for (let i = 0, len = arr.length; i < len; i++) {
		const edge = arr[i];
		if (!edges.has(edge[0])) {
			edges.set(edge[0], new Set());
		}
		if (!edges.has(edge[1])) {
			edges.set(edge[1], new Set());
		}
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		edges.get(edge[0])!.add(edge[1]);
	}
	return edges;
}

function makeNodesHash(arr: Array<string>): Map<string, number> {
	const res: Map<string, number> = new Map();
	for (let i = 0, len = arr.length; i < len; i++) {
		res.set(arr[i], i);
	}
	return res;
}
