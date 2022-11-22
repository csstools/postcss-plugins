// return custom selectors from the css root, conditionally removing them
export default function getCustomPropertiesFromRoot(root): Map<string, string> {
	// initialize custom selectors
	const customPropertiesFromHtmlElement: Map<string, string> = new Map();
	const customPropertiesFromRootPseudo: Map<string, string> = new Map();
	const out: Map<string, string> = new Map();

	// for each html or :root rule
	root.nodes.slice().forEach(rule => {
		const customPropertiesObject = isHtmlRule(rule)
			? customPropertiesFromHtmlElement
			: isRootRule(rule)
				? customPropertiesFromRootPseudo
				: null;

		// for each custom property
		if (customPropertiesObject) {
			rule.nodes.slice().forEach(decl => {
				if (decl.variable) {
					const { prop } = decl;

					// write the parsed value to the custom property
					customPropertiesObject.set(prop, decl.value);
				}
			});
		}
	});

	for (const [name, value] of customPropertiesFromHtmlElement.entries()) {
		out.set(name, value);
	}

	for (const [name, value] of customPropertiesFromRootPseudo.entries()) {
		out.set(name, value);
	}

	// return all custom properties, preferring :root properties over html properties
	return out;
}

// match html and :root rules
const htmlSelectorRegExp = /^html$/i;
const rootSelectorRegExp = /^:root$/i;

// whether the node is an html or :root rule
const isHtmlRule = node => node.type === 'rule' && node.selector.split(',').some(item => htmlSelectorRegExp.test(item)) && Object(node.nodes).length;
const isRootRule = node => node.type === 'rule' && node.selector.split(',').some(item => rootSelectorRegExp.test(item)) && Object(node.nodes).length;
