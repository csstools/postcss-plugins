import { parse } from '@csstools/media-query-list-parser';

parse('(/* a comment */foo  ) something else');

parse('((min-width: 300px) and (prefers-color-scheme:/* a comment */dark))').forEach((mediaQuery) => {
	mediaQuery.forEach((args) => {
		args.walk((a) => {
			console.log(a.node.type);
			console.log(a.node.toString());
		});
	});
});
