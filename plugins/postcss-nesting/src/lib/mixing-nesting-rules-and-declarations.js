// see : https://www.w3.org/TR/css-nesting-1/#mixing
export default function ensureCorrectMixingOfNestingRulesAndDeclarations(node) {
	const hasNestedChildren = node.some((child) => {
		return child.type === 'atrule' || child.type === 'rule'
	})

	if (!hasNestedChildren) {
		return
	}

	// Clone with only declarations
	const clone = node.cloneBefore()

	let encounteredNestedRule = false
	clone.each((child) => {
		if (child.type === 'atrule' || child.type === 'rule') {
			encounteredNestedRule = true
			child.remove()
			return
		}

		if (encounteredNestedRule) {
			// declarations after nesting rules are not allowed
			child.remove()
			return
		}
	})

	if (clone.nodes.length === 0) {
		clone.remove()
	}

	// Remove all declarations and preserve nesting rules
	encounteredNestedRule = false
	node.each((child) => {
		if (child.type === 'atrule' || child.type === 'rule') {
			return
		}

		child.remove()
	})

	if (node.nodes.length === 0) {
		node.remove()
	}
}
