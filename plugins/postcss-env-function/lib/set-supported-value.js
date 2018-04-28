import isAtrule from './is-atrule';
import isDecl from './is-decl';

// assigns a value to an at-rule or declaration
export default function (node, value) {
	if (isAtrule(node)) {
		node.params = value;
	}

	if (isDecl(node)) {
		node.value = value;
	}
}
