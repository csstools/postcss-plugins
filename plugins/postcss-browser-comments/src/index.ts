import type { Comment, Node, PluginCreator } from 'postcss';
import browserslist from 'browserslist';

/** postcss-browser-comments plugin options */
export type pluginOptions = {
	/** The browserslist queries */
	browsers?: string | Array<string> | null | undefined,
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	return {
		postcssPlugin: 'postcss-browser-comments',
		Once(root): void {
			const clientBrowserList = new Set(browserslist(
				opts?.browsers ?? null,
				{
					path: root?.source?.input.file,
				},
			));

			// root children references
			const references = root.nodes.slice(0);

			// for each child node of the root children references
			for (const node of references) {
				// if the node is a comment browser comment node
				if (!isBrowserCommentNode(node)) {
					continue;
				}

				// rule following the browser comment
				const rule = node.next();
				if (!rule || rule.type !== 'rule') {
					continue;
				}

				// browser data
				const browserdata = getBrowserData(node.text);

				if (!browserdata.isNumbered) {
					if (!browserslistsOverlap(clientBrowserList, browserslist(browserdata.browserslist))) {
						rule.remove();
						node.remove();
					}

					continue;
				}

				rule.nodes.filter(isBrowserReferenceCommentNode).map((comment) => {
					const browserdataIndex = parseFloat(comment.text) - 1;
					const browserslistPart = browserslist(browserdata.browserslist[browserdataIndex]);

					// conditionally remove the declaration and reference comment
					if (!browserslistsOverlap(clientBrowserList, browserslistPart)) {
						comment.prev()?.remove();
						comment.remove();
					}
				});

				// conditionally remove the empty rule and comment
				if (!rule.nodes.length) {
					rule.remove();
					node.remove();
				}
			}
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };

// returns whether a node is a browser comment
function isBrowserCommentNode(node: Node): node is Comment {
	if (node.type !== 'comment') {
		return false;
	}

	if (!IS_BROWSER_COMMENT_NODE_REGEX.test((node as Comment).text)) {
		return false;
	}

	return node.next()?.type === 'rule';
}

const IS_BROWSER_COMMENT_NODE_REGEX = /^\*\n +/;

// returns whether a node is a browser reference comment
function isBrowserReferenceCommentNode(node: Node): node is Comment {
	if (node.type !== 'comment') {
		return false;
	}

	return IS_BROWSER_REFERENCE_COMMENT_NODE_REGEX.test((node as Comment).text);
}

const IS_BROWSER_REFERENCE_COMMENT_NODE_REGEX = /^\d+$/;

// returns browser data from comment text
function getBrowserData(text: string): { browserslist: Array<string>, isNumbered: false } | { browserslist: Array<Array<string>>, isNumbered: true } {
	const browserDataNumbered = text.match(BROWSER_DATA_MULTI_REGEX);
	if (!browserDataNumbered) {
		return {
			browserslist: getBrowsersList(text.replace(BROWSER_DATA_NEWLINE_REGEX, '')),
			isNumbered: false,
		};
	}

	return {
		browserslist: browserDataNumbered.map(
			browserslistPart => getBrowsersList(browserslistPart.replace(BROWSER_DATA_NUMBERED_NEWLINE_REGEX, '$1')),
		),
		isNumbered: true,
	};
}

const BROWSER_DATA_MULTI_REGEX = /(\n \* \d+\. (?:[^\n]|\n \* {4,})+)/g;
const BROWSER_DATA_NEWLINE_REGEX = /^\*\n \* ?|\n \*/g;
const BROWSER_DATA_NUMBERED_NEWLINE_REGEX = /\n \* (?:( )\s*)?/g;

// returns a browserlist from comment text
function getBrowsersList(text: string): Array<string> {
	return text.split(GET_BROWSERSLIST_IN_SPLIT_REGEX).slice(1).map(
		part => part.split(GET_BROWSERSLIST_AND_SPLIT_REGEX).filter(part2 => part2),
	).reduce(
		(acc, val) => acc.concat(val), [])
		.map(
			part => part.replace(
				GET_BROWSERSLIST_QUERY_REGEX,
				($0, browser, query) => browser === 'all'
					? '>= 0%'
					: `${browser}${query
						// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
						? /^((?:\d*\.)?\d+)-$/.test(query)
							// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
							? ` <= ${query.slice(0, -1)}`
							: ` ${query}`
						: ' > 0'
					}`,
			).toLowerCase(),
		);
}

const GET_BROWSERSLIST_IN_SPLIT_REGEX = /\s+in\s+/;
const GET_BROWSERSLIST_AND_SPLIT_REGEX = / and|, and|,/;
const GET_BROWSERSLIST_QUERY_REGEX = /^\s*(\w+)(?: ((?:(?:\d*\.)?\d+-)?(?:\d*\.)?\d+[+-]?))?.*$/;

function browserslistsOverlap(clientBrowserList: Set<string>, commentBrowsersList: Array<string>): boolean {
	return commentBrowsersList.some(commentBrowser => clientBrowserList.has(commentBrowser));
}
