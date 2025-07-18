<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@csstools/css-tokenizer](./css-tokenizer.md) &gt; [ParseError](./css-tokenizer.parseerror.md)

## ParseError class

The CSS Tokenizer is forgiving and will never throw on invalid input. Any errors are reported through the `onParseError` callback.

**Signature:**

```typescript
export declare class ParseError extends Error 
```
**Extends:** Error

## Constructors

<table><thead><tr><th>

Constructor


</th><th>

Modifiers


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[(constructor)(message, sourceStart, sourceEnd, parserState)](./css-tokenizer.parseerror._constructor_.md)


</td><td>


</td><td>

Constructs a new instance of the `ParseError` class


</td></tr>
</tbody></table>

## Properties

<table><thead><tr><th>

Property


</th><th>

Modifiers


</th><th>

Type


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[parserState](./css-tokenizer.parseerror.parserstate.md)


</td><td>


</td><td>

Array&lt;string&gt;


</td><td>

The parser steps that preceded the error.


</td></tr>
<tr><td>

[sourceEnd](./css-tokenizer.parseerror.sourceend.md)


</td><td>


</td><td>

number


</td><td>

The index of the end character of the current token.


</td></tr>
<tr><td>

[sourceStart](./css-tokenizer.parseerror.sourcestart.md)


</td><td>


</td><td>

number


</td><td>

The index of the start character of the current token.


</td></tr>
</tbody></table>

