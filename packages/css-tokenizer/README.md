# TODO

A CSS tokenizer that strictly follows the spec.

Goals :
- only a tokenizer. I want to use the tokenizer of CSSTree but I don't want the other 1.5mb that come with it. This is a recurring problem. Most good CSS tokenizers are embedded in other packages.
- just follows the spec without having any opinions about anything.
- must be transformable
- must be able to serialize from a constructed AST
- must be able to serialize from a parsed AST (without any mutation or data loss)
- must have the same interface as the PostCSS tokenizer.

This will be a mashup of my previous work on a [CSS tokenizer in Go](https://github.com/romainmenke/css) and the API surface of the PostCSS tokenizer.
