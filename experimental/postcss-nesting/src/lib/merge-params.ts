import { comma } from './list.js';

export default function mergeParams(fromParams: string, toParams: string) {
	return comma(fromParams)
		.map((params1) =>
			comma(toParams)
				.map((params2) => `${params1} and ${params2}`)
				.join(', '),
		)
		.join(', ');
}
