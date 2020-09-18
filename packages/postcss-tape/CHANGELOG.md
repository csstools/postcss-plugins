# Changes to PostCSS Tape

### 6.0.0 (September 18, 2020)

- Supports PostCSS 7 _and_ 8 (_major_)
- Supports Node 10+ (_major_)
- Supports configurations from (in order) `postcss-tape.config.js`,
  `postcss-tape.config.mjs`, `postcss-tape.config.cjs`, `.tape.js`, `.tape.mjs`,
  and `.tape.cjs`.

### 5.0.2 (July 29, 2019)

- Fixed: Issue loading a test plugin

### 5.0.1 (July 29, 2019)

- Fixed: Tests for an error
- Fixed: Documentation errors

### 5.0.0 (May 16, 2019)

- Updated: Node 8+ compatibility (major)
- Fixed: Better support warnings and errors

### 4.0.0 (December 22, 2018)

- Changes the nested `postcss-plugin: { "test-name": {} }` with
`{ "test-name": {} }`.
- Supports a `--ci true` mode for full logging

I’ve rewritten the plugin in less lines of code and hopefully more clearly.
I had a lot of trouble following the old version, so it’s very hard to know
what changes there are. I also accidentally published an incompatible version,
so version 3 is skipped for 4.

### 2.2.0 (November 2, 2017)

- Added: New `processOptions` option for controlling the PostCSS process

### 2.1.0 (September 16, 2017)

- Added: New `plugin` methods for specifying alternative plugin(s)
- Added: Support for running all tests even if some fail

### 2.0.1 (May 9, 2017)

- Updated: Travis compatibility

### 2.0.0 (May 8, 2017)

- Added: Node v4.x compatibility
- Added: Sequential testing
- Added: New `before` and `after` methods
- Added: New `source`, `expect`, and `result` overrides

### 1.3.0 (December 14, 2016)

- Added: Check errors with `RegExp`

### 1.2.1 (December 14, 2016)

- Updated: Throw existing error
- Updated: Run `after` even if test fails

### 1.2.0 (December 14, 2016)

- Added: Expected `error` option
- Added: `after` command to run option

### 1.1.0 (December 8, 2016)

- Added: Support `plugins#process` with separate arguments

### 1.0.1 (December 6, 2016)

- Added: Initial version
