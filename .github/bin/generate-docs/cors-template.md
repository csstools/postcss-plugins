## CORS

⚠️ Applies to you if you load CSS from a different domain than the page.

In this case the CSS is treated as untrusted and will not be made available to the JavaScript polyfill.
The polyfill will not work without applying the correct configuration for CORS.

Example :

| page | css | CORS applies |
| --- | --- | --- |
| https://example.com/ | https://example.com/style.css | no |
| https://example.com/ | https://other.com/style.css | yes |


**You might see one of these error messages :**

Chrome :

> DOMException: Failed to read the 'cssRules' property from 'CSSStyleSheet': Cannot access rules

Safari :

> SecurityError: Not allowed to access cross-origin stylesheet

Firefox :

> DOMException: CSSStyleSheet.cssRules getter: Not allowed to access cross-origin stylesheet

To resolve CORS errors you need to take two steps :

- add an HTTP header `Access-Control-Allow-Origin: <your-value>` when serving your CSS file.
- add `crossorigin="anonymous"` to the `<link rel="stylesheet">` tag for your CSS file.

In a node server setting the HTTP header might look like this :

```js
// http://localhost:8080 is the domain of your page!
res.setHeader('Access-Control-Allow-Origin', 'https://example.com');
```

You can also configure a wildcard but please be aware that this might be a security risk.
It is better to only set the header for the domain you want to allow and only on the responses you want to allow.

HTML might look like this :

```html
<link rel="stylesheet" href="https://example.com/styles.css" crossorigin="anonymous">
```
