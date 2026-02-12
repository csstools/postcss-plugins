import { sourceIndices, type ComponentValue } from "@csstools/css-parser-algorithms";

/**
 * Any errors are reported through the `onParseError` callback.
 */
export class ParseError extends Error {
	/** The index of the start character of the current token. */
	sourceStart: number;
	/** The index of the end character of the current token. */
	sourceEnd: number;

	constructor(message: string, sourceStart: number, sourceEnd: number) {
		super(message);
		this.name = 'ParseError';

		this.sourceStart = sourceStart;
		this.sourceEnd = sourceEnd;
	}
}

export class ParseErrorWithComponentValues extends ParseError {
	/** The associated component values. */
	componentValues: Array<ComponentValue>;

	constructor(message: string, componentValues: Array<ComponentValue>) {
		super(message, ...sourceIndices(componentValues));

		this.componentValues = componentValues;
	}
}

export const ParseErrorMessage = {
	UnexpectedAdditionOfDimensionOrPercentageWithNumber: 'Unexpected addition of a dimension or percentage with a number.',
	UnexpectedSubtractionOfDimensionOrPercentageWithNumber: 'Unexpected subtraction of a dimension or percentage with a number.'
}
