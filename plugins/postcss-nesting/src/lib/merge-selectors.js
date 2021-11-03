import { replaceable } from './valid-selector.js'

export default function mergeSelectors(fromSelectors, toSelectors) {
	return toSelectors.map((toSelector) => {
		let needsIsOnFromSelector = false

		if (fromSelectors.length > 1) {
			needsIsOnFromSelector = true
		}

		// foo &foo foo & baz -> foo &:is(foo) foo & baz
		toSelector = toSelector.replace(/&((?:[\w-_|])(?:[^\s,{]*))/g, (match, p1) => {
			return `&:is(${p1})`
		})

		// foo& -> foo:is(&)
		if (fromSelectors.length === 1 && /^(?:[\w-_|])/.test(fromSelectors[0])) {
			toSelector = toSelector.replace(/([\w-_|]+)(?:&)/g, (match, p1) => {
				return `${p1}:is(&)`
			})
		}

		return needsIsOnFromSelector
				? toSelector.replace(replaceable, `:is(${fromSelectors.join(', ')})`)
				: toSelector.replace(replaceable, fromSelectors.join(', '))
	})
}
