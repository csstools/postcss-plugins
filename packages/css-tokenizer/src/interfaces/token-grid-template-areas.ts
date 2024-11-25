/**
 * All possible CSS token types for grid template areas
 *
 * @see {@link https://drafts.csswg.org/css-grid/#valdef-grid-template-areas-string}
 */
export enum TokenTypeGridTemplateAreas {
	NamedCell = 'named-cell-token',
	NullCell = 'null-cell-token',
	Trash = 'trash-token',
}

export interface GridTemplateAreasTokenNamedCell {
	type: TokenTypeGridTemplateAreas.NamedCell
	/**
	 * The name of the cell
	 */
	value: string
}

export interface GridTemplateAreasTokenNullCell {
	type: TokenTypeGridTemplateAreas.NullCell
	/**
	 * The dots representing the null cell
	 */
	value: string
}

export interface GridTemplateAreasTokenTrash {
	type: TokenTypeGridTemplateAreas.Trash
	/**
	 * The incorrect cell value
	 */
	value: string
}
