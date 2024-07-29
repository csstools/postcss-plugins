/**
 * Verify that the published contents of your node package will pass a basic smoke test.
 *
 * @example
 * ```sh
 * node --test
 * ```
 *
 * ```js
 * // test/pack.test.mjs
 * import { testPack } from '@csstools/pack-test';
 *
 * await testPack("your-module-name");
 * ```
 *
 * @packageDocumentation
 */

export declare function testPack(moduleName: string): Promise<void>;

export { }
