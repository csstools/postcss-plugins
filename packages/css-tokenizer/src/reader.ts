import { CodePointReader } from './interfaces/code-point-reader';

/**
 * @internal
 */
export class Reader implements CodePointReader {
	cursor = 0;
	source = '';
	codePointSource: Array<number> = [];
	representationIndices: Array<number> = [-1];
	length = 0;

	representationStart = 0;
	representationEnd = -1;

	constructor(source: string) {
		this.source = source;

		{
			let representationEnd = -1;
			let codePoint = '';

			for (codePoint of source) {
				representationEnd += codePoint.length;

				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				this.codePointSource.push(codePoint.codePointAt(0)!);
				this.representationIndices.push(representationEnd);
			}
		}

		this.length = this.codePointSource.length;
	}

	advanceCodePoint(n = 1): void {
		this.cursor = this.cursor + n;
		this.representationEnd = this.representationIndices[this.cursor];
	}

	readCodePoint(n = 1): number | false {
		const codePoint = this.codePointSource[this.cursor];
		if (codePoint === undefined) {
			return false;
		}

		this.cursor = this.cursor + n;
		this.representationEnd = this.representationIndices[this.cursor];

		return codePoint;
	}

	unreadCodePoint(n = 1): void {
		this.cursor = this.cursor - n;
		this.representationEnd = this.representationIndices[this.cursor];

		return;
	}

	resetRepresentation(): void {
		this.representationStart = this.representationIndices[this.cursor] + 1;
		this.representationEnd = -1;
	}
}
