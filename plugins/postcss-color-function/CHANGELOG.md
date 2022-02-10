# Changes to PostCSS Color Function

### Unreleased (minor)

- Add support for `none` color component.
- Add tests for percentage values in non-xyz color spaces.
- Ignore percentage values in xyz color space as they are not supported.

```css
.none-color-component {
	color: color(display-p3 none none 1);
}

/* becomes */

.none-color-component {
	color: rgb(0,0,255);
}
```

### 1.0.0 (February 7, 2022)

- Initial version
