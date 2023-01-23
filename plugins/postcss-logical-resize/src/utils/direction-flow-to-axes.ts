import { DirectionFlow, Axes } from '../lib/types';

export function directionFlowToAxes(directionFlow: DirectionFlow): [Axes, Axes] {
	switch (directionFlow) {
		case DirectionFlow.TopToBottom:
			return [Axes.Top, Axes.Bottom];

		case DirectionFlow.BottomToTop:
			return [Axes.Bottom, Axes.Top];

		case DirectionFlow.RightToLeft:
			return [Axes.Right, Axes.Left];

		case DirectionFlow.LeftToRight:
			return [Axes.Left, Axes.Right];
	}
}
