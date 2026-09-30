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
// depth was proportional to the longest chain of aliases. A token file with a
// long chain of aliases could exhaust the call stack.
// This uses an explicit stack so that the depth is bounded by the input size
// and errors stay controlled.
export function toposort(nodes: Array<string>, edges: Array<Array<string>>): Array<string> {
	let cursor = nodes.length;
	const sorted: Array<string> = new Array(cursor) as Array<string>;
	const visited: Set<number> = new Set();
	// Better data structures make algorithm much faster.
	const outgoingEdges = makeOutgoingEdges(edges);
	const nodesHash = makeNodesHash(nodes);

	// check for unknown nodes
	edges.forEach(function (edge) {
		if (!nodesHash.has(edge[0]) || !nodesHash.has(edge[1])) {
			throw new Error('Unknown token. Make sure to provide all tokens used in aliases.');
		}
	});

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
						nodeRep = ', token was: ' + JSON.stringify(child);
					} catch {
						nodeRep = '';
					}
					throw new Error('Cyclic dependency' + nodeRep);
				}

				const childIndex = nodesHash.get(child);
				if (typeof childIndex === 'undefined') {
					throw new Error('Found unknown token. Make sure to provided all involved tokens. Unknown token: ' + JSON.stringify(child));
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
