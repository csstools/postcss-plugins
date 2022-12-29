import type { Declaration } from 'postcss';
import valueParser from 'postcss-value-parser';
import { DirectionConfig, DirectionValues, Direction } from './types';
import { logicalToPhysical } from '../utils/logical-to-physical';

export function transformValue(
	config: DirectionConfig,
): (declaration: Declaration) => boolean {
	return (declaration: Declaration) => {
		const { prop, value } = declaration;
		const valueAST = valueParser(value);

		const directionValues = Object.values(DirectionValues);
		valueAST.nodes.forEach((node) => {
			const valueCandidate = node.value.toLowerCase();
			if (node.type === 'word' && directionValues.includes(valueCandidate)) {
				node.value = logicalToPhysical(valueCandidate, config);
			}

			return node;
		});

		if (valueAST.toString() !== value) {
			declaration.cloneBefore({
				prop,
				value: valueAST.toString(),
			});
			return true;
		}

		return false;
	};
}

export function transformValueWithSingleDirection(
	direction: Direction,
	config: DirectionConfig,
): (declaration: Declaration) => boolean {
	return (declaration: Declaration) => {
		const { prop, value } = declaration;
		const valueAST = valueParser(value);
		let directionValues = [];

		if (direction === Direction.Block) {
			directionValues = [DirectionValues.BlockStart, DirectionValues.BlockEnd];
		} else {
			directionValues = [DirectionValues.InlineStart, DirectionValues.InlineEnd];
		}

		valueAST.nodes.forEach((node) => {
			const valueCandidate = node.value.toLowerCase();
			if (node.type === 'word' && directionValues.includes(valueCandidate)) {
				node.value = logicalToPhysical(valueCandidate, config);
			}

			return node;
		});

		if (valueAST.toString() !== value) {
			declaration.cloneBefore({
				prop,
				value: valueAST.toString(),
			});
			return true;
		}

		return false;
	};
}
