/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-vars */
/* global MutationObserver,requestAnimationFrame,document,self */

function polyfillQuerySelectorHas(global) {
	try {
		// test for scope support
		document.querySelector(':has(*, :does-not-exist, > *)');
	} catch (_) {
		// ELEMENT
		// polyfill Element#querySelector
		var querySelectorWithHasElement = polyfill(self.Element.prototype.querySelector);

		self.Element.prototype.querySelector = function querySelector(selectors) {
			return querySelectorWithHasElement.apply(this, arguments);
		};

		// polyfill Element#querySelectorAll
		var querySelectorAllWithHasElement = polyfill(self.Element.prototype.querySelectorAll);

		self.Element.prototype.querySelectorAll = function querySelectorAll(selectors) {
			return querySelectorAllWithHasElement.apply(this, arguments);
		};

		// polyfill Element#matches
		if (self.Element.prototype.matches) {
			var matchesWithHasElement = polyfill(self.Element.prototype.matches);

			self.Element.prototype.matches = function matches(selectors) {
				return matchesWithHasElement.apply(this, arguments);
			};
		}

		// polyfill Element#closest
		if (self.Element.prototype.closest) {
			var closestWithHasElement = polyfill(self.Element.prototype.closest);

			self.Element.prototype.closest = function closest(selectors) {
				return closestWithHasElement.apply(this, arguments);
			};
		}

		// DOCUMENT
		if ('Document' in global && 'prototype' in self.Document) {
			// polyfill Document#querySelector
			var querySelectorWithHasDocument = polyfill(self.Document.prototype.querySelector);

			self.Document.prototype.querySelector = function querySelector(selectors) {
				return querySelectorWithHasDocument.apply(this, arguments);
			};

			// polyfill Document#querySelectorAll
			var querySelectorAllWithHasDocument = polyfill(self.Document.prototype.querySelectorAll);

			self.Document.prototype.querySelectorAll = function querySelectorAll(selectors) {
				return querySelectorAllWithHasDocument.apply(this, arguments);
			};

			// polyfill Document#matches
			if (self.Document.prototype.matches) {
				var matchesWithHasDocument = polyfill(self.Document.prototype.matches);

				self.Document.prototype.matches = function matches(selectors) {
					return matchesWithHasDocument.apply(this, arguments);
				};
			}

			// polyfill Document#closest
			if (self.Document.prototype.closest) {
				var closestWithHasDocument = polyfill(self.Document.prototype.closest);

				self.Document.prototype.closest = function closest(selectors) {
					return closestWithHasDocument.apply(this, arguments);
				};
			}
		}

		function pseudoClassHasInnerQuery(query) {
			var current = '';
			var depth = 0;

			var escaped = false;
			var inHas = false;
			for (var i = 0; i < query.length; i++) {
				var char = query[i];

				if (escaped) {
					current += char;
					escaped = false;
					continue;
				}

				if (current === ':has(' && !inHas) {
					inHas = true;
					current = '';
				}

				switch (char) {
					case ':':
						if (!inHas) {
							current = '';
						}

						current += char;
						continue;
					case '(':
						if (inHas) {
							depth++;
						}
						current += char;
						continue;
					case ')':
						if (inHas) {
							if (depth === 0) {
								return current;
							}

							depth--;
						}
						current += char;
						continue;
					case '\\':
						current += char;
						escaped = true;
						continue;

					default:
						current += char;
						continue;
				}
			}

			return false;
		}

		function queryContainsScopePseudoClass(query) {
			var current = '';
			var escaped = false;
			for (var i = 0; i < query.length; i++) {
				var char = query[i];

				if (escaped) {
					current += char;
					escaped = false;
					continue;
				}

				if (current === ':scope' && !(/^\w/.test(query[i+1] || ''))) {
					return true;
				}

				switch (char) {
					case ':':
						current = '';
						current += char;
						continue;
					case '\\':
						current += char;
						escaped = true;
						continue;

					default:
						current += char;
						continue;
				}
			}

			return false;
		}

		function charIsNestedMarkMirror(char, mark) {
			if (mark === '(' && char === ')') {
				return true;
			}

			if (mark === '[' && char === ']') {
				return true;
			}

			return false;
		}

		function splitSelector(query) {
			var selectors = [];
			var current = '';

			var escaped = false;

			var quoted = false;
			var quotedMark = false;

			var nestedMark = false;
			var nestedDepth = 0;

			for (var i = 0; i < query.length; i++) {
				var char = query[i];

				if (escaped) {
					current += char;
					escaped = false;
					continue;
				}

				switch (char) {
					case ',':
						if (quoted) {
							current += char;
							continue;
						}

						if (nestedDepth > 0) {
							current += char;
							continue;
						}

						selectors.push(current);
						current = '';
						continue;
					case '\\':
						current += char;
						escaped = true;
						continue;

					case '"':
					case '\'':
						if (quoted && char === quotedMark) {
							current += char;
							quoted = false;
							continue;
						}

						current += char;
						quoted = true;
						quotedMark = char;
						continue;

					case '(':
					case ')':
					case '[':
					case ']':
						if (quoted) {
							current += char;
							continue;
						}

						if (charIsNestedMarkMirror(char, nestedMark)) {
							current += char;
							nestedDepth--;

							if (nestedDepth === 0) {
								nestedMark = false;
							}

							continue;
						}

						if (char === nestedMark) {
							current += char;
							nestedDepth++;
							continue;
						}

						current += char;
						nestedDepth++;
						nestedMark = char;
						continue;

					default:
						current += char;
						continue;
				}
			}

			selectors.push(current);

			return selectors;
		}

		function replaceAllWithTempAttr(query, callback) {
			var inner = pseudoClassHasInnerQuery(query);
			if (!inner) {
				return query;
			}

			var innerQuery = inner;
			var attr = 'q-has' + Math.floor(Math.random() * 9000000) + 1000000;
			var innerReplacement = '[' + attr + ']';

			var x = query;

			if (inner.indexOf(':has(') > -1) {
				innerQuery = replaceAllWithTempAttr(inner, callback);
			}

			x = x.replace(':has(' + inner + ')', innerReplacement);
			callback(innerQuery, attr);
			if (x.indexOf(':has(') > -1) {
				var y = replaceAllWithTempAttr(x, callback);
				if (y) {
					return y;
				}
			}

			return x;
		}

		function walkNode(rootNode, callback) {
			if (('setAttribute' in (rootNode)) && ('querySelector' in (rootNode))) {
				callback(rootNode);
			}

			if (rootNode.hasChildNodes()) {
				var nodes = rootNode.childNodes;
				for (var i = 0; i < nodes.length; ++i) {
					walkNode(nodes[i], callback);
				}
			}
		}

		function polyfill(qsa, returnAfterFirst) {
			return function (selectors) {
				if ((selectors.indexOf(':has(') === -1) || !pseudoClassHasInnerQuery(selectors)) {
					return qsa.apply(this, arguments);
				}

				var rootNode;
				if ('getRootNode' in this) {
					rootNode = this.getRootNode();
				} else {
					var r = this;
					while (r) {
						rootNode = r;
						r = r.parentNode;
					}
				}

				var attrs = [];
				var newQuery = replaceAllWithTempAttr(selectors, function (inner, attr) {
					attrs.push(attr);

					var selectorParts = splitSelector(inner);
					for (var x = 0; x < selectorParts.length; x++) {
						var selectorPart = selectorParts[x].trim();
						var absoluteSelectorPart = selectorPart;

						if (
							selectorPart[0] === '>' ||
							selectorPart[0] === '+' ||
							selectorPart[0] === '~'
						) {
							absoluteSelectorPart = selectorPart.slice(1).trim();
						} else if (!queryContainsScopePseudoClass(selectorPart)) {
							absoluteSelectorPart = ':scope ' + selectorPart;
						}

						try {
							walkNode(rootNode, function (node) {
								if (!(node.querySelector(absoluteSelectorPart))) {
									return;
								}

								switch (selectorPart[0]) {
									case '~':
									case '+':
										{
											var siblings = node.childNodes;
											for (var i = 0; i < siblings.length; i++) {
												var sibling = siblings[i];
												if (!('setAttribute' in sibling)) {
													continue;
												}

												var idAttr1 = 'q-has-id' + Math.floor(Math.random() * 9000000) + 1000000;
												sibling.setAttribute(idAttr1, '');

												if (node.querySelector(':scope [' + idAttr1 + ']' + ' ' + selectorPart)) {
													sibling.setAttribute(attr, '');
												}

												sibling.removeAttribute(idAttr1);
											}
										}
										break;

									case '>':
										{
											var idAttr2 = 'q-has-id' + Math.floor(Math.random() * 9000000) + 1000000;
											node.setAttribute(idAttr2, '');

											if (node.querySelector(':scope[' + idAttr2 + ']' + ' ' + selectorPart)) {
												node.setAttribute(attr, '');
											}

											node.removeAttribute(idAttr2);
										}
										break;

									default:
										node.setAttribute(attr, '');

										break;
								}
							});
						} catch (_) {
							// `:has` takes a forgiving selector list.
						}
					}
				});

				arguments[0] = newQuery;

				// results of the qsa
				var elementOrNodeList = qsa.apply(this, arguments);

				// remove the fallback attribute
				var attrsForQuery = [];
				for (var j = 0; j < attrs.length; j++) {
					attrsForQuery.push('[' + attrs[j] + ']');
				}

				var elements = document.querySelectorAll(attrsForQuery.join(','));
				for (var k = 0; k < elements.length; k++) {
					var element = elements[k];
					for (var l = 0; l < attrs.length; l++) {
						element.removeAttribute(attrs[l]);
					}
				}

				// return the results of the qsa
				return elementOrNodeList;
			};
		}
	}
}

