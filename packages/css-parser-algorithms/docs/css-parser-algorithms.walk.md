<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@csstools/css-parser-algorithms](./css-parser-algorithms.md) &gt; [walk](./css-parser-algorithms.walk.md)

## walk() function

Walks each item in a list of component values all of their children.

**Signature:**

```typescript
export declare function walk<T extends Record<string, unknown>>(componentValues: Array<ComponentValue>, cb: (entry: {
    node: ComponentValue;
    parent: ContainerNode | {
        value: Array<ComponentValue>;
    };
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

componentValues


</td><td>

Array&lt;[ComponentValue](./css-parser-algorithms.componentvalue.md)<!-- -->&gt;


</td><td>


</td></tr>
<tr><td>

cb


</td><td>

(entry: { node: [ComponentValue](./css-parser-algorithms.componentvalue.md)<!-- -->; parent: [ContainerNode](./css-parser-algorithms.containernode.md) \| { value: Array&lt;[ComponentValue](./css-parser-algorithms.componentvalue.md)<!-- -->&gt;; }; state?: T; }, index: number \| string) =&gt; boolean \| void


</td><td>

The callback function to execute for each item. The function receives an object containing the current node (`node`<!-- -->), its parent (`parent`<!-- -->), and an optional `state` object. A second parameter is the index of the current node. The function can return `false` to stop the iteration.


</td></tr>
<tr><td>

state


</td><td>

T


</td><td>

_(Optional)_ An optional state object that can be used to pass additional information to the callback function. The state object is cloned for each iteration. This means that changes to the state object are not reflected in the next iteration. However changes are passed down to child node iterations.


</td></tr>
</tbody></table>

**Returns:**

false \| undefined

`false` if the iteration was halted, `undefined` otherwise.

## Example


```js
import { tokenize } from '@csstools/css-tokenizer';
import { parseListOfComponentValues, isSimpleBlockNode } from '@csstools/css-parser-algorithms';

const myCSS = `calc(1px * (5 / 2)) 10px`;

const componentValues = parseListOfComponentValues(tokenize({ css: myCSS }));

let state = { inSimpleBlock: false };
walk(componentValues, (entry) => {
	if (isSimpleBlockNode(entry)) {
		entry.state.inSimpleBlock = true;
		return;
	}

	if (entry.state.inSimpleBlock) {
		console.log(entry.node.toString()); // `5`, ...
	}
}, state);
```

