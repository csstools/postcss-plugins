import type { Position } from './position';

export interface Range {
	/**
	 * Start position, inclusive.
	 */
	start: Position

	/**
	 * End position, exclusive.
	 */
	end: Position
}