export default function cssHasPseudo(document, options) {
	if (!options) {
		options = {};
	}

	options = {
		hover: (!!options.hover) || false,
	};

	polyfillQuerySelectorHas();

	const observedItems = [];

	// document.createAttribute() doesn't support `:` in the name. innerHTML does
	const attributeElement = document.createElement('x');

	// walk all stylesheets to collect observed css rules
	[].forEach.call(document.styleSheets, walkStyleSheet);
	transformObservedItems();

	// observe DOM modifications that affect selectors
	const mutationObserver = new MutationObserver(mutationsList => {
		mutationsList.forEach(mutation => {
			[].forEach.call(mutation.addedNodes || [], node => {
				// walk stylesheets to collect observed css rules
				if (node.nodeType === 1 && node.sheet) {
					walkStyleSheet(node.sheet);
				}
			});

			// transform observed css rules
			cleanupObservedCssRules();
			transformObservedItems();
		});
	});

	mutationObserver.observe(document, { childList: true, subtree: true });

	// observe DOM events that affect pseudo-selectors
	document.addEventListener('focus', transformObservedItems, true);
	document.addEventListener('blur', transformObservedItems, true);
	document.addEventListener('input', transformObservedItems);

	if (options.hover) {
		document.addEventListener('mouseover', transformObservedItems);
	}

	// transform observed css rules
	function transformObservedItems () {
		requestAnimationFrame(() => {
			observedItems.forEach(
				item => {
					const nodes = [];

					[].forEach.call(
						document.querySelectorAll(item.originalSelector),
						element => {
							// memorize the node
							nodes.push(element);

							// set an attribute with an irregular attribute name
							// document.createAttribute() doesn't support special characters
							attributeElement.innerHTML = '<x ' + item.attributeName + '>';

							element.setAttributeNode(attributeElement.children[0].attributes[0].cloneNode());

							// trigger a style refresh in IE and Edge
							document.documentElement.style.zoom = 1; document.documentElement.style.zoom = null;
						},
					);

					// remove the encoded attribute from all nodes that no longer match them
					item.nodes.forEach(node => {
						if (nodes.indexOf(node) === -1) {
							node.removeAttribute(item.attributeName);

							// trigger a style refresh in IE and Edge
							document.documentElement.style.zoom = 1; document.documentElement.style.zoom = null;
						}
					});

					// update the
					item.nodes = nodes;
				},
			);
		});
	}

	// remove any observed cssrules that no longer apply
	function cleanupObservedCssRules () {
		[].push.apply(
			observedItems,
			observedItems.splice(0).filter(
				item => item.rule.parentStyleSheet &&
					item.rule.parentStyleSheet.ownerNode &&
					document.documentElement.contains(item.rule.parentStyleSheet.ownerNode),
			),
		);
	}

	// walk a stylesheet to collect observed css rules
	function walkStyleSheet (styleSheet) {
		try {
			// walk a css rule to collect observed css rules
			[].forEach.call(styleSheet.cssRules || [], rule => {
				if (rule.selectorText) {
					// decode the selector text in all browsers to:
					// [1] = :scope, [2] = :not(:has), [3] = :has relative, [4] = :scope relative
					const selectors = decodeURIComponent(rule.selectorText.replace(/\\(.)/g, '$1')).match(/^(.*?)\[:(not-)?has\((.+?)\)\](.*?)$/);

					if (selectors) {
						const attributeName = ':' + (selectors[2] ? 'not-' : '') + 'has(' +
							// encode a :has() pseudo selector as an attribute name
							encodeURIComponent(selectors[3]).replace(/%3A/g, ':').replace(/%5B/g, '[').replace(/%5D/g, ']').replace(/%2C/g, ',') +
							')';

						let hasQuery = ':has(' + selectors[3] + ')';
						if (selectors[2]) {
							hasQuery = ':not(' + hasQuery + ')';
						}

						observedItems.push({
							rule,
							originalSelector: selectors[1] + hasQuery,
							scopeSelector: selectors[1],
							isNot: selectors[2],
							relativeSelectors: selectors[3].split(/\s*,\s*/),
							attributeName,
							nodes: [],
						});
					}
				} else {
					walkStyleSheet(rule);
				}
			});
		} catch (error) {
			/* do nothing and continue */
		}
	}
}
