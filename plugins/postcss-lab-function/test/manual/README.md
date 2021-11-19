# Manual test

```sh
node ./test/manual/generate-lab.js
node ./test/manual/generate-lch.js
```

Generates an html file with color swatches in both `lab()` and `rgb()`.
Only Safari supports `lab()` at this point but this already allows us to compare in a browser.
