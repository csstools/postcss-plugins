---
title: You can now use true and false in custom media queries!
description: This allows you to easily debug a condition without a major refactor.
date: 2023-01-25
---

Since the release of [PostCSS Custom Media](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-media) version 9, you can now use `true` and `false` in your custom media queries. This allows you to easily debug a condition without a major refactor.

```css
@custom-media --tablet (width >= 48rem);
@custom-media --desktop (width >= 90rem);
@custom-media --dark true;

@media (--tablet) and (--dark) {
	body {
		color: cyan;
	}
}
```

Now you can easily test what the media query would look like if you were actually in Dark Mode. While there are developer tools that can help you with this, they lose the state if you close the for example or you might want to test another combination. 

Just remember to remove the `true` and `false` values before you ship your code!

```css
@custom-media --tablet (width >= 48rem);
@custom-media --desktop (width >= 90rem);
@custom-media --dark (prefers-color-scheme: dark);

@media (--tablet) and (--dark) {
	body {
		color: cyan;
	}
}
```
