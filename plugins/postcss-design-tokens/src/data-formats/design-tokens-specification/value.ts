import { TokenType } from './type';

export type TokenValue = TokenString | TokenIdent;

export type TokenBaseValue<T extends TokenType> = {
	'$type': T;
	'$name'?: string;
	'$description'?: string;
	'$deprecated'?: boolean;
}

export interface TokenString extends TokenBaseValue<TokenType.String> {
	'$value': string;
}

export interface TokenIdent extends TokenBaseValue<TokenType.Ident> {
	'$value': string;
}

export interface TokenNumber extends TokenBaseValue<TokenType.Number> {
	'$value': number;
}

export interface TokenBoolean extends TokenBaseValue<TokenType.Boolean> {
	'$value': boolean;
}

export interface TokenColor extends TokenBaseValue<TokenType.Color> {
	'$value': {
		colorSpace: 'srgb' | 'srgb-linear' | 'a98-rgb' | 'prophoto-rgb' | 'display-p3' | 'rec2020' | 'xyz-d50' | 'xyz-d65' | 'xyz'
		channels: Array<number>
		alpha: number
	};
}

export interface TokenDimension extends TokenBaseValue<TokenType.Dimension> {
	'$value': {
		unit: string
		value: number
	};
}

export interface TokenFontFamily extends TokenBaseValue<TokenType.FontFamily> {
	'$value': Array<TokenIdent|TokenString>;
}

export interface TokenFontWeight extends TokenBaseValue<TokenType.FontWeight> {
	'$value': number |
		'thin' |
		'hairline' |
		'extra-light' |
		'ultra-light' |
		'light' |
		'normal' |
		'regular' |
		'book' |
		'medium' |
		'semi-bold' |
		'demi-bold' |
		'bold' |
		'extra-bold' |
		'ultra-bold' |
		'black' |
		'heavy' |
		'extra-black' |
		'ultra-black';
}

export interface TokenFontStyle extends TokenBaseValue<TokenType.FontStyle> {
	'$value': [TokenIdent, TokenDimension?];
}

export interface TokenDuration extends TokenBaseValue<TokenType.Duration> {
	'$value': {
		unit: string
		value: number
	};
}

export interface TokenCubicBezier extends TokenBaseValue<TokenType.CubicBezier> {
	'$value': Array<number>;
}

export interface TokenURI extends TokenBaseValue<TokenType.URI> {
	'$value': string;
}
