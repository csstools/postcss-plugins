import type { Declaration } from 'postcss';

enum Direction {
	Block = 'block',
	Inline = 'inline',
}

export enum DirectionValue {
	Start = 'start',
	End = 'end',
}

export const DirectionValues = {
	BlockStart: 'block-start',
	BlockEnd: 'block-end',
	InlineStart: 'inline-start',
	InlineEnd: 'inline-end',
};

export enum DirectionFlow {
	TopToBottom = 'top-to-bottom',
	BottomToTop = 'bottom-to-top',
	RightToLeft = 'right-to-left',
	LeftToRight = 'left-to-right',
}

export enum Axes {
	Top = 'top',
	Right = 'right',
	Bottom = 'bottom',
	Left = 'left',
}

export type DirectionConfig = {
	[Direction.Block]: [Axes, Axes];
	[Direction.Inline]: [Axes, Axes];
	inlineIsHorizontal: boolean;
};

export type TransformFunction = (decl: Declaration) => Array<Declaration>
