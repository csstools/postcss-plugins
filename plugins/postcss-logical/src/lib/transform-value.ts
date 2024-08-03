import type { Declaration } from 'postcss';
import valueParser from 'postcss-value-parser';
import type { DirectionConfig} from './types';
import { DirectionValues } from './types';
import { logicalToPhysical } from '../utils/logical-to-physical';
import { cloneDeclaration } from './clone-declaration';

function doTransform(declaration: Declaration, directionValues: Array<string>, config: DirectionConfig): Array<Declaration> {
	const { prop, value } = declaration;
	const valueAST = valueParser(value);

	valueAST.nodes.forEach((node) => {
		if (node.type === 'word') {
			const valueCandidate = node.value.toLowerCase();
			if (directionValues.includes(valueCandidate)) {
				node.value = logicalToPhysical(valueCandidate, config);
			}
		}
	});

	const modifiedValued = valueAST.toString();
	if (modifiedValued !== value) {
		return cloneDeclaration(declaration, modifiedValued, prop);
	}

	return [];
}

export function transformValue(
	config: DirectionConfig,
): (declaration: Declaration) => Array<Declaration> {
	return (declaration: Declaration) => {
		return doTransform(declaration, Object.values(DirectionValues), config);
	};
}
