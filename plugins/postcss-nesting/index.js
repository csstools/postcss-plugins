import postcss   from 'postcss';
import transform from './lib/transform';

export default postcss.plugin('postcss-nesting', () => root => root.walk(transform));
