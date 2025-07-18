<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@csstools/css-tokenizer](./css-tokenizer.md) &gt; [tokenizer](./css-tokenizer.tokenizer.md)

## tokenizer() function

Create a tokenizer for a CSS string.

**Signature:**

```typescript
export declare function tokenizer(input: {
    css: {
        valueOf(): string;
    };
    unicodeRangesAllowed?: boolean;
}, options?: {
    onParseError?: (error: ParseError) => void;
}): {
    nextToken: () => CSSToken;
    endOfFile: () => boolean;
};
```

## Parameters

<table><thead><tr><th>

Parameter


</th><th>

Type


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

input


</td><td>

{ css: { valueOf(): string; }; unicodeRangesAllowed?: boolean; }


</td><td>


</td></tr>
<tr><td>

options


</td><td>

{ onParseError?: (error: [ParseError](./css-tokenizer.parseerror.md)<!-- -->) =&gt; void; }


</td><td>

_(Optional)_


</td></tr>
</tbody></table>

**Returns:**

{ nextToken: () =&gt; [CSSToken](./css-tokenizer.csstoken.md)<!-- -->; endOfFile: () =&gt; boolean; }

