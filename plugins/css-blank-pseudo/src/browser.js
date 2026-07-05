// form control elements selector
function isFormControlElement(element) {
	if (element.nodeName === 'INPUT' || element.nodeName === 'SELECT' || element.nodeName === 'TEXTAREA') {
		return true;
	}

	return false;
}

function createNewEvent(eventName) {
	var event;

	if (typeof(Event) === 'function') {
		event = new Event(eventName, { bubbles: true });
	} else {
		event = document.createEvent('Event');
		event.initEvent(eventName, true, false);
	}

	return event;
}

function generateHandler(replaceWith) {
	var selector;
	var remove;
	var add;

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

	return function handleInputOrChangeEvent(event) {
		var element = event.target;
		if (!isFormControlElement(element)) {
			return;
		}

		var isSelect = element.nodeName === 'SELECT';
		var hasValue = isSelect
			? (element.options[element.selectedIndex] && !!element.options[element.selectedIndex].value)
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
	var descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'selected');
	var nativeSet = descriptor.set;

	descriptor.set = function set(value) { // eslint-disable-line no-unused-vars
		nativeSet.apply(this, arguments);

		var event = createNewEvent('change');
		this.parentElement.dispatchEvent(event);
	};

	Object.defineProperty(HTMLElement.prototype, 'selected', descriptor);
}

// observe changes to the "value" property on an HTML Element
function observeValueOfHTMLElement(HTMLElement, handler) {
	var descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'value');
	var nativeSet = descriptor.set;

	descriptor.set = function set() {
		nativeSet.apply(this, arguments);
		handler({ target: this });
	};

	Object.defineProperty(HTMLElement.prototype, 'value', descriptor);
}

export default function cssBlankPseudoInit(opts) {
	// configuration
	var options = {
		force: false,
		replaceWith: '[blank]',
	};

	if (typeof opts !== 'undefined' && 'force' in opts) {
		options.force = opts.force;
	}

	if (typeof opts !== 'undefined' && 'replaceWith' in opts) {
		options.replaceWith = opts.replaceWith;
	}

	try {
		document.querySelector(':blank');

		if (!options.force) {
			return;
		}
	} catch (_) {}

	var handler = generateHandler(options.replaceWith);
	var bindEvents = function bindEvents() {
		if (document.body) {
			document.body.addEventListener('change', handler);
			document.body.addEventListener('input', handler);
		}
	};
	var updateAllCandidates = function updateAllCandidates() {
		var elements = document.querySelectorAll('input, select, textarea');

		for (var i = 0; i < elements.length; i++) {
			handler({ target: elements[i] });
		}
	};

	if (document.body) {
		bindEvents();
	} else {
		window.addEventListener('load', bindEvents);
	}

	if (document.documentElement.className.indexOf('js-blank-pseudo') === -1) {
		document.documentElement.className += ' js-blank-pseudo';
	}

	observeValueOfHTMLElement(self.HTMLInputElement, handler);
	observeValueOfHTMLElement(self.HTMLSelectElement, handler);
	observeValueOfHTMLElement(self.HTMLTextAreaElement, handler);
	observeSelectedOfHTMLElement(self.HTMLOptionElement);

	// conditionally update all form control elements
	updateAllCandidates();

	if (typeof self.MutationObserver !== 'undefined') {
		// conditionally observe added or unobserve removed form control elements
		new MutationObserver(function (mutationsList) {
			for (var j = 0; j < mutationsList.length; j++) {
				var mutation = mutationsList[j];

				for (var k = 0; k < mutation.addedNodes.length; k++) {
					var node = mutation.addedNodes[k];

					if (node.nodeType === 1 && isFormControlElement(node)) {
						handler({ target: node });
					}
				}
			}
		}).observe(document, { childList: true, subtree: true });
	} else {
		window.addEventListener('load', updateAllCandidates);
		window.addEventListener('DOMContentLoaded', updateAllCandidates);
	}
}
