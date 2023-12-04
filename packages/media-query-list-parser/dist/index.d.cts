import { CSSToken, ParseError, TokenColon, TokenDelim, TokenIdent } from "@csstools/css-tokenizer";
import { ComponentValue, ContainerNode } from "@csstools/css-parser-algorithms";
declare enum NodeType {
    CustomMedia = "custom-media",
    GeneralEnclosed = "general-enclosed",
    MediaAnd = "media-and",
    MediaCondition = "media-condition",
    MediaConditionListWithAnd = "media-condition-list-and",
    MediaConditionListWithOr = "media-condition-list-or",
    MediaFeature = "media-feature",
    MediaFeatureBoolean = "mf-boolean",
    MediaFeatureName = "mf-name",
    MediaFeaturePlain = "mf-plain",
    MediaFeatureRangeNameValue = "mf-range-name-value",
    MediaFeatureRangeValueName = "mf-range-value-name",
    MediaFeatureRangeValueNameValue = "mf-range-value-name-value",
    MediaFeatureValue = "mf-value",
    MediaInParens = "media-in-parens",
    MediaNot = "media-not",
    MediaOr = "media-or",
    MediaQueryWithType = "media-query-with-type",
    MediaQueryWithoutType = "media-query-without-type",
    MediaQueryInvalid = "media-query-invalid"
}
declare class GeneralEnclosed {
    type: NodeType;
    value: ComponentValue;
    constructor(value: ComponentValue);
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: ComponentValue): number | string;
    at(index: number | string): ComponentValue | undefined;
    walk<T extends Record<string, unknown>>(cb: (entry: {
        node: GeneralEnclosedWalkerEntry;
        parent: GeneralEnclosedWalkerParent;
        state?: T;
    }, index: number | string) => boolean | void, state?: T): false | undefined;
    toJSON(): {
        type: NodeType;
        tokens: CSSToken[];
    };
    isGeneralEnclosed(): this is GeneralEnclosed;
    static isGeneralEnclosed(x: unknown): x is GeneralEnclosed;
}
type GeneralEnclosedWalkerEntry = ComponentValue;
type GeneralEnclosedWalkerParent = ContainerNode | GeneralEnclosed;
declare class MediaFeatureName {
    type: NodeType;
    name: ComponentValue;
    before: Array<CSSToken>;
    after: Array<CSSToken>;
    constructor(name: ComponentValue, before?: Array<CSSToken>, after?: Array<CSSToken>);
    getName(): string;
    getNameToken(): CSSToken;
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: ComponentValue): number | string;
    at(index: number | string): ComponentValue | undefined;
    toJSON(): {
        type: NodeType;
        name: string;
        tokens: CSSToken[];
    };
    isMediaFeatureName(): this is MediaFeatureName;
    static isMediaFeatureName(x: unknown): x is MediaFeatureName;
}
declare class MediaFeatureBoolean {
    type: NodeType;
    name: MediaFeatureName;
    constructor(name: MediaFeatureName);
    getName(): string;
    getNameToken(): CSSToken;
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: MediaFeatureName): number | string;
    at(index: number | string): MediaFeatureName | undefined;
    toJSON(): {
        type: NodeType;
        name: {
            type: NodeType;
            name: string;
            tokens: CSSToken[];
        };
        tokens: CSSToken[];
    };
    isMediaFeatureBoolean(): this is MediaFeatureBoolean;
    static isMediaFeatureBoolean(x: unknown): x is MediaFeatureBoolean;
}
declare class MediaFeatureValue {
    type: NodeType;
    value: ComponentValue | Array<ComponentValue>;
    before: Array<CSSToken>;
    after: Array<CSSToken>;
    constructor(value: ComponentValue | Array<ComponentValue>, before?: Array<CSSToken>, after?: Array<CSSToken>);
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: ComponentValue): number | string;
    at(index: number | string): ComponentValue | Array<ComponentValue> | undefined;
    walk<T extends Record<string, unknown>>(cb: (entry: {
        node: MediaFeatureValueWalkerEntry;
        parent: MediaFeatureValueWalkerParent;
        state?: T;
    }, index: number | string) => boolean | void, state?: T): false | undefined;
    toJSON(): {
        type: NodeType;
        value: unknown;
        tokens: CSSToken[];
    };
    isMediaFeatureValue(): this is MediaFeatureValue;
    static isMediaFeatureValue(x: unknown): x is MediaFeatureValue;
}
type MediaFeatureValueWalkerEntry = ComponentValue;
type MediaFeatureValueWalkerParent = ContainerNode | MediaFeatureValue;
declare function matchesRatioExactly(componentValues: Array<ComponentValue>): number[] | -1;
declare function matchesRatio(componentValues: Array<ComponentValue>): number[] | -1;
declare class MediaFeaturePlain {
    type: NodeType;
    name: MediaFeatureName;
    colon: TokenColon;
    value: MediaFeatureValue;
    constructor(name: MediaFeatureName, colon: TokenColon, value: MediaFeatureValue);
    getName(): string;
    getNameToken(): CSSToken;
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: MediaFeatureName | MediaFeatureValue): number | string;
    at(index: number | string): MediaFeatureName | MediaFeatureValue | undefined;
    walk<T extends Record<string, unknown>>(cb: (entry: {
        node: MediaFeaturePlainWalkerEntry;
        parent: MediaFeaturePlainWalkerParent;
        state?: T;
    }, index: number | string) => boolean | void, state?: T): false | undefined;
    toJSON(): {
        type: NodeType;
        name: {
            type: NodeType;
            name: string;
            tokens: CSSToken[];
        };
        value: {
            type: NodeType;
            value: unknown;
            tokens: CSSToken[];
        };
        tokens: CSSToken[];
    };
    isMediaFeaturePlain(): this is MediaFeaturePlain;
    static isMediaFeaturePlain(x: unknown): x is MediaFeaturePlain;
}
type MediaFeaturePlainWalkerEntry = MediaFeatureValueWalkerEntry | MediaFeatureValue;
type MediaFeaturePlainWalkerParent = MediaFeatureValueWalkerParent | MediaFeaturePlain;
declare enum MediaFeatureLT {
    LT = "<",
    LT_OR_EQ = "<="
}
declare enum MediaFeatureGT {
    GT = ">",
    GT_OR_EQ = ">="
}
declare enum MediaFeatureEQ {
    EQ = "="
}
type MediaFeatureComparison = MediaFeatureLT | MediaFeatureGT | MediaFeatureEQ;
declare function matchesComparison(componentValues: Array<ComponentValue>): false | [
    number,
    number
];
declare function comparisonFromTokens(tokens: [
    TokenDelim,
    TokenDelim
] | [
    TokenDelim
]): MediaFeatureComparison | false;
declare function invertComparison(operator: MediaFeatureComparison): MediaFeatureComparison | false;
type MediaFeatureRange = MediaFeatureRangeNameValue | MediaFeatureRangeValueName | MediaFeatureRangeValueNameValue;
declare class MediaFeatureRangeNameValue {
    type: NodeType;
    name: MediaFeatureName;
    operator: [
        TokenDelim,
        TokenDelim
    ] | [
        TokenDelim
    ];
    value: MediaFeatureValue;
    constructor(name: MediaFeatureName, operator: [
        TokenDelim,
        TokenDelim
    ] | [
        TokenDelim
    ], value: MediaFeatureValue);
    operatorKind(): MediaFeatureComparison | false;
    getName(): string;
    getNameToken(): CSSToken;
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: MediaFeatureName | MediaFeatureValue): number | string;
    at(index: number | string): MediaFeatureName | MediaFeatureValue | undefined;
    walk<T extends Record<string, unknown>>(cb: (entry: {
        node: MediaFeatureRangeWalkerEntry;
        parent: MediaFeatureRangeWalkerParent;
        state?: T;
    }, index: number | string) => boolean | void, state?: T): false | undefined;
    toJSON(): {
        type: NodeType;
        name: {
            type: NodeType;
            name: string;
            tokens: CSSToken[];
        };
        value: {
            type: NodeType;
            value: unknown;
            tokens: CSSToken[];
        };
        tokens: CSSToken[];
    };
    isMediaFeatureRangeNameValue(): this is MediaFeatureRangeNameValue;
    static isMediaFeatureRangeNameValue(x: unknown): x is MediaFeatureRangeNameValue;
}
declare class MediaFeatureRangeValueName {
    type: NodeType;
    name: MediaFeatureName;
    operator: [
        TokenDelim,
        TokenDelim
    ] | [
        TokenDelim
    ];
    value: MediaFeatureValue;
    constructor(name: MediaFeatureName, operator: [
        TokenDelim,
        TokenDelim
    ] | [
        TokenDelim
    ], value: MediaFeatureValue);
    operatorKind(): MediaFeatureComparison | false;
    getName(): string;
    getNameToken(): CSSToken;
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: MediaFeatureName | MediaFeatureValue): number | string;
    at(index: number | string): MediaFeatureName | MediaFeatureValue | undefined;
    walk<T extends Record<string, unknown>>(cb: (entry: {
        node: MediaFeatureRangeWalkerEntry;
        parent: MediaFeatureRangeWalkerParent;
        state?: T;
    }, index: number | string) => boolean | void, state?: T): false | undefined;
    toJSON(): {
        type: NodeType;
        name: {
            type: NodeType;
            name: string;
            tokens: CSSToken[];
        };
        value: {
            type: NodeType;
            value: unknown;
            tokens: CSSToken[];
        };
        tokens: CSSToken[];
    };
    isMediaFeatureRangeValueName(): this is MediaFeatureRangeValueName;
    static isMediaFeatureRangeValueName(x: unknown): x is MediaFeatureRangeValueName;
}
declare class MediaFeatureRangeValueNameValue {
    type: NodeType;
    name: MediaFeatureName;
    valueOne: MediaFeatureValue;
    valueOneOperator: [
        TokenDelim,
        TokenDelim
    ] | [
        TokenDelim
    ];
    valueTwo: MediaFeatureValue;
    valueTwoOperator: [
        TokenDelim,
        TokenDelim
    ] | [
        TokenDelim
    ];
    constructor(name: MediaFeatureName, valueOne: MediaFeatureValue, valueOneOperator: [
        TokenDelim,
        TokenDelim
    ] | [
        TokenDelim
    ], valueTwo: MediaFeatureValue, valueTwoOperator: [
        TokenDelim,
        TokenDelim
    ] | [
        TokenDelim
    ]);
    valueOneOperatorKind(): MediaFeatureComparison | false;
    valueTwoOperatorKind(): MediaFeatureComparison | false;
    getName(): string;
    getNameToken(): CSSToken;
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: MediaFeatureName | MediaFeatureValue): number | string;
    at(index: number | string): MediaFeatureName | MediaFeatureValue | undefined;
    walk<T extends Record<string, unknown>>(cb: (entry: {
        node: MediaFeatureRangeWalkerEntry;
        parent: MediaFeatureRangeWalkerParent;
        state?: T;
    }, index: number | string) => boolean | void, state?: T): false | undefined;
    toJSON(): {
        type: NodeType;
        name: {
            type: NodeType;
            name: string;
            tokens: CSSToken[];
        };
        valueOne: {
            type: NodeType;
            value: unknown;
            tokens: CSSToken[];
        };
        valueTwo: {
            type: NodeType;
            value: unknown;
            tokens: CSSToken[];
        };
        tokens: CSSToken[];
    };
    isMediaFeatureRangeValueNameValue(): this is MediaFeatureRangeValueNameValue;
    static isMediaFeatureRangeValueNameValue(x: unknown): x is MediaFeatureRangeValueNameValue;
}
type MediaFeatureRangeWalkerEntry = MediaFeatureValueWalkerEntry | MediaFeatureValue;
type MediaFeatureRangeWalkerParent = MediaFeatureValueWalkerParent | MediaFeatureRange;
declare class MediaFeature {
    type: NodeType;
    feature: MediaFeaturePlain | MediaFeatureBoolean | MediaFeatureRange;
    before: Array<CSSToken>;
    after: Array<CSSToken>;
    constructor(feature: MediaFeaturePlain | MediaFeatureBoolean | MediaFeatureRange, before?: Array<CSSToken>, after?: Array<CSSToken>);
    getName(): string;
    getNameToken(): CSSToken;
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: MediaFeaturePlain | MediaFeatureBoolean | MediaFeatureRange): number | string;
    at(index: number | string): MediaFeatureBoolean | MediaFeaturePlain | MediaFeatureRange | undefined;
    walk<T extends Record<string, unknown>>(cb: (entry: {
        node: MediaFeatureWalkerEntry;
        parent: MediaFeatureWalkerParent;
        state?: T;
    }, index: number | string) => boolean | void, state?: T): false | undefined;
    toJSON(): {
        type: NodeType;
        feature: {
            type: NodeType;
            name: {
                type: NodeType;
                name: string;
                tokens: CSSToken[];
            };
            tokens: CSSToken[];
        };
        before: CSSToken[];
        after: CSSToken[];
    };
    isMediaFeature(): this is MediaFeature;
    static isMediaFeature(x: unknown): x is MediaFeature;
}
type MediaFeatureWalkerEntry = MediaFeaturePlainWalkerEntry | MediaFeatureRangeWalkerEntry | MediaFeaturePlain | MediaFeatureBoolean | MediaFeatureRange;
type MediaFeatureWalkerParent = MediaFeaturePlainWalkerParent | MediaFeatureRangeWalkerParent | MediaFeature;
declare function newMediaFeatureBoolean(name: string): MediaFeature;
declare function newMediaFeaturePlain(name: string, ...value: Array<CSSToken>): MediaFeature;
declare class MediaNot {
    type: NodeType;
    modifier: Array<CSSToken>;
    media: MediaInParens;
    constructor(modifier: Array<CSSToken>, media: MediaInParens);
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: MediaInParens): number | string;
    at(index: number | string): MediaInParens | undefined;
    walk<T extends Record<string, unknown>>(cb: (entry: {
        node: MediaNotWalkerEntry;
        parent: MediaNotWalkerParent;
        state?: T;
    }, index: number | string) => boolean | void, state?: T): false | undefined;
    toJSON(): {
        type: NodeType;
        modifier: CSSToken[];
        media: {
            type: NodeType;
            media: unknown;
            before: CSSToken[];
            after: CSSToken[];
        };
    };
    isMediaNot(): this is MediaNot;
    static isMediaNot(x: unknown): x is MediaNot;
}
type MediaNotWalkerEntry = MediaInParensWalkerEntry | MediaInParens;
type MediaNotWalkerParent = MediaInParensWalkerParent | MediaNot;
declare class MediaOr {
    type: NodeType;
    modifier: Array<CSSToken>;
    media: MediaInParens;
    constructor(modifier: Array<CSSToken>, media: MediaInParens);
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: MediaInParens): number | string;
    at(index: number | string): MediaInParens | undefined;
    walk<T extends Record<string, unknown>>(cb: (entry: {
        node: MediaOrWalkerEntry;
        parent: MediaOrWalkerParent;
        state?: T;
    }, index: number | string) => boolean | void, state?: T): false | undefined;
    toJSON(): {
        type: NodeType;
        modifier: CSSToken[];
        media: {
            type: NodeType;
            media: unknown;
            before: CSSToken[];
            after: CSSToken[];
        };
    };
    isMediaOr(): this is MediaOr;
    static isMediaOr(x: unknown): x is MediaOr;
}
type MediaOrWalkerEntry = MediaInParensWalkerEntry | MediaInParens;
type MediaOrWalkerParent = MediaInParensWalkerParent | MediaOr;
declare class MediaInParens {
    type: NodeType;
    media: MediaCondition | MediaFeature | GeneralEnclosed;
    before: Array<CSSToken>;
    after: Array<CSSToken>;
    constructor(media: MediaCondition | MediaFeature | GeneralEnclosed, before?: Array<CSSToken>, after?: Array<CSSToken>);
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: MediaCondition | MediaFeature | GeneralEnclosed): number | string;
    at(index: number | string): MediaCondition | MediaFeature | GeneralEnclosed | undefined;
    walk<T extends Record<string, unknown>>(cb: (entry: {
        node: MediaInParensWalkerEntry;
        parent: MediaInParensWalkerParent;
        state?: T;
    }, index: number | string) => boolean | void, state?: T): false | undefined;
    toJSON(): {
        type: NodeType;
        media: unknown;
        before: CSSToken[];
        after: CSSToken[];
    };
    isMediaInParens(): this is MediaInParens;
    static isMediaInParens(x: unknown): x is MediaInParens;
}
type MediaInParensWalkerEntry = ComponentValue | GeneralEnclosed | MediaAnd | MediaNot | MediaOr | MediaConditionList | MediaCondition | MediaFeatureBoolean | MediaFeatureName | MediaFeaturePlain | MediaFeatureRange | MediaFeatureValue | MediaFeature | GeneralEnclosed | MediaInParens;
type MediaInParensWalkerParent = ContainerNode | GeneralEnclosed | MediaAnd | MediaNot | MediaOr | MediaConditionList | MediaCondition | MediaFeatureBoolean | MediaFeatureName | MediaFeaturePlain | MediaFeatureRange | MediaFeatureValue | MediaFeature | GeneralEnclosed | MediaInParens;
declare class MediaAnd {
    type: NodeType;
    modifier: Array<CSSToken>;
    media: MediaInParens;
    constructor(modifier: Array<CSSToken>, media: MediaInParens);
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: MediaInParens): number | string;
    at(index: number | string): MediaInParens | null;
    walk<T extends Record<string, unknown>>(cb: (entry: {
        node: MediaAndWalkerEntry;
        parent: MediaAndWalkerParent;
        state?: T;
    }, index: number | string) => boolean | void, state?: T): false | undefined;
    toJSON(): unknown;
    isMediaAnd(): this is MediaAnd;
    static isMediaAnd(x: unknown): x is MediaAnd;
}
type MediaAndWalkerEntry = MediaInParensWalkerEntry | MediaInParens;
type MediaAndWalkerParent = MediaInParensWalkerParent | MediaAnd;
type MediaConditionList = MediaConditionListWithAnd | MediaConditionListWithOr;
declare class MediaConditionListWithAnd {
    type: NodeType;
    leading: MediaInParens;
    list: Array<MediaAnd>;
    before: Array<CSSToken>;
    after: Array<CSSToken>;
    constructor(leading: MediaInParens, list: Array<MediaAnd>, before?: Array<CSSToken>, after?: Array<CSSToken>);
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: MediaInParens | MediaAnd): number | string;
    at(index: number | string): MediaInParens | MediaAnd | undefined;
    walk<T extends Record<string, unknown>>(cb: (entry: {
        node: MediaConditionListWithAndWalkerEntry;
        parent: MediaConditionListWithAndWalkerParent;
        state?: T;
    }, index: number | string) => boolean | void, state?: T): false | undefined;
    toJSON(): unknown;
    isMediaConditionListWithAnd(): this is MediaConditionListWithAnd;
    static isMediaConditionListWithAnd(x: unknown): x is MediaConditionListWithAnd;
}
type MediaConditionListWithAndWalkerEntry = MediaAndWalkerEntry | MediaAnd;
type MediaConditionListWithAndWalkerParent = MediaAndWalkerParent | MediaConditionListWithAnd;
declare class MediaConditionListWithOr {
    type: NodeType;
    leading: MediaInParens;
    list: Array<MediaOr>;
    before: Array<CSSToken>;
    after: Array<CSSToken>;
    constructor(leading: MediaInParens, list: Array<MediaOr>, before?: Array<CSSToken>, after?: Array<CSSToken>);
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: MediaInParens | MediaOr): number | string;
    at(index: number | string): MediaInParens | MediaOr | undefined;
    walk<T extends Record<string, unknown>>(cb: (entry: {
        node: MediaConditionListWithOrWalkerEntry;
        parent: MediaConditionListWithOrWalkerParent;
        state?: T;
    }, index: number | string) => boolean | void, state?: T): false | undefined;
    toJSON(): unknown;
    isMediaConditionListWithOr(): this is MediaConditionListWithOr;
    static isMediaConditionListWithOr(x: unknown): x is MediaConditionListWithOr;
}
type MediaConditionListWithOrWalkerEntry = MediaOrWalkerEntry | MediaOr;
type MediaConditionListWithOrWalkerParent = MediaOrWalkerParent | MediaConditionListWithOr;
declare class MediaCondition {
    type: NodeType;
    media: MediaNot | MediaInParens | MediaConditionListWithAnd | MediaConditionListWithOr;
    constructor(media: MediaNot | MediaInParens | MediaConditionListWithAnd | MediaConditionListWithOr);
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: MediaNot | MediaInParens | MediaConditionListWithAnd | MediaConditionListWithOr): number | string;
    at(index: number | string): MediaNot | MediaInParens | MediaConditionListWithAnd | MediaConditionListWithOr | undefined;
    walk<T extends Record<string, unknown>>(cb: (entry: {
        node: MediaConditionWalkerEntry;
        parent: MediaConditionWalkerParent;
        state?: T;
    }, index: number | string) => boolean | void, state?: T): false | undefined;
    toJSON(): unknown;
    isMediaCondition(): this is MediaCondition;
    static isMediaCondition(x: unknown): x is MediaCondition;
}
type MediaConditionWalkerEntry = MediaNotWalkerEntry | MediaConditionListWithAndWalkerEntry | MediaConditionListWithOrWalkerEntry | MediaNot | MediaConditionListWithAnd | MediaConditionListWithOr;
type MediaConditionWalkerParent = MediaNotWalkerParent | MediaConditionListWithAndWalkerParent | MediaConditionListWithOrWalkerParent | MediaCondition;
type MediaQuery = MediaQueryWithType | MediaQueryWithoutType | MediaQueryInvalid;
declare class MediaQueryWithType {
    type: NodeType;
    modifier: Array<CSSToken>;
    mediaType: Array<CSSToken>;
    and: Array<CSSToken> | undefined;
    media: MediaCondition | undefined;
    constructor(modifier: Array<CSSToken>, mediaType: Array<CSSToken>, and?: Array<CSSToken> | undefined, media?: MediaCondition | undefined);
    getModifier(): string;
    negateQuery(): MediaQuery;
    getMediaType(): string;
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: MediaCondition): number | string;
    at(index: number | string): MediaCondition | undefined;
    walk<T extends Record<string, unknown>>(cb: (entry: {
        node: MediaQueryWithTypeWalkerEntry;
        parent: MediaQueryWithTypeWalkerParent;
        state?: T;
    }, index: number | string) => boolean | void, state?: T): false | undefined;
    toJSON(): {
        type: NodeType;
        string: string;
        modifier: CSSToken[];
        mediaType: CSSToken[];
        and: CSSToken[] | undefined;
        media: MediaCondition | undefined;
    };
    isMediaQueryWithType(): this is MediaQueryWithType;
    static isMediaQueryWithType(x: unknown): x is MediaQueryWithType;
}
type MediaQueryWithTypeWalkerEntry = MediaConditionWalkerEntry | MediaCondition;
type MediaQueryWithTypeWalkerParent = MediaConditionWalkerParent | MediaQueryWithType;
declare class MediaQueryWithoutType {
    type: NodeType;
    media: MediaCondition;
    constructor(media: MediaCondition);
    negateQuery(): MediaQuery;
    tokens(): Array<CSSToken>;
    toString(): string;
    indexOf(item: MediaCondition): number | string;
    at(index: number | string): MediaCondition | undefined;
    walk<T extends Record<string, unknown>>(cb: (entry: {
        node: MediaQueryWithoutTypeWalkerEntry;
        parent: MediaQueryWithoutTypeWalkerParent;
        state?: T;
    }, index: number | string) => boolean | void, state?: T): false | undefined;
    toJSON(): {
        type: NodeType;
        string: string;
        media: MediaCondition;
    };
    isMediaQueryWithoutType(): this is MediaQueryWithoutType;
    static isMediaQueryWithoutType(x: unknown): x is MediaQueryWithoutType;
}
type MediaQueryWithoutTypeWalkerEntry = MediaConditionWalkerEntry | MediaCondition;
type MediaQueryWithoutTypeWalkerParent = MediaConditionWalkerParent | MediaQueryWithoutType;
declare class MediaQueryInvalid {
    type: NodeType;
    media: Array<ComponentValue>;
    constructor(media: Array<ComponentValue>);
    negateQuery(): MediaQuery;
    tokens(): Array<CSSToken>;
    toString(): string;
    walk<T extends Record<string, unknown>>(cb: (entry: {
        node: MediaQueryInvalidWalkerEntry;
        parent: MediaQueryInvalidWalkerParent;
        state?: T;
    }, index: number | string) => boolean | void, state?: T): false | undefined;
    toJSON(): {
        type: NodeType;
        string: string;
        media: ComponentValue[];
    };
    isMediaQueryInvalid(): this is MediaQueryInvalid;
    static isMediaQueryInvalid(x: unknown): x is MediaQueryInvalid;
}
type MediaQueryInvalidWalkerEntry = ComponentValue;
type MediaQueryInvalidWalkerParent = ComponentValue | MediaQueryInvalid;
type Options = {
    preserveInvalidMediaQueries?: boolean;
    onParseError?: (error: ParseError) => void;
};
declare function parseFromTokens(tokens: Array<CSSToken>, options?: Options): MediaQuery[];
declare function parse(source: string, options?: Options): MediaQuery[];
declare class CustomMedia {
    type: NodeType;
    name: Array<CSSToken>;
    mediaQueryList: Array<MediaQuery> | null;
    trueOrFalseKeyword: Array<CSSToken> | null;
    constructor(name: Array<CSSToken>, mediaQueryList: Array<MediaQuery> | null, trueOrFalseKeyword?: Array<CSSToken>);
    getName(): string;
    getNameToken(): CSSToken | null;
    hasMediaQueryList(): boolean;
    hasTrueKeyword(): boolean;
    hasFalseKeyword(): boolean;
    tokens(): Array<CSSToken>;
    toString(): string;
    toJSON(): {
        type: NodeType;
        string: string;
        nameValue: string;
        name: CSSToken[];
        hasFalseKeyword: boolean;
        hasTrueKeyword: boolean;
        trueOrFalseKeyword: CSSToken[] | null;
        mediaQueryList: ({
            type: NodeType;
            string: string;
            modifier: CSSToken[];
            mediaType: CSSToken[];
            and: CSSToken[] | undefined;
            media: MediaCondition | undefined;
        } | {
            type: NodeType;
            string: string;
            media: MediaCondition;
        } | {
            type: NodeType;
            string: string;
            media: import("../../../css-parser-algorithms/dist").ComponentValue[];
        })[] | undefined;
    };
    isCustomMedia(): this is CustomMedia;
    static isCustomMedia(x: unknown): x is CustomMedia;
}
type Options$0 = {
    preserveInvalidMediaQueries?: boolean;
    onParseError?: (error: ParseError) => void;
};
declare function parseCustomMediaFromTokens(tokens: Array<CSSToken>, options?: Options$0): CustomMedia | false;
declare function parseCustomMedia(source: string, options?: Options$0): CustomMedia | false;
declare function isCustomMedia(x: unknown): x is GeneralEnclosed;
declare function isGeneralEnclosed(x: unknown): x is GeneralEnclosed;
declare function isMediaAnd(x: unknown): x is MediaAnd;
declare function isMediaConditionList(x: unknown): x is MediaConditionList;
declare function isMediaConditionListWithAnd(x: unknown): x is MediaConditionListWithAnd;
declare function isMediaConditionListWithOr(x: unknown): x is MediaConditionListWithOr;
declare function isMediaCondition(x: unknown): x is MediaCondition;
declare function isMediaFeatureBoolean(x: unknown): x is MediaFeatureBoolean;
declare function isMediaFeatureName(x: unknown): x is MediaFeatureName;
declare function isMediaFeatureValue(x: unknown): x is MediaFeatureValue;
declare function isMediaFeaturePlain(x: unknown): x is MediaFeaturePlain;
declare function isMediaFeatureRange(x: unknown): x is MediaFeatureRange;
declare function isMediaFeatureRangeNameValue(x: unknown): x is MediaFeatureRangeNameValue;
declare function isMediaFeatureRangeValueName(x: unknown): x is MediaFeatureRangeValueName;
declare function isMediaFeatureRangeValueNameValue(x: unknown): x is MediaFeatureRangeValueNameValue;
declare function isMediaFeature(x: unknown): x is MediaFeature;
declare function isMediaInParens(x: unknown): x is MediaInParens;
declare function isMediaNot(x: unknown): x is MediaNot;
declare function isMediaOr(x: unknown): x is MediaOr;
declare function isMediaQuery(x: unknown): x is MediaQuery;
declare function isMediaQueryWithType(x: unknown): x is MediaQueryWithType;
declare function isMediaQueryWithoutType(x: unknown): x is MediaQueryWithoutType;
declare function isMediaQueryInvalid(x: unknown): x is MediaQueryInvalid;
declare enum MediaQueryModifier {
    Not = "not",
    Only = "only"
}
declare function modifierFromToken(token: TokenIdent): MediaQueryModifier | false;
declare enum MediaType {
    /** Always matches */
    All = "all",
    Print = "print",
    Screen = "screen",
    /** Never matches */
    Tty = "tty",
    /** Never matches */
    Tv = "tv",
    /** Never matches */
    Projection = "projection",
    /** Never matches */
    Handheld = "handheld",
    /** Never matches */
    Braille = "braille",
    /** Never matches */
    Embossed = "embossed",
    /** Never matches */
    Aural = "aural",
    /** Never matches */
    Speech = "speech"
}
declare function typeFromToken(token: TokenIdent): MediaType | false;
declare function cloneMediaQuery<T extends MediaQueryWithType | MediaQueryWithoutType | MediaQueryInvalid>(x: T): T;
export { parse, parseFromTokens, parseCustomMedia, parseCustomMediaFromTokens, NodeType, isCustomMedia, isGeneralEnclosed, isMediaAnd, isMediaCondition, isMediaConditionList, isMediaConditionListWithAnd, isMediaConditionListWithOr, isMediaFeature, isMediaFeatureBoolean, isMediaFeatureName, isMediaFeaturePlain, isMediaFeatureRange, isMediaFeatureRangeNameValue, isMediaFeatureRangeValueName, isMediaFeatureRangeValueNameValue, isMediaFeatureValue, isMediaInParens, isMediaNot, isMediaOr, isMediaQuery, isMediaQueryInvalid, isMediaQueryWithType, isMediaQueryWithoutType, CustomMedia, GeneralEnclosed, MediaAnd, MediaCondition, MediaConditionListWithAnd, MediaConditionListWithOr, MediaFeature, newMediaFeatureBoolean, newMediaFeaturePlain, MediaFeatureBoolean, MediaFeatureEQ, MediaFeatureGT, MediaFeatureLT, invertComparison, matchesComparison, comparisonFromTokens, MediaFeatureName, MediaFeaturePlain, MediaFeatureRangeNameValue, MediaFeatureRangeValueName, MediaFeatureRangeValueNameValue, MediaFeatureValue, matchesRatio, matchesRatioExactly, MediaInParens, MediaNot, MediaOr, MediaQueryModifier, modifierFromToken, MediaQueryWithType, MediaQueryWithoutType, MediaQueryInvalid, MediaType, typeFromToken, cloneMediaQuery };
export type { MediaConditionList, MediaFeatureComparison, MediaFeatureRange, MediaQuery };
