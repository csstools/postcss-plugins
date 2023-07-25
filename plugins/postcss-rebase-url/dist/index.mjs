import { posix } from 'path';
import { tokenize, TokenType } from '@csstools/css-tokenizer';
import { parseCommaSeparatedListOfComponentValues, replaceComponentValues, isTokenNode, isFunctionNode, isWhitespaceNode, isCommentNode, stringify } from '@csstools/css-parser-algorithms';

const hasProtocol = /^([a-z0-9.+-]+:)?\/\//i;

/**
 * Rebase a URL from one directory to another.
 *
 * @param {string} url The URL to rebase.
 * @param {string} fromDir The directory to rebase from.
 * @param {string} fromEntryPointDir The directory of the entry point.
 * @param {string} toDir The directory to rebase to.
 * @returns {string|false} The rebased URL, or `false` if the URL is absolute.
 */
function rebase(url, fromDir, fromEntryPointDir, toDir) {
	{
		if (url.startsWith('data:')) {
			return false;
		}

		if (hasProtocol.test(url)) {
			return false;
		}

		try {
			const x = new URL(url);
			if (x.port || x.protocol) {
				return false;
			}
		} catch { } // eslint-disable-line no-empty
	}

	const { hash, search } = new URL(url, 'https://example.com/');

	const assetPath = posix.resolve(
		posix.join(
			fromDir.replace(new RegExp(`^${fromEntryPointDir}`), toDir),
			url,
		),
	);

	return posix.normalize(
		posix.relative(
			toDir,
			assetPath,
		),
	) + search + hash;
}

const URL_FUNCTION_CALL = /url\(/i;
const URL_FUNCTION_NAME = /url/i;
const creator = () => {
  return {
    postcssPlugin: 'postcss-rebase-url',
    prepare() {
      const visited = new WeakSet();
      return {
        Declaration(decl, {
          result
        }) {
          var _decl$source;
          if (visited.has(decl)) {
            return;
          }
          const {
            from: fromEntryPoint,
            to
          } = result.opts;
          if (!to || !fromEntryPoint) {
            return;
          }
          const toDir = posix.parse(posix.resolve(to)).dir;
          const from = (_decl$source = decl.source) == null ? void 0 : _decl$source.input.from;
          if (!from) {
            return;
          }
          const fromDir = posix.parse(posix.resolve(from)).dir;
          const fromEntryPointDir = posix.parse(posix.resolve(fromEntryPoint)).dir;
          if (!URL_FUNCTION_CALL.test(decl.value)) {
            return;
          }
          const componentValuesList = parseCommaSeparatedListOfComponentValues(tokenize({
            css: decl.value
          }));
          const modifiedComponentValuesList = replaceComponentValues(componentValuesList, componentValue => {
            if (isTokenNode(componentValue) && componentValue.value[0] === TokenType.URL) {
              const rebased = rebase(componentValue.value[4].value, fromDir, fromEntryPointDir, toDir);
              if (rebased) {
                componentValue.value[4].value = rebased;
                componentValue.value[1] = `url(./${rebased.replaceAll(/"/g, '\\22').replaceAll(/'/g, '\\27')})`;
                return componentValue;
              }
            }
            if (isFunctionNode(componentValue) && URL_FUNCTION_NAME.test(componentValue.getName())) {
              for (const x of componentValue.value) {
                if (isWhitespaceNode(x) || isCommentNode(x)) {
                  continue;
                }
                if (isTokenNode(x) && x.value[0] === TokenType.String) {
                  const rebased = rebase(x.value[4].value, fromDir, fromEntryPointDir, toDir);
                  if (rebased) {
                    x.value[4].value = rebased;
                    x.value[1] = '"./' + rebased.replaceAll(/"/g, '\\"') + '"';
                    return componentValue;
                  }
                  break;
                }
              }
            }
          });
          const modifiedValue = stringify(modifiedComponentValuesList);
          if (modifiedValue !== decl.value) {
            decl.value = modifiedValue;
            visited.add(decl);
          }
        }
      };
    }
  };
};
creator.postcss = true;

export { creator as default };
