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

// We (ab)use `toposort` to find cyclic references.
// At the moment this is not optimized and uses a brute force approach.
//
// while there are cyclic ref errors
// - remove node from graph
// - re-do toposort
export function removeCyclicReferences(nodes: Map<string, unknown>, edges: Array<Array<string>>): Set<string> {
	const cyclicReferences: Set<string> = new Set();

	while (nodes.size > 0) {
		const cyclicNode = findCyclicNode(Array.from(nodes.keys()), edges);
		if (!cyclicNode) {
			return cyclicReferences;
		}

		nodes.delete(cyclicNode);
		cyclicReferences.add(cyclicNode);
		edges = edges.filter((x) => {
			return x.indexOf(cyclicNode) === -1;
		});
	}

	return cyclicReferences;
}

function findCyclicNode(nodes: Array<string>, edges: Array<Array<string>>): string | undefined {
	let cursor = nodes.length;
	const sorted: Array<string> = new Array(cursor);
	const visited: Record<number, boolean> = {};
	let i = cursor;
	// Better data structures make algorithm much faster.
	const outgoingEdges = makeOutgoingEdges(edges);
	const nodesHash = makeNodesHash(nodes);

	while (i--) {
		if (!visited[i]) {
			const cyclicNode = visit(nodes[i], i, new Set());
			if (!cyclicNode) {
				continue;
			}

			return cyclicNode;
		}
	}

	function visit(node: string, j: number, predecessors: Set<string>): string | undefined {
		if (predecessors.has(node)) {
			return node;
		}

		if (!nodesHash.has(node)) {
			return;
		}

		if (visited[j]) {
			return;
		}

		visited[j] = true;

		const outgoing: Array<string> = Array.from(outgoingEdges.get(node) || new Set());

		// eslint-disable-next-line no-cond-assign
		if (j = outgoing.length) {
			predecessors.add(node);
			do {
				const child = outgoing[--j];
				const cyclicNode = visit(child, nodesHash.get(child)!, predecessors);
				if (!cyclicNode) {
					continue;
				}

				return cyclicNode;
			} while (j);
			predecessors.delete(node);
		}

		sorted[--cursor] = node;
	}
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
		edges.get(edge[0])!.add(edge[1]);
	}
	return edges;
}

function makeNodesHash(arr: Array<string>): Map<string, number> {
	const res = new Map();
	for (let i = 0, len = arr.length; i < len; i++) {
		res.set(arr[i], i);
	}
	return res;
}
