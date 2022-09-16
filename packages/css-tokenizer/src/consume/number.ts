import { CodePointReader } from '../interfaces/code-point-reader';

export enum NumberType {
	Integer = 1,
	Number = 2,
}

// https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#consume-number
export function consumeNumber(reader: CodePointReader, initial: number): [number, NumberType] {
	reader.representation();

	return [0, NumberType.Integer];
}
