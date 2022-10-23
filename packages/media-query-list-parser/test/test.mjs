import { parse } from '@csstools/media-query-list-parser';

parse('(/* a comment */foo  ) something else');

parse('not screen and (min-width: 300px) and (prefers-color-scheme:/* a comment */dark) and (width < 40vw) and (30px < width < 50rem)').forEach((mediaQuery) => {
	console.log(JSON.stringify(mediaQuery, null, '\t'));

	if (!('walk' in mediaQuery)) {
		return;
	}

	// mediaQuery.walk((a) => {
	// 	console.log(a.node.type, a.parent.type);
	// 	console.log(a.node.toString());
	// });
});

parse('(resolution < infinite) and (infinite <= resolution) ').forEach((mediaQuery) => {
	console.log(JSON.stringify(mediaQuery, null, '\t'));

	if (!('walk' in mediaQuery)) {
		return;
	}

	// mediaQuery.walk((a) => {
	// 	console.log(a.node.type, a.parent.type);
	// 	console.log(a.node.toString());
	// });
});

parse('(width < calc(50vw - 3rem))').forEach((mediaQuery) => {
	console.log(JSON.stringify(mediaQuery, null, '\t'));

	if (!('walk' in mediaQuery)) {
		return;
	}

	// mediaQuery.walk((a) => {
	// 	console.log(a.node.type, a.parent.type);
	// 	console.log(a.node.toString());
	// });
});

parse('screen and not (min-width: 300px)').forEach((mediaQuery) => {
	console.log(JSON.stringify(mediaQuery, null, '\t'));

	if (!('walk' in mediaQuery)) {
		return;
	}

	// mediaQuery.walk((a) => {
	// 	console.log(a.node.type, a.parent.type);
	// 	console.log(a.node.toString());
	// });
});

parse('only screen ').forEach((mediaQuery) => {
	console.log(JSON.stringify(mediaQuery, null, '\t'));

	if (!('walk' in mediaQuery)) {
		return;
	}

	// mediaQuery.walk((a) => {
	// 	console.log(a.node.type, a.parent.type);
	// 	console.log(a.node.toString());
	// });
});
