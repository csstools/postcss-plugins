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

	// eslint-disable-next-line no-constant-condition
	let _edges = edges;
	while (nodes.size > 0) {
		try {
			toposort(Array.from(nodes.keys()), _edges);
			break;
		} catch (e) {
			/* see the hack below */
			if (e['_graphNode']) {

				nodes.delete(e['_graphNode']);
				cyclicReferences.add(e['_graphNode']);
				_edges = _edges.filter((x) => {
					return x.indexOf(e['_graphNode']) === -1;
				});
			} else {
				throw e;
			}
		}
	}

	return cyclicReferences;
}

function toposort(nodes: Array<string>, edges: Array<Array<string>>): Array<string> {
	let cursor = nodes.length;
	const sorted: Array<string> = new Array(cursor);
	const visited: Record<number, boolean> = {};
	let i = cursor;
	// Better data structures make algorithm much faster.
	const outgoingEdges = makeOutgoingEdges(edges);
	const nodesHash = makeNodesHash(nodes);

	while (i--) {
		if (!visited[i]) {
			visit(nodes[i], i, new Set());
		}
	}

	return sorted;

	function visit(node: string, j: number, predecessors: Set<string>) {
		if (predecessors.has(node)) {
			const err = new Error('Cyclic dependency' + JSON.stringify(node));
			// @ts-expect-error custom field on object
			err['_graphNode'] = node; /* a hack to communicate which node is causing the cyclic error */

			throw err;
		}

		if (!nodesHash.has(node)) {
			return;
		}

		if (visited[j]) {
			return;
		}
		visited[j] = true;

		let outgoing = outgoingEdges.get(node) || new Set();
		outgoing = Array.from(outgoing);

		// eslint-disable-next-line no-cond-assign
		if (j = outgoing.length) {
			predecessors.add(node);
			do {
				const child = outgoing[--j];
				visit(child, nodesHash.get(child), predecessors);
			} while (j);
			predecessors.delete(node);
		}

		sorted[--cursor] = node;
	}
}

function makeOutgoingEdges(arr: Array<Array<string>>) {
	const edges = new Map();
	for (let i = 0, len = arr.length; i < len; i++) {
		const edge = arr[i];
		if (!edges.has(edge[0])) {
			edges.set(edge[0], new Set());
		}
		if (!edges.has(edge[1])) {
			edges.set(edge[1], new Set());
		}
		edges.get(edge[0]).add(edge[1]);
	}
	return edges;
}

function makeNodesHash(arr: Array<string>) {
	const res = new Map();
	for (let i = 0, len = arr.length; i < len; i++) {
		res.set(arr[i], i);
	}
	return res;
}
