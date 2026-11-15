import type { AtRule, Container, Document, Node, Root } from 'postcss';
import { IS_APPLY_REGEX } from './processable-apply';
import type { MixinParameter } from './processable-mixin';
import { dashedNameFromParams, mixinRuleName, processableMixinRule } from './processable-mixin';

export type Mixin = {
	name: string,
	parameters: Array<MixinParameter>,
	atRule: AtRule,
};

export type MixinDefinitions = {
	/** Names that can be transpiled. */
	mixins: Map<string, Mixin>,
	/** Names with at least one definition that can not be transpiled. */
	unsupported: Set<string>,
};

/**
 * Group `@mixin` rules by name.
 *
 * A name is only transpilable when it has exactly one definition, that
 * definition can be transpiled, and everything it applies can be transpiled as
 * well. Otherwise every definition and every `@apply` of that name is left
 * untouched.
 */
export function collectMixinDefinitions(atRules: Array<AtRule>): MixinDefinitions {
	const byName: Map<string, Array<AtRule>> = new Map();

	for (const atRule of atRules) {
		const name = mixinRuleName(atRule);
		if (!name) {
			continue;
		}

		const definitions = byName.get(name) ?? [];
		definitions.push(atRule);
		byName.set(name, definitions);
	}

	const mixins: Map<string, Mixin> = new Map();
	const unsupported: Set<string> = new Set();
	const references: Map<string, Set<string>> = new Map();

	for (const [name, definitions] of byName) {
		if (definitions.length !== 1) {
			unsupported.add(name);
			continue;
		}

		const parsed = processableMixinRule(definitions[0]);
		if (!parsed) {
			unsupported.add(name);
			continue;
		}

		mixins.set(name, Object.assign({}, parsed, { atRule: definitions[0] }));

		const names: Set<string> = new Set();
		collectApplyNames(definitions[0], new Set(), names);
		references.set(name, names);
	}

	// A mixin that applies a mixin which can not be transpiled can not be
	// transpiled either. A cycle makes every mixin on the cycle unsupported.
	const state: Map<string, boolean> = new Map();

	const isTranspilable = (name: string): boolean => {
		const known = state.get(name);
		if (known !== undefined) {
			return known;
		}

		if (!mixins.has(name)) {
			return !unsupported.has(name);
		}

		// Assume a cycle until proven otherwise.
		state.set(name, false);

		let transpilable = true;
		for (const reference of references.get(name) ?? []) {
			if (!isTranspilable(reference)) {
				transpilable = false;
				break;
			}
		}

		state.set(name, transpilable);
		return transpilable;
	};

	for (const name of [...mixins.keys()]) {
		if (isTranspilable(name)) {
			continue;
		}

		mixins.delete(name);
		unsupported.add(name);
	}

	return { mixins, unsupported };
}

/**
 * Remove definitions of mixins that are not referenced by any `@apply` rule
 * that remains in the output.
 *
 * A definition is only removed when every call site is expanded by this plugin.
 * Call sites that are left as-is, for example inside a preserved `@mixin`, keep
 * their definitions alive.
 */
export function removeUnusedMixins(root: Root, definitions: MixinDefinitions): void {
	const supportedNodes: Set<Node> = new Set();
	for (const mixin of definitions.mixins.values()) {
		supportedNodes.add(mixin.atRule);
	}

	const required: Set<string> = new Set();
	collectApplyNames(root, supportedNodes, required);

	// Definitions that are kept can reference other definitions.
	const processed: Set<string> = new Set();
	const queue: Array<string> = [...required];

	while (queue.length) {
		const name = queue.pop() as string;
		if (processed.has(name)) {
			continue;
		}

		processed.add(name);

		const mixin = definitions.mixins.get(name);
		if (!mixin) {
			continue;
		}

		const references: Set<string> = new Set();
		collectApplyNames(mixin.atRule, new Set(), references);

		for (const reference of references) {
			if (required.has(reference)) {
				continue;
			}

			required.add(reference);
			queue.push(reference);
		}
	}

	for (const [name, mixin] of definitions.mixins) {
		if (required.has(name)) {
			continue;
		}

		mixin.atRule.remove();
	}
}

function collectApplyNames(container: Container | Document, skipNodes: Set<Node>, out: Set<string>): void {
	container.walkAtRules(IS_APPLY_REGEX, (atRule) => {
		if (isInsideAny(atRule, skipNodes)) {
			return;
		}

		const name = dashedNameFromParams(atRule.params);
		if (name) {
			out.add(name);
		}
	});
}

function isInsideAny(node: Node, nodes: Set<Node>): boolean {
	let parent: Node | undefined = node;

	while (parent) {
		if (nodes.has(parent)) {
			return true;
		}

		parent = parent.parent;
	}

	return false;
}
