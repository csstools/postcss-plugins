import { complex, replaceable } from './valid-selector.js'

export default function mergeSelectors(fromSelectors, toSelectors) {
	return fromSelectors.reduce(
		(selectors, fromSelector) => selectors.concat(
			toSelectors.map(
				(toSelector) => complex.test(toSelector)
					? toSelector.replace(replaceable, `:is(${fromSelector})`)
				: toSelector.replace(replaceable, fromSelector)
			)
		),
		[]
	)
}
