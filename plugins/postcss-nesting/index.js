import postcss from 'postcss';
import walk from './lib/walk';

export default postcss.plugin('postcss-nesting', () => walk);
