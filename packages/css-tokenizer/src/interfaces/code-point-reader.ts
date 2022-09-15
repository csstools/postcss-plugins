export type CodePointReader = {
	peekOneCodePoint(): number | false
	peekTwoCodePoints(): [number, number] | false
	peekThreeCodePoints(): [number, number, number] | false
}
