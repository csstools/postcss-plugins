import type { PluginCreator } from 'postcss';

declare const creator: PluginCreator<unknown>;
export default creator;
export { creator as 'module.exports' }

export { }
