<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@csstools/media-query-list-parser](./media-query-list-parser.md) &gt; [MediaInParens](./media-query-list-parser.mediainparens.md) &gt; [walk](./media-query-list-parser.mediainparens.walk.md)

## MediaInParens.walk() method

**Signature:**

```typescript
walk<T extends Record<string, unknown>>(cb: (entry: {
        node: MediaInParensWalkerEntry;
        parent: MediaInParensWalkerParent;
        state?: T;
    }, index: number | string) => boolean | void, state?: T): false | undefined;
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

cb


</td><td>

(entry: { node: [MediaInParensWalkerEntry](./media-query-list-parser.mediainparenswalkerentry.md)<!-- -->; parent: [MediaInParensWalkerParent](./media-query-list-parser.mediainparenswalkerparent.md)<!-- -->; state?: T; }, index: number \| string) =&gt; boolean \| void


</td><td>


</td></tr>
<tr><td>

state


</td><td>

T


</td><td>

_(Optional)_


</td></tr>
</tbody></table>

**Returns:**

false \| undefined

