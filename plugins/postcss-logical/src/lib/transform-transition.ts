import type { Declaration } from 'postcss';
import type { Node } from 'postcss-value-parser';
import valueParser from 'postcss-value-parser';
import { DirectionConfig } from './types';
import { cloneDeclaration } from './clone-declaration';

export function transformTransition(
	directionConfig: DirectionConfig,
): (declaration: Declaration) => boolean {
	return (declaration: Declaration) => {
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
				if (node.type === 'word') {
					{
						// TODO : all the properties that have a single other property as the result.
						if (node.value.toLowerCase() === 'inline-size') {
							if (directionConfig.inlineIsHorizontal) {
								node.value = 'width';
							} else {
								node.value = 'height';
							}

							continue;
						}
					}

					{
						// TODO : all the properties that have a multiple other properties as the result.
						if (node.value.toLowerCase() === 'margin-inline') {
							const clone = JSON.parse(JSON.stringify(chunk));
							const clonedNode = clone[j];

							if (directionConfig.inlineIsHorizontal) {
								node.value = 'margin-left';
								clonedNode.value = 'margin-right';
							} else {
								node.value = 'margin-top';
								clonedNode.value = 'margin-bottom';
							}

							chunks.splice(i + 1, 0, clone);
							i++;
							continue;
						}
					}
				}
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
			cloneDeclaration(declaration, modifiedValued, prop);
			return true;
		}

		return false;
	};
}
