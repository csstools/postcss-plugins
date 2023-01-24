import { MediaQuery } from '@csstools/media-query-list-parser';
import type { Root as PostCSSRoot } from 'postcss';
export default function getCustomMedia(root: PostCSSRoot, result: any, opts: {
    preserve?: boolean;
}): Map<string, {
    truthy: Array<MediaQuery>;
    falsy: Array<MediaQuery>;
}>;
