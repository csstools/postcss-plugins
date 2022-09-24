export interface Position {
	/**
	 * Source offset in file. It starts from 0.
	 */
	offset: number

	/**
	 * Source line in file. In contrast to `offset` it starts from 1.
	 */
	column: number

	/**
	 * Source column in file.
	 */
	line: number
}
