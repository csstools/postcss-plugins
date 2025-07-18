# Changes to PostCSS Nesting

### 13.0.2

_June 10, 2025_

- Updated [`@csstools/selector-resolve-nested`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-resolve-nested) to [`3.1.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-resolve-nested/CHANGELOG.md#310) (minor)

### 13.0.1

_October 23, 2024_

- Make sorting compound selectors forwards compatible with potential future changes in `postcss-selector-parser`
- Updated: `postcss-selector-parser`
- Updated [`@csstools/selector-resolve-nested`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-resolve-nested) to [`3.0.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-resolve-nested/CHANGELOG.md#300) (major)
- Updated [`@csstools/selector-specificity`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity) to [`5.0.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity/CHANGELOG.md#500) (major)

### 13.0.0

_August 3, 2024_

- Make edition `2024-02` the default (major).
- Updated: Support for Node v18+ (major).
- Updated [`@csstools/selector-resolve-nested`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-resolve-nested) to [`2.0.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-resolve-nested/CHANGELOG.md#200) (major)
- Updated [`@csstools/selector-specificity`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity) to [`4.0.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity/CHANGELOG.md#400) (major)

### 12.1.5

_May 23, 2024_

- Fix nested rules within `@scope`

### 12.1.4

_May 13, 2024_

- Updated [`@csstools/selector-specificity`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity) to [`3.1.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity/CHANGELOG.md#311) (patch)

### 12.1.3

_May 11, 2024_

- Updated [`@csstools/selector-specificity`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity) to [`3.1.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity/CHANGELOG.md#310) (minor)

### 12.1.2

_April 21, 2024_

- Edition `2024-02`:
  - Do not rewrite selectors for declarations in conditional rules to a form with `:is()`

This will work:
```css
::before, ::after {
	color: blue;

	@media screen { color: cyan; }
}
```

This still **wont** work:
```css
::before, ::after {
	color: blue;

	&:hover { color: cyan; }
}
```

### 12.1.1

_March 31, 2024_

- Updated [`@csstools/selector-specificity`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity) to [`3.0.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity/CHANGELOG.md#303) (patch)

### 12.1.0

_March 6, 2024_

- Add the `edition` plugin option to control which CSS nesting specification version should be used. The default is `2021` but you can also set it to the newer `2024-02` edition to have more modern behavior.

### 12.0.4

_February 26, 2024_

- Fix order of final CSS with complex usage of both nesting and mixins, by @pciarach

### 12.0.3

_February 19, 2024_

- Updated [`@csstools/selector-specificity`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity) to [`3.0.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity/CHANGELOG.md#302) (patch)

### 12.0.2

_December 15, 2023_

- Fix type definitions
- Updated [`@csstools/selector-specificity`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity) to [`3.0.1`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity/CHANGELOG.md#301) (patch)

### 12.0.1

_August 5, 2023_

- Fix nesting of `@starting-style` rules

### 12.0.0

_July 3, 2023_

- Change license to `MIT-0` ([read more about this change in the blog post](https://preset-env.cssdb.org/blog/license-change/))
- Updated [`@csstools/selector-specificity`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity) to [`3.0.0`](https://github.com/csstools/postcss-plugins/tree/main/packages/selector-specificity/CHANGELOG.md#300) (major)

### 11.3.0

_June 14, 2023_

- Add support for nested selectors that that begin with a letter
- Add warning when using the deprecated `@nest` rule
	- you can silence this warning with a new `silenceAtNestWarning` plugin option
	- you can migrate your code to the latest syntax with our [Stylelint Plugin](https://github.com/csstools/postcss-plugins/tree/main/plugins-stylelint/no-at-nest-rule#csstoolsstylelint-no-at-nest-rule)

### 11.2.2

_March 25, 2023_

- Improved: support for mixins

### 11.2.1

_February 16, 2023_

- Skip nested rules that have a selector that begins with a letter
- Better warning when nested rules have a selector that begins with a letter

### 11.2.0

_February 13, 2023_

- Added: support for `&` at the root
- Improved: support for mixins

### 11.1.0

_January 31, 2023_

- Implement latest specification
  - relative selector syntax
  - `@nest` is obsolete, all selectors can be written without it (sometimes you will need `:is()`)
  - allow declarations after nested rules.

⚠️ We advice everyone to migrate their codebase **now** to nested CSS without `@nest`.  
Future versions of this plugin will warn and then error on `@nest`.

### 11.0.1

_January 28, 2023_

- Improve `types` declaration in `package.json`

### 11.0.0

_January 24, 2023_

- Updated: Support for Node v14+ (major).
- Fix: Do not throw when a selector is invalid, show a warning instead.
- Removed: Support for Deno (breaking)

### 10.2.0

_September 14, 2022_

- Added: TypeScript typings

### 10.1.10

_June 30, 2022_

- Partially revert the changes to pseudo element selectors from 10.1.9.

```diff
.anything::before {
	@nest .something_else > & {
		order: 1;
	}
}

/* becomes */

- .something_else > :is(.anything::before) { /* 10.1.9 */
+ .something_else > .anything::before { /* previous and restored behavior */
		order: 1;
}
```

The exact behavior of this pattern is unspecified and might change in the future.
We are reverting to the previous behavior until the specification is clarified.

### 10.1.9

_June 23, 2022_

- Fix selector order with any pseudo element.
- Fix semicolons being removed [#497](https://github.com/csstools/postcss-plugins/issues/497).

### 10.1.8

_June 4, 2022_

- Update `@csstools/selector-specificity` (major)

### 10.1.7

_May 20, 2022_

- Add tentative support for `@layer`. The actual behavior is poorly defined and may change in the future. Use with caution.

### 10.1.6

_May 17, 2022_

 - Fix selector order with `:before` and other pseudo elements.

### 10.1.5

_May 11, 2022_

- Use `@csstools/selector-specificity` for specificity calculations.

### 10.1.4

_April 4, 2022_

- Improved : compound selector order with pseudo elements
- Improved : selector specificity calculation.

### 10.1.3

_March 4, 2022_

- Avoid creating duplicate selectors containing only comments.

```diff
.alpha {
	/* loose comment */
	& .beta {
		order: 1;
	}
}

/* becomes */

- .alpha {
-   /* loose comment */
- }
+ /* loose comment */
.alpha .beta {
	order: 1;
}
```

### 10.1.2

_January 12, 2022_

- Improved : selector specificity calculation

### 10.1.1

_January 2, 2022_

- Removed Sourcemaps from package tarball.
- Moved CLI to CLI Package. See [announcement](https://github.com/csstools/postcss-plugins/discussions/121).

### 10.1.0

_December 22, 2021_

- Added: `noIsPseudoSelector` plugin option.
- Changed: `:is()` pseudo is now avoided as much as possible by default.
- Updated: documentation

[more info on noIsPseudoSelector](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting#noispseudoselector)

```js
postcssNesting({
	noIsPseudoSelector: true
})
```

### 10.0.3

_December 13, 2021_

- Updated: documentation

### 10.0.2

_November 18, 2021_

- Fixed: Support for Deno. Ensuring we pack `mod.js` so it can be accessible by CDNs.

### 10.0.1

_November 17, 2021_

- Removed: Support for `allowDeclarationsAfterNestedRules`.

We've realised that enforcing this rule from the spec was going to be problematic
in the long run given how plugins work and the whole ecosystem around mixins and
other features. Treating this as a patch given that this was introduced in the
previous version and was starting to break projects that were using other features.

### 10.0.0

_November 16, 2021_

- Added: Support for `allowDeclarationsAfterNestedRules` to deviate from spec.
- Added: `.npmrc` file.

- Updated: Aligning completely with the [spec](https://www.w3.org/TR/css-nesting-1/) updates.
- Updated: `esbuild` to 0.13.12 (minor)

- Removed: Support for PostCSS 7

### 9.0.0

_October 27, 2021_

- Added: Support for Deno
- Fixed: Issue with PostCSS 8 compatibility using the RuleExit listener

### 8.0.1

_May 1, 2021_

- Fixed: Compatibility issue with CommonJS.

### 8.0.0

_April 26, 2021_

- Updated: Support for PostCSS 8+.
- Updated: Support for Node v12+.
- Updated: Support for the `@container` at-rule.

### 7.0.1

_July 29, 2018_

- Fixed: Non-breaking issue with rules being unnecessarily split

### 7.0.0

_September 17, 2018_

- Updated: Support for PostCSS v7+
- Updated: Support for Node v6+

In a comment, a CSSWG member expressed interest in handling nested `@media`
while handling selector nesting. Since the specification has yet to be added
to the official CSSWG repository, nested at-rule deprecation is further delayed.

### 6.0.0

_June 9, 2018_

- Deprecated: Nested at-rules like `@media` will no longer work in 7.0.0
- Refactored code to improve efficiency

### 5.0.0

_March 24, 2018_

- Refactored code to use Imports babel-transformed for Node v4 compatibility

### 4.2.1

_September 19, 2017_

- Updated: Exposing the transform function as its own for postcss-extend

### 4.2.0

_September 18, 2017_

- Added: Reduced splitting of rules

### 4.1.0

_August 19, 2017_

- Added: Mutation-safe walk method
- Improved: Complex selector validity testing
- Thanks: A special thanks to @JLHwung for these improvements

### 4.0.1

_May 22, 2017_

- Improved: Selector validity testing

### 4.0.0

_May 20, 2017_

- Changed: Transform only compliant nesting
- Added: Preserve more raws formatting

### 3.0.0

_May 8, 2017_

- Added: Node 4.x support
- Added: PostCSS 6 support
- Added: Preserved ordering
- Removed: Node 0.12 support

### 2.3.1

_March 16, 2016_

- Updated: Allow any direct nesting that follows the syntactic constraints
- Updated: PostCSS 5.0.6
- Updated: Tests
- Updated: Dependencies
- Updated: Project configuration

### 2.3.0

_February 20, 2016_

- Updated: JavaScript formatting, linting, tests, and documentation
- Updated: Properly concatenate at-rules with or expressions
- Updated: Update internal plugin name to postcss-nesting

### 2.2.0

_January 30, 2016_

- Added: Nesting of all at-rules
- Updated: Direct nesting order maintains order
- Updated: Tests and documentation

### 2.1.1

_January 3, 2016_

- Updated: Project conventions

### 2.1.0

_January 3, 2016_

- Added: Support for valid direct nesting

### 2.0.6

_October 15, 2015_

- Fixed: Issue with new PostCSS rules

### 2.0.5

_October 12, 2015_

- Updated: Nested rules source map to the parent rule
- Updated: PostCSS 5.0.9
- Updated: Tests and documentation
- Updated: Project configuration

### 2.0.4

_September 23, 2015_

- Updated: Map source raws

### 2.0.3

_September 22, 2015_

- Updated: Refactored plugin
- Updated: Tests
- Updated: PostCSS 5.0.6

### 2.0.2

_September 16, 2015_

- Fixed: Issue where the new rule’s children were not mapped to the parent internally

### 2.0.1

_September 16, 2015_

- Fixed: Issue where  a `@nest` rule followed by another bubbling at-rule would not bubble
- Added: CONTRIBUTING.md

### 2.0.0

_September 16, 2015_

- Added: Requirement of `&` per the specification
- Added: New prefix option
- Added: `@document` and `@supports` as bubbles
- Updated: Documentation

### 1.0.0

_September 15, 2015_

- Added: New `@nest` at-rule syntax
- Updated: PostCSS 5
- Removed: Old inner bracket syntax

### 0.1.0

_June 17, 2015_

- Added: Initial release
