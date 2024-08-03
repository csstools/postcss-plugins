import type { CodePointReader } from './interfaces/code-point-reader';

/**
 * @internal
 */
export class Reader implements CodePointReader {
	cursor = 0;
	source = '';

	representationStart = 0;
	representationEnd = -1;

	constructor(source: string) {
		this.source = source;
	}

	advanceCodePoint(n = 1): void {
		this.cursor = this.cursor + n;
		this.representationEnd = this.cursor - 1;
	}

	readCodePoint(): number | undefined {
		const codePoint = this.source.codePointAt(this.cursor);
		if (typeof codePoint === "undefined") {
			return undefined;
		}

		this.cursor = this.cursor + 1;
		this.representationEnd = this.cursor - 1;

		return codePoint;
	}

	unreadCodePoint(n = 1): void {
		this.cursor = this.cursor - n;
		this.representationEnd = this.cursor - 1;

		return;
	}

	resetRepresentation(): void {
		this.representationStart = this.cursor;
		this.representationEnd = -1;
	}
}
