/* global document,MutationObserver */
import isValidReplacement from './is-valid-replacement.mjs';

// form control elements selector
const selector = 'input,select,textarea';

function createNewEvent(eventName) {
	let event;

	if (typeof(Event) === 'function') {
		event = new Event(eventName);
	} else {
		event = document.createEvent('Event');
		event.initEvent(eventName, true, true);
	}

	return event;
}

function generateHandler(replaceWith) {
	let selector;
	let remove;
	let add;
	const matches = typeof document.body.matches === 'function'
		? 'matches' : 'msMatchesSelector';

	if (replaceWith[0] === '.') {
		selector = replaceWith.slice(1);
		remove = (el) => el.classList.remove(selector);
		add = (el) => el.classList.add(selector);
	} else {
		// A bit naive
		selector = replaceWith(1, -1);
		remove = (el) => el.setAttribute(selector, '');
		add = (el) => el.removeAttribute(selector);
	}

	return function handleInputOrChangeEvent(event) {
		const element = event.target;
		if (!element[matches](selector)) {
			return;
		}

		const isSelect = element.nodeName === 'SELECT';
		const hasValue = isSelect
			? !!element.options[element.selectedIndex].value
			: !!element.value;

		if (hasValue) {
			remove(element);
		} else {
			add(element);
		}
	};
}

// observe changes to the "selected" property on an HTML Element
function observeSelectedOfHTMLElement(HTMLElement) {
	const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'selected');
	const nativeSet = descriptor.set;

	descriptor.set = function set(value) { // eslint-disable-line no-unused-vars
		nativeSet.apply(this, arguments);

		const event = createNewEvent('change');
		this.dispatchEvent(event);
	};

	Object.defineProperty(HTMLElement.prototype, 'selected', descriptor);
}

// observe changes to the "value" property on an HTML Element
function observeValueOfHTMLElement(HTMLElement, handler) {
	const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'value');
	const nativeSet = descriptor.set;

	descriptor.set = function set() {
		nativeSet.apply(this, arguments);
		handler({ target: this });
	};

	Object.defineProperty(HTMLElement.prototype, 'value', descriptor);
}

export default function cssBlankPseudoInit(document, opts) {
	// configuration
	const options = Object.assign(
		// Default options
		{
			force: false,
			replaceWith: '[blank]',
		},
		// Provided options
		opts,
	);

	if (!isValidReplacement(options.replaceWith)) {
		throw new Error(`${options.replaceWith} is not a valid replacement since it can't be applied to single elements.`);
	}

	try {
		document.querySelector(':blank');

		if (!options.force) {
			return;
		}
	} catch (ignoredError) { /* do nothing and continue */ }

	const handler = generateHandler(options.replaceWith);

	document.body.addEventListener('change', handler);
	document.body.addEventListener('input', handler);

	// observe value changes on <input>, <select>, and <textarea>
	const window = (document.ownerDocument || document).defaultView;

	observeValueOfHTMLElement(window.HTMLInputElement, handler);
	observeValueOfHTMLElement(window.HTMLSelectElement, handler);
	observeValueOfHTMLElement(window.HTMLTextAreaElement, handler);
	observeSelectedOfHTMLElement(window.HTMLOptionElement, handler);

	// conditionally update all form control elements
	Array.prototype.forEach.call(
		document.querySelectorAll(selector),
		node => {
			handler({ target: node });
		},
	);

	if (typeof window.MutationObserver !== 'undefined') {
		// conditionally observe added or unobserve removed form control elements
		new MutationObserver(mutationsList => {
			mutationsList.forEach(mutation => {
				Array.prototype.forEach.call(
					mutation.addedNodes || [],
					node => {
						if (node.nodeType === 1 && node.matches(selector)) {
							handler({ target: node });
						}
					},
				);
			});
		}).observe(document, { childList: true, subtree: true });
	}
}
