# Changes to PostCSS Custom Functions

### Unreleased (major)

- Initial version
- Definitions without conditional rules or a cascade layer are inlined into the calling rule instead of emitting extra rules
- bound the total number of generated declarations to prevent exponential expansion from exhausting memory or CPU
- warn instead of aborting the build when the cascade layer order can not be collected
