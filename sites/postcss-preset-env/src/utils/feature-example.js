import postcss from 'postcss';

function postcssToHTML(root, builder) {
	function toString (node) {
		if ('atrule' === node.type) {
			return atruleToString(node);
		} if ('rule' === node.type) {
			return ruleToString(node);
		} else if ('decl' === node.type) {
			return declToString(node);
		} else if ('comment' === node.type) {
			return commentToString(node);
		} else {
			return node.nodes ? node.nodes.map(childNodes => toString(childNodes)).join('') : '';
		}
	}

	function replaceVars (string) {
		return string
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/:?--[\w-]+/g, '<span class=css-var>$&</span>');
	}

	function replaceVarsAndFns (string) {
		return replaceVars(string)
			.replace(/(:?[\w-]+)\(/g, '<span class=css-function>$1</span>(')
			.replace(/"[^"]+"/g, '<span class=css-string>$&</span>');
	}

	function atruleToString (atrule) {
		return `${atrule.raws.before||''}<span class=css-atrule><span class=css-atrule-name>@${atrule.name}</span>${atrule.raws.afterName||''}<span class=css-atrule-params>${replaceVarsAndFns(atrule.params)}</span>${atrule.raws.between||''}${atrule.nodes?`<span class=css-block>{${atrule.nodes.map(node => toString(node)).join('')}${atrule.raws.after||''}}</span>`:';'}</span>`;
	}

	function ruleToString (rule) {
		return `${rule.raws.before||''}<span class=css-rule><span class=css-selector>${replaceVars(rule.selector)}</span>${rule.raws.between||''}<span class=css-block>{${rule.nodes.map(node => toString(node)).join('')}${rule.raws.after||''}}</span></span>`;
	}

	function declToString (decl) {
		return `${decl.raws.before || ''}<span class=css-declaration><span class=css-property>${decl.prop}</span>${decl.raws.between || ':'}<span class=css-value>${replaceVarsAndFns(decl.value)}</span>;</span>`;
	}

	function commentToString (comment) {
		return `${comment.raws.before}<span class=css-comment>/*${comment.raws.left}${comment.text}${comment.raws.right}*/</span>`;
	}

	builder(
		toString(root),
	);
}

export function parseExample(string) {
	return postcss().process(string, {
		stringifier: postcssToHTML,
	}).css;
}
