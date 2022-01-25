/**
 * Specification: https://www.w3.org/TR/css-display-3/#the-display-properties
 */
export default new Map([
	['block,flow', 'block'],
	['block,flow-root', 'flow-root'],
	['inline,flow', 'inline'],
	['inline,flow-root', 'inline-block'],
	['run-in,flow', 'run-in'],
	['list-item,block,flow', 'list-item'],
	['inline,flow,list-item', 'inline list-item'],
	['block,flex', 'flex'],
	['inline,flex', 'inline-flex'],
	['block,grid', 'grid'],
	['inline,grid', 'inline-grid'],
	['inline,ruby', 'ruby'],
	['block,table', 'table'],
	['inline,table', 'inline-table'],
	['table-cell,flow', 'table-cell'],
	['table-caption,flow', 'table-caption'],
	['ruby-base,flow', 'ruby-base'],
	['ruby-text,flow', 'ruby-text'],
]);
