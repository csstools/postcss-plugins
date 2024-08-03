import type { Declaration, Postcss } from 'postcss';
import type { Node } from 'postcss-value-parser';
import valueParser from 'postcss-value-parser';
import { cloneDeclaration } from './clone-declaration';
import type { TransformFunction } from './types';

export function transformTransition(declaration: Declaration, postcss: Postcss, transforms: Record<string, TransformFunction|null>): Array<Declaration> {
	const { prop, value } = declaration;
	const valueAST = valueParser(value);

	const chunks: Array<Array<Node>> = [];
	let currentChunk: Array<Node> = [];

	{
		valueAST.nodes.forEach((node) => {
			if (node.type === 'div' && node.value === ',') {
				chunks.push(currentChunk);
				currentChunk = [];
				return;
			}

			currentChunk.push(node);
		});

		chunks.push(currentChunk);
	}

	for (let i = 0; i < chunks.length; i++) {
		const chunk = chunks[i];

		for (let j = 0; j < chunk.length; j++) {
			const node = chunk[j];
			if (node.type !== 'word') {
				continue;
			}

			const propertyName = node.value.toLowerCase();
			const transform = transforms[propertyName];
			if (!transform) {
				continue;
			}

			const transformedDeclarations = transform(postcss.decl({prop: propertyName, value: 'initial'}));
			if (transformedDeclarations.length === 0) {
				continue;
			}

			for (let k = transformedDeclarations.length - 1; k >= 0; k--) {
				const clone: Array<Node> = JSON.parse(JSON.stringify(chunk)) as Array<Node>;
				const clonedNode = clone[j];

				clonedNode.value = transformedDeclarations[k].prop;

				chunks.splice(i + 1, 0, clone);
			}

			chunks.splice(i, 1);
			i++;
			continue;
		}
	}

	const modifiedChunks: Array<Node> = [];
	for (let i = 0; i < chunks.length; i++) {
		const chunk = chunks[i];

		modifiedChunks.push(...chunk);
		if (i !== chunks.length - 1) {
			modifiedChunks.push({ type: 'div', value: ',', sourceIndex: 0, sourceEndIndex: 0, before: '', after: ' ' });
		}
	}

	const modifiedValued = valueParser.stringify(modifiedChunks);
	if (modifiedValued !== value) {
		return cloneDeclaration(declaration, modifiedValued, prop);
	}

	return [];
}
