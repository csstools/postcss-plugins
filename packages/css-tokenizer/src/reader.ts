import { CodePointReader } from './interfaces/code-point-reader';

export class Reader implements CodePointReader {
	#cursor: number;
	#stringSource = '';
	#codePointSource: Array<number> = [];
	#length = 0;

	#representationStart = 0;
	#representationEnd = -1;

	constructor(source: string) {
		this.#cursor = 0;
		this.#stringSource = source.valueOf();
		this.#length = source.length;

		for (let i = 0; i < this.#length; i++) {
			this.#codePointSource.push(this.#stringSource.charCodeAt(i));
		}
	}

	cursorPositionOfLastReadCodePoint(): number {
		return this.#cursor - 1;
	}

	peekOneCodePoint(): number | false {
		const first = this.#codePointSource[this.#cursor];
		if (typeof first === 'undefined') {
			return false;
		}

		return first;
	}

	peekTwoCodePoints(): [number, number] | false {
		const first = this.#codePointSource[this.#cursor];
		if (typeof first === 'undefined') {
			return false;
		}

		const second = this.#codePointSource[this.#cursor + 1];
		if (typeof second === 'undefined') {
			return false;
		}

		return [first, second];
	}

	peekThreeCodePoints(): [number, number, number] | false {
		const first = this.#codePointSource[this.#cursor];
		if (typeof first === 'undefined') {
			return false;
		}

		const second = this.#codePointSource[this.#cursor + 1];
		if (typeof second === 'undefined') {
			return false;
		}

		const third = this.#codePointSource[this.#cursor + 2];
		if (typeof third === 'undefined') {
			return false;
		}

		return [first, second, third];
	}

	readCodePoint(): number | false {
		const codePoint = this.#codePointSource[this.#cursor];
		if (typeof codePoint === 'undefined') {
			return false;
		}

		this.#representationEnd = this.#cursor;
		this.#cursor += 1;
		return codePoint;
	}

	unreadCodePoint(): boolean {
		if (this.#cursor === 0) {
			return false;
		}

		this.#representationEnd = this.#cursor - 1;
		this.#cursor -= 1;

		return true;
	}

	representation(): [number, number] {
		return [
			this.#representationStart,
			this.#representationEnd,
		];
	}

	representationString(): string {
		const representation = this.representation();
		if (representation[1] === -1) {
			return '';
		}

		return this.slice(representation[0], representation[1] + 1);
	}

	resetRepresentation() {
		this.#representationStart = this.#cursor;
		this.#representationEnd = -1;
	}

	slice(start: number, end: number): string {
		return this.#stringSource.slice(start, end);
	}
}
