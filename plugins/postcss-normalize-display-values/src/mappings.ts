/**
 * Specification: https://www.w3.org/TR/css-display-3/#the-display-properties
 */
export default new Map([
	['flow', 'block'],

	['block,flow', 'block'],
	['flow,block', 'block'],

	['flow-root,block', 'flow-root'],
	['block,flow-root', 'flow-root'],

	['inline,flow', 'inline'],
	['flow,inline', 'inline'],

	['inline,flow-root', 'inline-block'],
	['flow-root,inline', 'inline-block'],

	['run-in,flow', 'run-in'],
	['flow,run-in', 'run-in'],

	['block,list-item', 'list-item'],
	['list-item,block', 'list-item'],

	['flow,list-item', 'list-item'],
	['list-item,flow', 'list-item'],

	['block,flow,list-item', 'list-item'],
	['block,list-item,flow', 'list-item'],
	['list-item,block,flow', 'list-item'],
	['list-item,flow,block', 'list-item'],
	['flow,block,list-item', 'list-item'],
	['flow,list-item,block', 'list-item'],

	['inline,flow,list-item', 'inline list-item'],
	['inline,list-item,flow', 'inline list-item'],
	['list-item,inline,flow', 'inline list-item'],
	['list-item,flow,inline', 'inline list-item'],
	['flow,inline,list-item', 'inline list-item'],
	['flow,list-item,inline', 'inline list-item'],

	['block,flex', 'flex'],
	['flex,block', 'flex'],

	['inline,flex', 'inline-flex'],
	['flex,inline', 'inline-flex'],

	['block,grid', 'grid'],
	['grid,block', 'grid'],

	['inline,grid', 'inline-grid'],
	['grid,inline', 'inline-grid'],

	['inline,ruby', 'ruby'],
	['ruby,inline', 'ruby'],

	['block,table', 'table'],
	['table,block', 'table'],

	['inline,table', 'inline-table'],
	['table,inline', 'inline-table'],
]);
