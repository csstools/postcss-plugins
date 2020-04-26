import { parse } from 'postcss-values-parser'
import options from './options'

export default decl => {
	// alignment
	const alignment = decl.prop.match(placeMatch)[1]

	// value ast and child nodes
	const value = parse(decl.value)
	let alignmentValues = []
	value.walkWords(walk => {
		alignmentValues.push(
			walk.parent.type === 'root' ? walk.toString() : walk.parent.toString()
		)
	})

	decl.cloneBefore({
		prop: `align-${alignment}`,
		value: alignmentValues[0]
	})

	decl.cloneBefore({
		prop: `justify-${alignment}`,
		value: alignmentValues[1] || alignmentValues[0]
	})

	// conditionally remove place-[alignment]
	if (!options.preserve) {
		decl.remove()
	}
}

export const placeMatch = /^place-(content|items|self)/
