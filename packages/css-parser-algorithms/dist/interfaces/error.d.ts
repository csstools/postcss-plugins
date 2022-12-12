export type ParserError = {
    message: string;
    start: number;
    end: number;
    state: Array<string>;
};
