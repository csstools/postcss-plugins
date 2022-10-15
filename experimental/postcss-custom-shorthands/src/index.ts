import type { PluginCreator } from 'postcss';
import pluginVersion1 from './0001/index';
import pluginVersion2 from './0002/index';

type pluginOptions = {
	experimentalVersion?: 1 | 2,
	atRuleName?: string,
	generateVSCodeCustomDataInDirectory?: string,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({
		experimentalVersion: 2, /* latest is the default */
	}, opts);

	if (options.experimentalVersion === 1) {
		return pluginVersion1(opts);
	}

	return pluginVersion2(opts);
};

creator.postcss = true;

export default creator;

