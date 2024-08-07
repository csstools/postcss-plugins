import plugin from 'postcss-attribute-case-insensitive';
import { cli, helpTextLogger } from '@csstools/base-cli';

export default async function postcssAttributeCaseInsensitive(): Promise<void> {
	await cli(
		plugin,
		[],
		helpTextLogger(
			'@csstools/cli postcss-attribute-case-insensitive',
			'PostCSS Attribute Case Insensitive',
			'Enables support for Case Insensitive Attribute matching in selectors',
		),
		false,
	);
}
