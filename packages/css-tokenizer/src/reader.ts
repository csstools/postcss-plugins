import { CodePointReader } from './interfaces/code-point-reader';

export class Reader implements CodePointReader {
	cursor: number;
	stringSource = '';
	codePointSource: Array<number> = [];
	length = 0;

	representationStart = 0;
	representationEnd = -1;

	peekedOne: number | undefined;
	peekedTwo: number | undefined;
	peekedThree: number | undefined;

	constructor(source: string) {
		this.cursor = 0;
		this.stringSource = source;
		this.length = source.length;

		this.codePointSource = new Array(this.length);
		for (let i = 0; i < this.length; i++) {
			this.codePointSource[i] = this.stringSource.charCodeAt(i);
		}

		this.peekedOne = this.codePointSource[this.cursor];
		this.peekedTwo = this.codePointSource[this.cursor + 1];
		this.peekedThree = this.codePointSource[this.cursor + 2];
		this.peekedFour = this.codePointSource[this.cursor + 3];
	}
	peekedFour: number;

	cursorPositionOfLastReadCodePoint(): number {
		return this.cursor - 1;
	}

	readCodePoint(n = 1): number | false {
		const codePoint = this.codePointSource[this.cursor];
		if (typeof codePoint === 'undefined') {
			return false;
		}

		this.cursor += n;
		this.representationEnd = this.cursor - 1;

		this.peekedOne = this.codePointSource[this.cursor];
		this.peekedTwo = this.codePointSource[this.cursor + 1];
		this.peekedThree = this.codePointSource[this.cursor + 2];
		this.peekedFour = this.codePointSource[this.cursor + 3];

		return codePoint;
	}

	unreadCodePoint(): boolean {
		if (this.cursor === 0) {
			return false;
		}

		this.representationEnd = this.cursor - 1;
		this.cursor -= 1;

		this.peekedOne = this.codePointSource[this.cursor];
		this.peekedTwo = this.codePointSource[this.cursor + 1];
		this.peekedThree = this.codePointSource[this.cursor + 2];
		this.peekedFour = this.codePointSource[this.cursor + 3];

		return true;
	}

	representationString(): string {
		if (this.representationEnd === -1) {
			return '';
		}

		return this.stringSource.slice(this.representationStart, this.representationEnd + 1);
	}

	resetRepresentation() {
		this.representationStart = this.cursor;
		this.representationEnd = -1;
	}

	slice(start: number, end: number): string {
		return this.stringSource.slice(start, end);
	}
}
