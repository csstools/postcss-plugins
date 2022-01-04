# TODO :

_known short comings of the current iteration_

## Specificity :

Can we safely use `:not(#does-not-exist)`/`:not(does-not-exist)` as prefixes for selectors to get correct A/C specificity.

see : https://drafts.csswg.org/selectors-4/#specificity-rules


## Plugin order :

_old problem, but larger now that we encode the entire selector_

Because we now encode the entire selector there will be bugs caused by plugin order.
I don't currently have a good solution for this.

```css
a:has(.b) {
  margin-inline-start: 2px;
}
```

This can have different results if `postcss-logical` runs before or after `css-has-pseudo`.
We need to investigate if there are ways to always run as the final plugin.
