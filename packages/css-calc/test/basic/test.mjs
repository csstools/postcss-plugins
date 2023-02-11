import { convert } from '@csstools/css-calc';

convert('calc(10 * 2)');

convert('calc(15 / 5 / 3)');

convert('calc(15 / (5 / 3))');
convert('calc(15 / (3 / 5))');
