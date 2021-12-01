# Color unit tests.

Reading :
- https://github.com/w3c/csswg-drafts/issues/6816
- https://github.com/csstools/postcss-lab-function/issues/7
- https://github.com/w3c/csswg-drafts/issues/5191
- https://facelessuser.github.io/coloraide/

At the moment there is still unspecified behavior around color conversion from `lab`|`lch` to `rgb` or `color()`

[coloraide](https://facelessuser.github.io/coloraide/) is used to mimic browser behavior.
This allows us to quickly tweak the conversion and test the output against variants produced by coloraide.

coloraide requires `python3`.

```bash
# USAGE:
# python3 -m pip install coloraide
# python3 ./test/color/generate.py
```

