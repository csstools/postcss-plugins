import '@mrhenry/core-web/modules/~element-qsa-has.js';
import extractEncodedSelectors from './encode/extract.mjs';
import encodeCSS from './encode/encode.mjs';

function hasNativeSupport() {
	try {
		if (!('CSS' in self) || !('supports' in self.CSS) || !self.CSS.supports('selector(:has(div))')) {
			return false;
		}

	} catch (_) {
		return false;
	}

	return true;
}

export default function cssHasPseudo(document, options) {
	// OPTIONS
	{
		if (!options) {
			options = {};
		}

		options = {
			hover: (!!options.hover) || false,
			debug: (!!options.debug) || false,
			observedAttributes: options.observedAttributes || [],
			forcePolyfill: (!!options.forcePolyfill) || false,
		};

		options.mustPolyfill = options.forcePolyfill || !hasNativeSupport();

		if (!Array.isArray(options.observedAttributes)) {
			options.observedAttributes = [];
		}

		options.observedAttributes = options.observedAttributes.filter(function(x) {
			return (typeof x === 'string');
		});

		// https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
		// `data-*` and `style` were omitted
		options.observedAttributes = options.observedAttributes.concat(['accept', 'accept-charset', 'accesskey', 'action', 'align', 'allow', 'alt', 'async', 'autocapitalize', 'autocomplete', 'autofocus', 'autoplay', 'buffered', 'capture', 'challenge', 'charset', 'checked', 'cite', 'class', 'code', 'codebase', 'cols', 'colspan', 'content', 'contenteditable', 'contextmenu', 'controls', 'coords', 'crossorigin', 'csp', 'data', 'datetime', 'decoding', 'default', 'defer', 'dir', 'dirname', 'disabled', 'download', 'draggable', 'enctype', 'enterkeyhint', 'for', 'form', 'formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget', 'headers', 'hidden', 'high', 'href', 'hreflang', 'http-equiv', 'icon', 'id', 'importance', 'integrity', 'intrinsicsize', 'inputmode', 'ismap', 'itemprop', 'keytype', 'kind', 'label', 'lang', 'language', 'list', 'loop', 'low', 'manifest', 'max', 'maxlength', 'minlength', 'media', 'method', 'min', 'multiple', 'muted', 'name', 'novalidate', 'open', 'optimum', 'pattern', 'ping', 'placeholder', 'poster', 'preload', 'radiogroup', 'readonly', 'referrerpolicy', 'rel', 'required', 'reversed', 'rows', 'rowspan', 'sandbox', 'scope', 'scoped', 'selected', 'shape', 'size', 'sizes', 'slot', 'span', 'spellcheck', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'summary', 'tabindex', 'target', 'title', 'translate', 'type', 'usemap', 'value', 'width', 'wrap']);
	}

	const observedItems = [];

	// document.createAttribute() doesn't support `:` in the name. innerHTML does
	const attributeElement = document.createElement('x');

	// walk all stylesheets to collect observed css rules
	[].forEach.call(document.styleSheets, walkStyleSheet);
	if (!options.mustPolyfill) {
		// Cleanup of rules will have happened in `walkStyleSheet`
		// Native support will take over from here
		return;
	}

	transformObservedItemsThrottled();

	// observe DOM modifications that affect selectors
	if ('MutationObserver' in self) {
		const mutationObserver = new MutationObserver(function(mutationsList) {
			mutationsList.forEach(function(mutation) {
				[].forEach.call(mutation.addedNodes || [], function(node) {
					// walk stylesheets to collect observed css rules
					if (node.nodeType !== 1) {
						return;
					}

					if (node.sheet) {
						walkStyleSheet(node.sheet);
						return;
					}

					node.addEventListener('load', function (e) {
						if (e.target && e.target.sheet) {
							walkStyleSheet(e.target.sheet);
						}
					});
				});

				// transform observed css rules
				cleanupObservedCssRules();
				transformObservedItemsThrottled();
			});
		});

		mutationObserver.observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: options.observedAttributes });
	}

	// observe DOM events that affect pseudo-selectors
	document.addEventListener('focus', transformObservedItemsThrottled, true);
	document.addEventListener('blur', transformObservedItemsThrottled, true);
	document.addEventListener('input', transformObservedItemsThrottled);
	document.addEventListener('change', transformObservedItemsThrottled, true);

	if (options.hover) {
		if ('onpointerenter' in document) {
			document.addEventListener('pointerenter', transformObservedItemsThrottled, true);
			document.addEventListener('pointerleave', transformObservedItemsThrottled, true);
		} else {
			document.addEventListener('mouseover', transformObservedItemsThrottled, true);
			document.addEventListener('mouseout', transformObservedItemsThrottled, true);
		}
	}

	// observe Javascript setters that effect pseudo-selectors
	if ('defineProperty' in Object && 'getOwnPropertyDescriptor' in Object && 'hasOwnProperty' in Object) {
		try {
			function observeProperty(proto, property) {
				// eslint-disable-next-line no-prototype-builtins
				if (proto.hasOwnProperty(property)) {
					const descriptor = Object.getOwnPropertyDescriptor(proto, property);
					if (descriptor && descriptor.configurable && 'set' in descriptor) {
						Object.defineProperty(proto, property, {
							configurable: descriptor.configurable,
							enumerable: descriptor.enumerable,
							get: function () {
								return descriptor.get.apply(this, arguments);
							},
							set: function () {
								descriptor.set.apply(this, arguments);

								try {
									transformObservedItemsThrottled();
								} catch (_) {
									// should never happen as there is an inner try/catch
									// but just in case
								}
							},
						});
					}
				}
			}

			if ('HTMLElement' in self && HTMLElement.prototype) {
				observeProperty(HTMLElement.prototype, 'disabled');
			}

			// Not all of these elements have all of these properties.
			// But the code above checks if they exist first.
			['checked', 'selected', 'readOnly', 'required'].forEach(function(property) {
				[
					'HTMLButtonElement',
					'HTMLFieldSetElement',
					'HTMLInputElement',
					'HTMLMeterElement',
					'HTMLOptGroupElement',
					'HTMLOptionElement',
					'HTMLOutputElement',
					'HTMLProgressElement',
					'HTMLSelectElement',
					'HTMLTextAreaElement',
				].forEach(function(elementName) {
					if (elementName in self && self[elementName].prototype) {
						observeProperty(self[elementName].prototype, property);
					}
				});
			});
		} catch (e) {
			if (options.debug) {
				// eslint-disable-next-line no-console
				console.error(e);
			}
		}
	}

	let transformObservedItemsThrottledBusy = false;
	function transformObservedItemsThrottled() {
		if (transformObservedItemsThrottledBusy) {
			cancelAnimationFrame(transformObservedItemsThrottledBusy);
		}

		transformObservedItemsThrottledBusy = requestAnimationFrame(function() {
			transformObservedItems();
		});
	}

	// transform observed css rules
	function transformObservedItems() {
		observedItems.forEach(function(item) {
			const nodes = [];

			let matches = [];
			if (item.selector) {
				try {
					matches = document.querySelectorAll(item.selector);
				} catch (e) {
					if (options.debug) {
						// eslint-disable-next-line no-console
						console.error(e);
					}
					return;
				}
			}

			[].forEach.call(matches, function(element) {
				// memorize the node
				nodes.push(element);

				// set an attribute with an irregular attribute name
				// document.createAttribute() doesn't support special characters
				attributeElement.innerHTML = '<x ' + item.attributeName + '>';

				element.setAttributeNode(attributeElement.children[0].attributes[0].cloneNode());

				// trigger a style refresh in IE and Edge
				document.documentElement.style.zoom = 1; document.documentElement.style.zoom = null;
			});

			// remove the encoded attribute from all nodes that no longer match them
			item.nodes.forEach(function(node) {
				if (nodes.indexOf(node) === -1) {
					node.removeAttribute(item.attributeName);

					// trigger a style refresh in IE and Edge
					document.documentElement.style.zoom = 1; document.documentElement.style.zoom = null;
				}
			});

			// update the
			item.nodes = nodes;
		});
	}

	// remove any observed cssrules that no longer apply
	function cleanupObservedCssRules() {
		[].push.apply(
			observedItems,
			observedItems.splice(0).filter(function(item) {
				return item.rule.parentStyleSheet &&
					item.rule.parentStyleSheet.ownerNode &&
					document.documentElement.contains(item.rule.parentStyleSheet.ownerNode);
			}),
		);
	}

	// walk a stylesheet to collect observed css rules
	function walkStyleSheet(styleSheet) {
		try {
			// walk a css rule to collect observed css rules
			for (let i = (styleSheet.cssRules.length - 1); i >= 0; i--) {
				let rule = styleSheet.cssRules[i];

				if (rule.selectorText) {
					rule.selectorText = rule.selectorText.replace(/\.js-has-pseudo\s/g, '');

					try {
						// decode the selector text in all browsers to:
						const hasSelectors = extractEncodedSelectors(rule.selectorText.toString());
						if (hasSelectors.length === 0) {
							continue;
						}

						if (!options.mustPolyfill) {
							styleSheet.deleteRule(i);
							continue;
						}

						for (let j = 0; j < hasSelectors.length; j++) {
							const hasSelector = hasSelectors[j];
							if (hasSelector) {
								observedItems.push({
									rule: rule,
									selector: hasSelector,
									attributeName: encodeCSS(hasSelector),
									nodes: [],
								});
							}
						}
					} catch (e) {
						if (options.debug) {
							// eslint-disable-next-line no-console
							console.error(e);
						}
					}
				} else {
					walkStyleSheet(rule);
				}
			}
		} catch (e) {
			if (options.debug) {
				// eslint-disable-next-line no-console
				console.error(e);
			}
		}
	}
}
