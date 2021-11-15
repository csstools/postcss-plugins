import plugin from '../mod.js';
import postcss from 'https://deno.land/x/postcss@8.3.11/mod.js'
import { assertStrictEquals } from 'https://deno.land/std@0.110.0/testing/asserts.ts';

postcss([plugin]).process(`
a [foo="&"] {
	color : red;

	&.baz {
		color : blue;
	}
}
`, { from: 'raw', to: 'raw' }).then(result => {
	assertStrictEquals(result.css, `
a [foo="&"] {
	color : red
}
a [foo="&"].baz {
		color : blue;
	}
`);
});
