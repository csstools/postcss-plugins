export declare function parseAtImport(params: string): false | {
    uri: string;
    fullUri: string;
    layer?: undefined;
    media?: undefined;
    supports?: undefined;
} | {
    uri: string;
    fullUri: string;
    layer: string | undefined;
    media: string | undefined;
    supports: string | undefined;
};
