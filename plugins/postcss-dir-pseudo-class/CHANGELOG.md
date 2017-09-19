# Changes to PostCSS :dir()

### 2.1.0 (September 19, 2017)

- Fixed: Enforcement of presumed direction, e.g. `html:dir([dir="rtl"])`
- Updated: Browserslist and PostCSS
- Improved: How options are safely called, i.e. `Object(opts)`

### 2.0.0 (July 24, 2017)

- Changed: Method of presumed direction from `:root` to `html:not([dir])`

### 1.1.0 (June 2, 2017)

- Added: Support for browserslist and a 'browsers' option
- Added: Support for a presumed direction via the 'browsers' option

### 1.0.0 (May 30, 2017)

- Initial version
