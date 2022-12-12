import { ParserError } from './error';
export type Context = {
    onParseError: (error: ParserError) => void;
};
