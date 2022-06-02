# Unreleased (major)

- Fixed: default export ([#409](https://github.com/csstools/postcss-plugins/issues/409))
- Fixed: doesn't consider attribute selectors (https://github.com/postcss/postcss-selector-not/issues/23)
- Fixed: unexpected results when `:not` is not a pseudo class function (https://github.com/postcss/postcss-selector-not/issues/28)

# 5.0.0 - 2021-01-31

- Added: Support for PostCSS v8.


# 4.0.1 - 2020-12-18

- Fixed: error when attribute selector containing :not (https://github.com/postcss/postcss-selector-not/pull/17)

# 4.0.0 - 2018-09-17

- Added: compatibility with postcss v7.x
- Added: compatibility with node v6.x

# 3.0.1 - 2017-05-15

- Fixed: incorrect export (https://github.com/postcss/postcss-selector-not/issues/8)

# 3.0.0 - 2017-05-11

- Added: compatibility with postcss v6.x

# 2.0.0 - 2015-08-25

- Removed: compatibility with postcss v4.x
- Added: compatibility with postcss v5.x

# 1.2.1 - 2015-06-16

- Fixed: selector was updated as an array, which is wrong.

# 1.2.0 - 2015-06-16

- Fixed: spec has been previously misinterpreted and now transform correctly
`:not()` level 4 to collapsed level 3
(https://github.com/postcss/postcss-selector-not/issues/1)
- Removed: `lineBreak` option (useless now)

# 1.1.0 - 2015-06-13

- Added: `lineBreak` option

# 1.0.2 - 2015-06-13

- Fixed: support of pseudo classes that use parenthesis

# 1.0.1 - 2015-04-30

- Fixed: the module now works in non babel environments

# 1.0.0 - 2015-04-30

✨ First release
