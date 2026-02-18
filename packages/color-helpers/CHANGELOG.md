# Changes to Color Helpers

### Unreleased (patch)

- Updated: gamut mapping algorithm

### 6.0.1

_January 25, 2026_

- Match latest changes made in `csswg-drafts` for:
  - `gam_2020`
  - `Lab_to_LCH`
  - `lin_2020`
  - `OKLab_to_OKLCH`
  - `sRGB_to_HSL`
  - `XYZ_D50_to_HWB`


### 6.0.0

_January 14, 2026_

- Updated: Support for Node `20.19.0` or later (major).
- Removed: `commonjs` API. In supported Node versions `require(esm)` will work without needing to make code changes.

### 5.1.0

_August 22, 2025_

- Add `lin_P3_to_XYZ_D50`
- Add `XYZ_D50_to_lin_P3`

### 5.0.2

_February 23, 2025_

- Use `Number.isNaN` instead of `NaN` for consistency.

### 5.0.1

_August 14, 2024_

- fix `XYZ_D50_to_HWB` to not do corrections for out of gamut colors.

### 5.0.0

_August 3, 2024_

- Updated: Support for Node v18+ (major).

### 4.2.1

_June 29, 2024_

- Optimize matrix multiplication

### 4.2.0

_April 21, 2024_

- Add `mapGamutRayTrace` function

### 4.1.0

_March 31, 2024_

- Add `contrast_ratio_wcag_2_1` function

### 4.0.0

_December 15, 2023_

- Remove barrel files
- Fix type definitions
- Use higher precision color conversion matrices.

### 3.0.2

_September 2, 2023_

- Undo the changes from `3.0.1`.

### 3.0.1

_August 28, 2023_

- Clamp negative saturation in `hsl` to `0`.

### 3.0.0

_July 3, 2023_

- Change license to `MIT-0` ([read more about this change in the blog post](https://preset-env.cssdb.org/blog/license-change/))

### 2.1.0

_May 19, 2023_

- Fix gamut mapping
- Fix `XYZ_D50_to_ProPhoto`
- Export `sRGB_to_HWB`

### 2.0.0

_March 25, 2023_

- Removed certain implementation specific helpers. Keeping this package more focussed on general purpose color transformations.
- Added `xyz` specific helpers. These make it easy to transform to and from `xyz-d50` and any other color space.

### 1.0.0

_February 2, 2023_

- Initial version
