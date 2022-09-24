import type { Position } from './position';

export interface Source {
	/**
	 * The file source of the node.
	 */
	input: {
		from: string
	}
	/**
	 * The inclusive starting position of the node’s source.
	 */
	start?: Position
	/**
	 * The inclusive ending position of the node's source.
	 */
	end?: Position
}
