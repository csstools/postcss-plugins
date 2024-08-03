import type { DirectionConfig} from '../lib/types';
import { DirectionValues } from '../lib/types';

export function logicalToPhysical(logical: string, config: DirectionConfig): string {
	const [blockStart, blockEnd] = config.block;
	const [inlineStart, inlineEnd] = config.inline;

	switch (logical) {
		case DirectionValues.BlockStart:
			return blockStart;

		case DirectionValues.BlockEnd:
			return blockEnd;

		case DirectionValues.InlineStart:
			return inlineStart;

		case DirectionValues.InlineEnd:
			return inlineEnd;
		default:
			throw new Error('Unsupported logical direction');
	}
}
