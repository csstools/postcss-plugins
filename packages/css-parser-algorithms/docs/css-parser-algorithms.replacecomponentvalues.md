<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@csstools/css-parser-algorithms](./css-parser-algorithms.md) &gt; [replaceComponentValues](./css-parser-algorithms.replacecomponentvalues.md)

## replaceComponentValues() function

Replace specific component values in a list of component values. A helper for the most common and simplistic cases when mutating an AST.

**Signature:**

```typescript
export declare function replaceComponentValues(componentValuesList: Array<Array<ComponentValue>>, replaceWith: (componentValue: ComponentValue) => Array<ComponentValue> | ComponentValue | void): Array<Array<ComponentValue>>;
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

componentValuesList


</td><td>

Array&lt;Array&lt;[ComponentValue](./css-parser-algorithms.componentvalue.md)<!-- -->&gt;&gt;


</td><td>


</td></tr>
<tr><td>

replaceWith


</td><td>

(componentValue: [ComponentValue](./css-parser-algorithms.componentvalue.md)<!-- -->) =&gt; Array&lt;[ComponentValue](./css-parser-algorithms.componentvalue.md)<!-- -->&gt; \| [ComponentValue](./css-parser-algorithms.componentvalue.md) \| void


</td><td>


</td></tr>
</tbody></table>

**Returns:**

Array&lt;Array&lt;[ComponentValue](./css-parser-algorithms.componentvalue.md)<!-- -->&gt;&gt;

