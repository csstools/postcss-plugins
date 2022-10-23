import { parse } from '@csstools/media-query-list-parser';

parse('(/* a comment */foo  ) something else');

parse('not screen and (min-width: 300px) and (prefers-color-scheme:/* a comment */dark) and (width < 40vw) and (30px < width < 50rem)').forEach((mediaQuery) => {
	mediaQuery.forEach((args) => {
		if (!('walk' in args)) {
			console.log(args);
			return;
		}

		args.walk((a) => {
			console.log(a.node.type, a.parent.type);
			console.log(a.node.toString());
		});
	});
});

parse('(resolution < infinite) and (infinite < resolution)').forEach((mediaQuery) => {
	mediaQuery.forEach((args) => {
		if (!('walk' in args)) {
			console.log(args);
			return;
		}

		args.walk((a) => {
			console.log(a.node.type, a.parent.type);
			console.log(a.node.toString());
		});
	});
});
