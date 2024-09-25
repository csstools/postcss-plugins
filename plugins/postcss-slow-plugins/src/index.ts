import type { Plugin, PluginCreator, Transformer } from 'postcss';

/** postcss-slow-plugins plugin options */
export type pluginOptions = {
	/** Plugins to ignore when reporting the results */
	ignore?: Array<string>
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const ignore = opts?.ignore ?? [];

	return {
		postcssPlugin: 'postcss-slow-plugins',
		async Once(root, { result, postcss }): Promise<void> {
			// eslint-disable-next-line no-console
			console.log('Analyzing with file:\n  ' + root.source?.input.from + '\n');

			const inputCSS = root.source?.input.css ?? '';

			const plugins = [
				...result.processor.plugins.filter((x) => ('postcssPlugin' in x) && x.postcssPlugin !== 'postcss-slow-plugins'),
			];

			const outputCSS_KB = (await postcss(plugins).process(inputCSS ?? '', result.opts)).css.length / 1024;

			const medianDuration = async (cb: () => Promise<void>): Promise<number> => {
				const durations: Array<number> = [];
				for (let i = 0; i < 21; i++) {
					const start = performance.now();
					await cb();
					durations.push(performance.now() - start);
				}
				durations.sort((a, b) => a - b);
				return durations[10];
			};

			const baseline = await medianDuration(async () => {
				(await postcss(plugins).process(inputCSS ?? '', result.opts));
			});

			{
				const results: Array<{
					duration: string,
					'kb\'s per ms'?: string,
					drop: number | string,
					name: string,
					'index in plugins list': number | string,
				}> = [];

				for (let i = 0; i < plugins.length; i++) {
					const name = ('postcssPlugin' in plugins[i]) ? (plugins[i] as Plugin | Transformer).postcssPlugin : 'unknown plugin';
					if (ignore.includes(name)) {
						continue;
					}

					const pluginsWithoutCurrent = plugins.filter((x) => x !== plugins[i]);

					const durationWithoutPlugin = await medianDuration(async () => {
						(await postcss(pluginsWithoutCurrent).process(inputCSS ?? '', result.opts));
					});

					const durationDrop = baseline - durationWithoutPlugin;

					results.push({
						duration: `${durationWithoutPlugin.toFixed(2)}ms`,
						'kb\'s per ms': `${(outputCSS_KB / durationWithoutPlugin).toFixed(2)}kb/ms`,
						drop: durationDrop,
						name: name,
						'index in plugins list': i,
					});
				}

				results.sort((a, b) => Number(b.drop) - Number(a.drop));

				results.splice(0, 0, {
					duration: `${baseline.toFixed(2)}ms`,
					'kb\'s per ms': `${(outputCSS_KB / baseline).toFixed(2)}kb/ms`,
					drop: '--',
					name: '-- all plugins --',
					'index in plugins list': '--',
				});

				results.map((x) => {
					if (typeof x.drop === 'string') {
						return x;
					}

					x.drop = `${x.drop.toFixed(2)}ms`;
					return x;
				});

				// eslint-disable-next-line no-console
				console.log('Most impactful to improve, ordered by drop in duration when excluded:');
				// eslint-disable-next-line no-console
				console.table(results.slice(0, 11));
			}

			{
				const results: Array<{
					duration: string,
					'kb\'s per ms'?: string,
					drop?: number | string,
					name: string,
					'index in plugins list': number | string,
				}> = [];

				for (let i = 0; i < plugins.length; i++) {
					const name = ('postcssPlugin' in plugins[i]) ? (plugins[i] as Plugin | Transformer).postcssPlugin : 'unknown plugin';
					if (ignore.includes(name)) {
						continue;
					}

					const pluginsWithOnlyCurrent = [
						...plugins.filter((x) => {
							if (x === plugins[i]) {
								return true;
							}

							return ('postcssPlugin' in x) && ignore.includes(x.postcssPlugin);
						}),
					];

					const durationWithOnlyPlugin = await medianDuration(async () => {
						(await postcss(pluginsWithOnlyCurrent).process(inputCSS ?? '', result.opts));
					});

					const durationDrop = baseline - durationWithOnlyPlugin;

					results.push({
						duration: `${durationWithOnlyPlugin.toFixed(2)}ms`,
						'kb\'s per ms': `${(outputCSS_KB / durationWithOnlyPlugin).toFixed(2)}kb/ms`,
						drop: durationDrop,
						name: name,
						'index in plugins list': i,
					});
				}

				results.sort((a, b) => Number(a.drop) - Number(b.drop));

				results.map((x) => {
					delete x.drop;
					return x;
				});

				// eslint-disable-next-line no-console
				console.log('Most impactful to improve, ordered by increase in duration when running alone:');
				// eslint-disable-next-line no-console
				console.table(results.slice(0, 11));
			}
		},
	};
};

creator.postcss = true;

export default creator;
