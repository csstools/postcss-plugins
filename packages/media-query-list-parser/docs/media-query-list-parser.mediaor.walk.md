<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@csstools/media-query-list-parser](./media-query-list-parser.md) &gt; [MediaOr](./media-query-list-parser.mediaor.md) &gt; [walk](./media-query-list-parser.mediaor.walk.md)

## MediaOr.walk() method

**Signature:**

```typescript
walk<T extends Record<string, unknown>>(cb: (entry: {
        node: MediaOrWalkerEntry;
        parent: MediaOrWalkerParent;
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

(entry: { node: [MediaOrWalkerEntry](./media-query-list-parser.mediaorwalkerentry.md)<!-- -->; parent: [MediaOrWalkerParent](./media-query-list-parser.mediaorwalkerparent.md)<!-- -->; state?: T; }, index: number \| string) =&gt; boolean \| void


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

