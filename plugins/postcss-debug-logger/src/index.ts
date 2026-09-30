import type { AtRule, Comment, Declaration, Document, PluginCreator, Root, Rule } from 'postcss';
import path from 'node:path';

const creator: PluginCreator<never> = () => {

	const onceHandler = (label: string) => {
		return (root: Root): void => {
			let sourceFile = root.source?.input?.from;
			if (sourceFile) {
				sourceFile = path.relative(process.cwd(), sourceFile);
			}

			let logContent = '';
			logContent += label;

			logContent += `\n  index      : ${root.parent?.index(root) ?? 'N/A'}`;
			logContent += `\n  nodes      : ${root.nodes?.length}`;
			logContent += `\n  input.from : ${sourceFile ?? 'N/A'}`;

			// eslint-disable-next-line no-console
			console.log(logContent + '\n');
		};
	};

	const documentHandler = (label: string) => {
		return (document: Document): void => {
			let sourceFile = document.source?.input?.from;
			if (sourceFile) {
				sourceFile = path.relative(process.cwd(), sourceFile);
			}

			let logContent = '';
			logContent += label;

			logContent += `\n  nodes      : ${document.nodes?.length}`;
			logContent += `\n  input.from : ${sourceFile ?? 'N/A'}`;

			// eslint-disable-next-line no-console
			console.log(logContent + '\n');
		};
	};

	const atRuleHandler = (label: string) => {
		return (atrule: AtRule): void => {
			let sourceFile = atrule.source?.input?.from;
			if (sourceFile) {
				sourceFile = path.relative(process.cwd(), sourceFile);
			}

			let logContent = '';
			logContent += label;

			logContent += `\n  name       : ${atrule.name}`;
			logContent += `\n  params     : ${atrule.params}`;
			logContent += `\n  index      : ${atrule.parent?.index(atrule) ?? 'N/A'}`;
			logContent += `\n  nodes      : ${atrule.nodes?.length}`;
			logContent += `\n  raw        : ${JSON.stringify(atrule.raws)}`;
			logContent += `\n  input.from : ${sourceFile ?? 'N/A'}`;

			// eslint-disable-next-line no-console
			console.log(logContent + '\n');
		};
	};

	const ruleHandler = (label: string) => {
		return (rule: Rule): void => {
			let sourceFile = rule.source?.input?.from;
			if (sourceFile) {
				sourceFile = path.relative(process.cwd(), sourceFile);
			}

			let logContent = '';
			logContent += label;

			logContent += `\n  selector   : ${rule.selector}`;
			logContent += `\n  index      : ${rule.parent?.index(rule) ?? 'N/A'}`;
			logContent += `\n  nodes      : ${rule.nodes?.length}`;
			logContent += `\n  raw        : ${JSON.stringify(rule.raws)}`;
			logContent += `\n  input.from : ${sourceFile ?? 'N/A'}`;

			// eslint-disable-next-line no-console
			console.log(logContent + '\n');
		};
	};

	const commentHandler = (label: string) => {
		return (comment: Comment): void => {
			let sourceFile = comment.source?.input?.from;
			if (sourceFile) {
				sourceFile = path.relative(process.cwd(), sourceFile);
			}

			let logContent = '';
			logContent += label;

			logContent += `\n  text       : ${comment.text}`;
			logContent += `\n  index      : ${comment.parent?.index(comment) ?? 'N/A'}`;
			logContent += `\n  raw        : ${JSON.stringify(comment.raws)}`;
			logContent += `\n  input.from : ${sourceFile ?? 'N/A'}`;

			// eslint-disable-next-line no-console
			console.log(logContent + '\n');
		};
	};

	const declHandler = (label: string) => {
		return (decl: Declaration): void => {
			let sourceFile = decl.source?.input?.from;
			if (sourceFile) {
				sourceFile = path.relative(process.cwd(), sourceFile);
			}

			let logContent = '';
			logContent += label;

			logContent += `\n  prop       : ${decl.prop}`;
			logContent += `\n  value      : ${decl.value}`;
			logContent += `\n  index      : ${decl.parent?.index(decl) ?? 'N/A'}`;
			logContent += `\n  raw        : ${JSON.stringify(decl.raws)}`;
			logContent += `\n  input.from : ${sourceFile ?? 'N/A'}`;

			// eslint-disable-next-line no-console
			console.log(logContent + '\n');
		};
	};

	return {
		postcssPlugin: 'postcss-debug-logger',
		AtRule: atRuleHandler('AtRule'),
		AtRuleExit: atRuleHandler('AtRuleExit'),
		Comment: commentHandler('Comment'),
		CommentExit: commentHandler('CommentExit'),
		Declaration: declHandler('Declaration'),
		DeclarationExit: declHandler('DeclarationExit'),
		Document: documentHandler('Document'),
		DocumentExit: documentHandler('DocumentExit'),
		Once: onceHandler('Once'),
		OnceExit: onceHandler('OnceExit'),
		Root: onceHandler('Root'),
		RootExit: onceHandler('RootExit'),
		Rule: ruleHandler('Rule'),
		RuleExit: ruleHandler('RuleExit'),
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
