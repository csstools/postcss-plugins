export interface walkable {
    walk(cb: (entry: {
        node: Array<unknown> | unknown;
        parent: unknown;
    }, index: number | string) => boolean | void): any;
}
export declare function gatherNodeAncestry(node: walkable): Map<unknown, unknown>;
