import type { Axes, DirectionConfig, TransformFunction } from './types';
import {
	transformBorder,
	transformBorderProperty,
	transformBorderShorthand,
	transformBorderRadius,
} from './transform-borders';
import { transformLogicalSize } from './transform-logical-size';
import {
	transformOffset,
	transformOffsetShorthand,
} from './transform-offset';
import { transformInset } from './transform-inset';
import {
	transformSide,
	transformSideShorthand,
} from './transform-side';
import { transformTextAlign } from './transform-text-align';
import { transformValue } from './transform-value';

export function prepareTransforms(directionConfig: DirectionConfig, blockStart: Axes, blockEnd: Axes, inlineStart: Axes, inlineEnd: Axes): Record<string, TransformFunction|null> {
	return {
		// 2.1 Caption
		'caption-side': transformValue(directionConfig),
		// 2.3 Text Align
		'text-align': directionConfig.inlineIsHorizontal
			? transformTextAlign(directionConfig.inline)
			: null,

		// 4.1 Block Size and Inline Size
		'block-size': transformLogicalSize(directionConfig),
		'inline-size': transformLogicalSize(directionConfig),
		'min-block-size': transformLogicalSize(directionConfig),
		'max-block-size': transformLogicalSize(directionConfig),
		'min-inline-size': transformLogicalSize(directionConfig),
		'max-inline-size': transformLogicalSize(directionConfig),
		// 4.2 Margins
		'margin-block-start': transformSide('margin', blockStart),
		'margin-block-end': transformSide('margin', blockEnd),
		'margin-inline-start': transformSide('margin', inlineStart),
		'margin-inline-end': transformSide('margin', inlineEnd),
		'margin-block': transformSideShorthand('margin', directionConfig.block),
		'margin-inline': transformSideShorthand('margin', directionConfig.inline),
		// 4.3 Offsets
		'inset-block': transformOffsetShorthand(directionConfig.block),
		'inset-block-start': transformOffset(blockStart),
		'inset-block-end': transformOffset(blockEnd),
		'inset-inline': transformOffsetShorthand(directionConfig.inline),
		'inset-inline-start': transformOffset(inlineStart),
		'inset-inline-end': transformOffset(inlineEnd),
		'inset': transformInset(),
		// 4.4 Paddings
		'padding-block-start': transformSide('padding', blockStart),
		'padding-block-end': transformSide('padding', blockEnd),
		'padding-inline-start': transformSide('padding', inlineStart),
		'padding-inline-end': transformSide('padding', inlineEnd),
		'padding-block': transformSideShorthand('padding', directionConfig.block),
		'padding-inline': transformSideShorthand('padding', directionConfig.inline),
		// 4.5 Borders
		// 4.5.1 Border Width
		'border-block-start-width': transformBorder('width', blockStart),
		'border-block-end-width': transformBorder('width', blockEnd),
		'border-inline-start-width': transformBorder('width', inlineStart),
		'border-inline-end-width': transformBorder('width', inlineEnd),
		'border-block-width': transformBorderProperty('width', directionConfig.block),
		'border-inline-width': transformBorderProperty('width', directionConfig.inline),
		// 4.5.2 Border Style
		'border-block-start-style': transformBorder('style', blockStart),
		'border-block-end-style': transformBorder('style', blockEnd),
		'border-inline-start-style': transformBorder('style', inlineStart),
		'border-inline-end-style': transformBorder('style', inlineEnd),
		'border-block-style': transformBorderProperty('style', directionConfig.block),
		'border-inline-style': transformBorderProperty('style', directionConfig.inline),
		// 4.5.3 Border Color
		'border-block-start-color': transformBorder('color', blockStart),
		'border-block-end-color': transformBorder('color', blockEnd),
		'border-inline-start-color': transformBorder('color', inlineStart),
		'border-inline-end-color': transformBorder('color', inlineEnd),
		'border-block-color': transformBorderProperty('color', directionConfig.block),
		'border-inline-color': transformBorderProperty('color', directionConfig.inline),
		// 4.5.4 Border Shorthand
		'border-block': transformBorderShorthand(directionConfig.block),
		'border-block-start': transformBorderShorthand([blockStart]),
		'border-block-end': transformBorderShorthand([blockEnd]),
		'border-inline': transformBorderShorthand(directionConfig.inline),
		'border-inline-start': transformBorderShorthand([inlineStart]),
		'border-inline-end': transformBorderShorthand([inlineEnd]),
		// 4.6 Border Radius
		'border-start-start-radius': transformBorderRadius(directionConfig),
		'border-start-end-radius': transformBorderRadius(directionConfig),
		'border-end-start-radius': transformBorderRadius(directionConfig),
		'border-end-end-radius': transformBorderRadius(directionConfig),
	};
}
