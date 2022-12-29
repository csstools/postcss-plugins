export enum Direction {
	Block= 'block',
	Inline= 'inline',
}

export enum DirectionValue {
	Start= 'start',
	End= 'end',
}

export const DirectionValues = {
	BlockStart: `${Direction.Block}-${DirectionValue.Start}`,
	BlockEnd: `${Direction.Block}-${DirectionValue.End}`,
	InlineStart: `${Direction.Inline}-${DirectionValue.Start}`,
	InlineEnd: `${Direction.Inline}-${DirectionValue.End}`,
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
