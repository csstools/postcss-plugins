enum Direction {
	Block = 'block',
	Inline = 'inline',
}

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
