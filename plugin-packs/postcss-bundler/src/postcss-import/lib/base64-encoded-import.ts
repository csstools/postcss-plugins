import { Condition } from './conditions';
import { formatImportPrelude } from './format-import-prelude';

export function base64EncodedConditionalImport(prelude: string, conditions: Array<Condition>): string {
	conditions.reverse();
	const first = conditions.pop()!;
	let params = `${prelude} ${formatImportPrelude(
		first.layer,
		first.media,
		first.supports,
	)}`;

	for (const condition of conditions) {
		params = `'data:text/css;base64,${Buffer.from(
			`@import ${params}`,
		).toString('base64')}' ${formatImportPrelude(
			condition.layer,
			condition.media,
			condition.supports,
		)}`;
	}

	return params;
}
