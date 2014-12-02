# 2.1.1 - 2014-12-02

- Fix issue when multiples undefined custom properties are referenced ([#16](https://github.com/postcss/postcss-custom-properties/issues/16))

# 2.1.0 - 2014-11-25

- Enhanced exceptions & messages

# 2.0.0 - 2014-11-12

- Upgrade to postcss 3

# 1.0.2 - 2014-11-04

- More clear message for warning about custom prop used in non top-level :root

# 1.0.1 - 2014-11-03

- fix warning about custom prop used in non :root

# 1.0.0 - 2014-11-02

- Add warning when a custom prop is used in another place than :root
- handle !important

# 0.4.0 - 2014-09-30

- JS-defined properties override CSS-defined

# 0.3.1 - 2014-08-27

- Nested custom properties usages are now correctly resolved
- Undefined var doesn't throw error anymore (just a console warning) & are kept as is in the output

# 0.3.0 - 2014-08-26

- Fallback now are always added by default ([see why](http://www.w3.org/TR/css-variables/#invalid-variables))
- `map` option renamed to `variables`

# 0.2.0 - 2014-08-22

- Add `map` option
- GNU style error message

# 0.1.0 - 2014-08-01

First release based on [rework-vars](https://github.com/reworkcss/rework-vars) v3.1.1
