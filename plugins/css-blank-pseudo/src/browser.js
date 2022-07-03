/* global document,window,self,MutationObserver */
import isValidReplacement from './is-valid-replacement.mjs';

// form control elements selector
function isFormControlElement(element) {
	if (element.nodeName === 'INPUT' || element.nodeName === 'SELECT' || element.nodeName === 'TEXTAREA') {
		return true;
	}

	return false;
}

function createNewEvent(eventName) {
	let event;

	if (typeof(Event) === 'function') {
		event = new Event(eventName, { bubbles: true });
	} else {
		event = document.createEvent('Event');
		event.initEvent(eventName, true, false);
	}

	return event;
}

function generateHandler(replaceWith) {
	let selector;
	let remove;
	let add;

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

	return function handleInputOrChangeEvent(event) {
		const element = event.target;
		if (!isFormControlElement(element)) {
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
		this.parentElement.dispatchEvent(event);
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

export default function cssBlankPseudoInit(opts) {
	const options = {
		force: false,
		replaceWith: '[blank]',
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
		document.querySelector(':blank');

		if (!options.force) {
			return;
		}
	} catch (ignoredError) { /* do nothing and continue */ }

	const handler = generateHandler(options.replaceWith);

	if (document.body) {
		document.body.addEventListener('change', handler);
		document.body.addEventListener('input', handler);
	} else {
		window.addEventListener('load', () => {
			if (document.body) {
				document.body.addEventListener('change', handler);
				document.body.addEventListener('input', handler);
			}
		});
	}

	observeValueOfHTMLElement(self.HTMLInputElement, handler);
	observeValueOfHTMLElement(self.HTMLSelectElement, handler);
	observeValueOfHTMLElement(self.HTMLTextAreaElement, handler);
	observeSelectedOfHTMLElement(self.HTMLOptionElement, handler);

	// conditionally update all form control elements
	Array.prototype.forEach.call(
		document.querySelectorAll('input, select, textarea'),
		node => {
			handler({ target: node });
		},
	);

	if (typeof self.MutationObserver !== 'undefined') {
		// conditionally observe added or unobserve removed form control elements
		new MutationObserver(mutationsList => {
			mutationsList.forEach(mutation => {
				Array.prototype.forEach.call(
					mutation.addedNodes || [],
					node => {
						if (node.nodeType === 1 && isFormControlElement(node)) {
							handler({ target: node });
						}
					},
				);
			});
		}).observe(document, { childList: true, subtree: true });
	} else {
		window.addEventListener('load', () => {
			Array.prototype.forEach.call(
				document.querySelectorAll('input, select, textarea'),
				node => {
					handler({ target: node });
				},
			);
		});

		window.addEventListener('DOMContentLoaded', () => {
			Array.prototype.forEach.call(
				document.querySelectorAll('input, select, textarea'),
				node => {
					handler({ target: node });
				},
			);
		});
	}
}
