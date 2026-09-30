function generateHandler(replaceWith) {
	var selector;
	var remove;
	var add;
	var lastElements = [];

	if (replaceWith[0] === '.') {
		selector = replaceWith.slice(1);
		remove = function remove(el) {
			el.classList.remove(selector);
		};

		add = function add(el) {
			el.classList.add(selector);
		};
	} else {
		// A bit naive
		selector = replaceWith.slice(1, -1);

		remove = function remove(el) {
			el.removeAttribute(selector, '');
		};

		add = function add(el) {
			el.setAttribute(selector, '');
		};
	}

	return function handleFocusChange() {
		for (var i = 0; i < lastElements.length; i++) {
			remove(lastElements[i]);
		}
		lastElements.length = 0;

		var activeElement = document.activeElement;

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
	var options = {
		force: false,
		replaceWith: '[focus-within]',
	};

	if (typeof opts !== 'undefined' && 'force' in opts) {
		options.force = opts.force;
	}

	if (typeof opts !== 'undefined' && 'replaceWith' in opts) {
		options.replaceWith = opts.replaceWith;
	}

	try {
		document.querySelector(':focus-within');

		if (!options.force) {
			return;
		}
	} catch (_) {}

	var handleFocusChange = generateHandler(options.replaceWith);

	var initialize = function initializeEventListeners() {
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
