import isValidReplacement from './is-valid-replacement.mjs';
function generateHandler(replaceWith) {
	let selector;
	let remove;
	let add;
	const lastElements = [];

	if (replaceWith[0] === '.') {
		selector = replaceWith.slice(1);
		remove = (el) => el.classList.remove(selector);
		add = (el) => el.classList.add(selector);
	} else {
		// A bit naive
		selector = replaceWith.slice(1, -1);
		remove = (el) => el.removeAttribute(selector, '');
		add = (el) => el.setAttribute(selector, '');
	}

	return function handleFocusChange() {
		lastElements.forEach(lastElement => remove(lastElement));
		lastElements.length = 0;

		let activeElement = document.activeElement;

		// only add focus if it has not been added and is not the document element
		if (!/^(#document|HTML|BODY)$/.test(Object(activeElement).nodeName)) {
			while (activeElement && activeElement.nodeType === 1) {
				add(activeElement);
				lastElements.push(activeElement);

				activeElement = activeElement.parentNode;
			}
		}
	};
}

export default function focusWithin(opts) {
	// configuration
	const options = {
		force: false,
		replaceWith: '[focus-within]',
	};

	if (typeof opts !== 'undefined' && 'force' in opts) {
		options.force = opts.force;
	}

	if (typeof opts !== 'undefined' && 'replaceWith' in opts) {
		options.replaceWith = opts.replaceWith;
	}

	if (!isValidReplacement(options.replaceWith)) {
		throw new Error(`${options.replaceWith} is not a valid replacement since it can't be applied to single elements.`);
	}

	try {
		document.querySelector(':focus-within');

		if (!options.force) {
			return;
		}
	} catch (_) {}

	const handleFocusChange = generateHandler(options.replaceWith);

	const initialize = function initializeEventListeners() {
		if (document.documentElement.className.indexOf('js-focus-within') > -1) {
			return;
		}

		document.documentElement.className = document.documentElement.className + ' js-focus-within';
		document.addEventListener('focus', handleFocusChange, true);
		document.addEventListener('blur', handleFocusChange, true);
	};

	if (document.readyState === 'complete') {
		initialize();
	} else {
		document.addEventListener('DOMContentLoaded', initialize);
	}
}
