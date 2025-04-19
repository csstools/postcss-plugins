import type { AtRule, Container, Declaration, Document, Rule } from 'postcss';
import type { ContainerWithChildren } from 'postcss/lib/container';

const NULL_CHAR = String.fromCodePoint(0x000);

export function randomCacheKeyFromPostcssDeclaration(decl: Declaration): {
	/**
 * The name of the property the random function is used in.
 */
	propertyName: string

	/**
	 * N is the index of the random function among other random functions in the same property value.
	 */
	propertyN: number

	/**
	 * An element ID identifying the element the style is being applied to.
	 */
	elementID: string

	/**
	 * A document ID identifying the Document the styles are from.
	 */
	documentID: string
} {
	let elementID = '';

	let ancestor: Document | ContainerWithChildren | Container | undefined = decl.parent;
	while (ancestor) {
		switch (ancestor.type) {
			case "rule":
				elementID += NULL_CHAR + 'selector' + NULL_CHAR + (ancestor as Rule).selector + NULL_CHAR;
				break;
			case "atrule":
				if ((ancestor as AtRule).name === 'scope') {
					elementID += NULL_CHAR + 'prelude' + NULL_CHAR + (ancestor as AtRule).params + NULL_CHAR;
				}
				break;

			default:
				break;
		}

		ancestor = ancestor.parent
	}

	return {
		propertyName: decl.prop,
		propertyN: 0,
		elementID: elementID,
		documentID: decl.source?.input.css ?? decl.root().toString(),
	}
}
