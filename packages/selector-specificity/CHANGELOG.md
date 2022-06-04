# Changes to Selector Specificity

### 2.0.0 (June 3, 2022)

- Breaking: use only named exports instead of `default`
- Added: `compare(a, b)` function to compare selectors by specificity

```diff
- `import selectorSpecificity from '@csstools/selector-specificity';`
+ `import { selectorSpecificity } from '@csstools/selector-specificity';`
```

### 1.0.0 (April 26, 2022)

- Initial version
