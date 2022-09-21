# TODO

Implemented from : https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/

A CSS tokenizer that strictly follows the spec.

Goals :
- only a tokenizer. I want to use the tokenizer of CSSTree but I don't want the other 1.5mb that come with it. This is a recurring problem. Most good CSS tokenizers are embedded in other packages.
- just follows the spec without having any opinions about anything.
- must be transformable
- must be able to serialize from a constructed AST
- must be able to serialize from a parsed AST (without any mutation or data loss)
- tokens must have the same interface as the PostCSS tokenizer. This does not mean that tokens will be equivalent or that the tokenizer will have the exact same interface.
- maintainable
- understandable if you place the code next to the specification

Non goals : 
- performance (we can make it fast later)
- ease of use (a good API requires opinionated code, I am trying to avoid this)

This will be a mashup of my previous work on a [CSS tokenizer in Go](https://github.com/romainmenke/css) and the API surface of the PostCSS tokenizer.

Example :

```js
import { tokenizer } from '@csstools/css-tokenizer';

const myCSS =  `@media only screen and (min-width: 768rem) {
	.foo {
		content: 'Some content!' !important;
	}
}
`;

const t = tokenizer({
	css: myCSS,
});

while (true) {
	const token = t.nextToken();
	if (token[0] === 'EOF-token') {
		break;
	}

	console.log(token);
}
```
