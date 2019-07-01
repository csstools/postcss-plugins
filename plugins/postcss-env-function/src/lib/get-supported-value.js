import isAtrule from './is-atrule';
import isDecl from './is-decl';

// returns a value from an at-rule or declaration
export default (node) => isAtrule(node) ? node.params : isDecl(node) ? node.value : null;
