import assert from 'assert';
import { parse } from '@csstools/media-query-list-parser';

{
	const list = parse('screen and (min-width: 320px)');
	list.forEach((mediaQuery) => {
		mediaQuery.walk((entry) => {
			assert.equal(entry.state, undefined);
		});
	});
}

{
	const list = parse('screen and (min-width: 320px)');
	list.forEach((mediaQuery) => {
		mediaQuery.walk((entry) => {
			assert.equal(entry.state.foo, 1);
		}, { foo: 1 });
	});
}

{
	const list = parse(`
		screen and
		(min-width: 320px) and
		(max-width: 640px) and
		(
			(foo) or ((bar))
		) and
		(100px < width < 200px) and
		(100px <= width <= 200px) and
		(width = 100px) and
		(width > 100px) and
		(width >= 100px) and
		(width < 100px) and
		(not (width < 100px)) and
		({ invalid })
	`);
	list.forEach((mediaQuery) => {
		mediaQuery.walk((entry) => {
			assert.equal(entry.state.foo, 1);
			assert.equal(entry.state.parent, entry.parent.constructor?.name ?? 'not constructable');
			entry.state.parent = entry.node.constructor.name ?? 'not constructable';
		}, { foo: 1, parent: 'MediaQueryWithType' });
	});
}

{
	const list = parse(`
		(min-width: 320px) and
		(max-width: 640px) and
		(
			(foo) or ((bar))
		) and
		(100px < width < 200px) and
		(100px <= width <= 200px) and
		(width = 100px) and
		(width > 100px) and
		(width >= 100px) and
		(width < 100px) and
		(not (width < 100px)) and
		({ invalid })
	`);
	list.forEach((mediaQuery) => {
		mediaQuery.walk((entry) => {
			assert.equal(entry.state.foo, 1);
			assert.equal(entry.state.parent, entry.parent.constructor?.name ?? 'not constructable');
			entry.state.parent = entry.node.constructor.name ?? 'not constructable';
		}, { foo: 1, parent: 'MediaQueryWithoutType' });
	});
}
