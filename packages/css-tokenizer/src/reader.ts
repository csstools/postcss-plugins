import { CodePointReader } from './interfaces/code-point-reader';

export class Reader implements CodePointReader {
	cursor: number;
	source = '';
	codePointSource: Array<number> = [];
	length = 0;

	representationStart = 0;
	representationEnd = -1;

	constructor(source: string) {
		this.cursor = 0;
		this.source = source;
		this.length = source.length;

		this.codePointSource = [];
		for (let i = 0; i < source.length; i++) {
			this.codePointSource.push(source.charCodeAt(i));
		}
	}

	cursorPositionOfLastReadCodePoint(): number {
		return this.cursor - 1;
	}

	advanceCodePoint(n = 1) {
		this.cursor += n;
		this.representationEnd = this.cursor - 1;
	}

	readCodePoint(n = 1): number | false {
		const codePoint = this.codePointSource[this.cursor];
		if (codePoint === undefined) {
			return false;
		}

		this.cursor += n;
		this.representationEnd = this.cursor - 1;

		return codePoint;
	}

	unreadCodePoint(n = 1): boolean {
		if (this.cursor === 0) {
			return false;
		}

		this.cursor -= n;
		this.representationEnd = this.cursor - 1;

		return true;
	}
}
