import type { AtRule, ChildNode, Node } from 'postcss';

export class Model {
	anonymousLayerCount = 0;
	layerCount = 0;
	layerOrder: Map<string, number>;

	// List of layer names extracted from @layer params.
	// example : @layer A, B; -> ['A', 'B']
	// example : @layer A.B; -> ['A.B']
	layerParamsParsed: Map<string, Array<string>>;

	// List of sub layer name parts extracted from a single layer name.
	// example : @layer A.B {}; -> ['A', 'B']
	layerNameParts: Map<string, Array<string>>;

	constructor() {
		this.anonymousLayerCount = 0;
		this.layerCount = 0;
		this.layerOrder = new Map();
		this.layerParamsParsed = new Map();
		this.layerNameParts = new Map();
	}

	createAnonymousLayerName(): string {
		const name = `anon${this.anonymousLayerCount}`;
		this.addLayerNameParts(name);
		this.layerParamsParsed.set(name, [name]);

		this.anonymousLayerCount++;

		return name;
	}

	createImplicitLayerName(layerName: string): string {
		const parts = this.layerNameParts.get(layerName);
		const last = parts[parts.length - 1];
		const name = `${last}-implicit`;

		this.addLayerNameParts([...parts, name]);
		this.layerParamsParsed.set(name, [name]);

		return name;
	}

	addLayerParams(key: string, parts?: string): void
	addLayerParams(key: string, parts: Array<string>): void
	addLayerParams(key: string, parts: Array<string> | string | undefined): void {
		if (!parts) {
			this.layerParamsParsed.set(key, [key]);
			return;
		}

		if (typeof parts === 'string') {
			this.layerParamsParsed.set(key, [parts]);
			return;
		}
		this.layerParamsParsed.set(key, parts);
	}

	addLayerNameParts(parts: string): void
	addLayerNameParts(parts: Array<string>): void
	addLayerNameParts(parts: Array<string> | string): void {
		if (typeof parts === 'string') {
			this.layerNameParts.set(parts, [parts]);
			return;
		}
		this.layerNameParts.set(parts.join('.'), parts);
	}

	getLayerParams(layer: AtRule): Array<string> {
		const params: Array<string> = [...this.layerParamsParsed.get(layer.params)];

		let parent: Node = layer.parent;
		while (parent) {
			if (parent.type !== 'atrule') {
				parent = parent.parent;
				continue;
			}

			if ((parent as AtRule).name === 'layer') {
				params.push(...this.layerParamsParsed.get((parent as AtRule).params));
			}

			parent = parent.parent;
		}

		// Layer names were collected inside out, so order needs to be reversed.
		params.reverse();

		// Individual layers can also be specified as `@layer foo.bar {}`.
		// Joining and splitting by "." ensures that we handle each sub layer.
		return params.flatMap((param) => {
			return this.layerNameParts.get(param);
		});
	}

	getLayerNameList(layerName: string): Array<string> {
		const parts = this.layerNameParts.get(layerName);
		const layerNameList = [];
		for (let i = 0; i < parts.length; i++) {
			const partialLayerName = parts.slice(0, i + 1).join('.');
			if (!this.layerParamsParsed.has(partialLayerName)) {
				this.layerParamsParsed.set(partialLayerName, [partialLayerName]);
			}

			if (!this.layerNameParts.has(partialLayerName)) {
				this.layerNameParts.set(partialLayerName, parts.slice(0, i + 1));
			}

			layerNameList.push(parts.slice(0, i + 1).join('.'));
		}

		return layerNameList;
	}

	sortLayerNames() {
		for (const [layerName, layerIndex] of this.layerOrder) {
			const parts = this.layerNameParts.get(layerName);

			for (let i = 1; i < (parts.length); i++) {
				const parentLayer = parts.slice(0, i).join('.');
				if (!this.layerOrder.has(parentLayer)) {
					this.layerOrder.set(parentLayer, layerIndex);
				}
			}
		}

		let layerOrderStructured = Array.from(this.layerOrder.entries());
		layerOrderStructured = layerOrderStructured.sort((a, b) => {
			const aParts = this.layerNameParts.get(a[0]);
			const bParts = this.layerNameParts.get(b[0]);
			if (aParts[0] !== bParts[0]) {
				return this.layerOrder.get(aParts[0]) - this.layerOrder.get(bParts[0]);
			}

			const len = Math.max(aParts.length, bParts.length);
			for (let i = 0; i < len; i++) {
				const aPart = aParts[i];
				const bPart = bParts[i];
				if (aPart === bPart) {
					continue;
				}

				if (!aPart) {
					return 1;
				}

				if (!bPart) {
					return -1;
				}

				return this.layerOrder.get(aParts.slice(0, i).join('.')) - this.layerOrder.get(bParts.slice(0, i).join('.'));
			}
		});

		this.layerOrder.clear();
		layerOrderStructured.forEach((pair, index) => {
			this.layerOrder.set(pair[0], index);
		});
	}

	// Sort root nodes to apply the preferred order by layer priority for non-selector rules.
	// Selector rules are adjusted by specificity.
	sortRootNodes(rootNodes: Array<ChildNode>) {
		rootNodes.sort((a, b) => {
			const aIsCharset = a.type === 'atrule' && a.name === 'charset';
			const bIsCharset = b.type === 'atrule' && b.name === 'charset';
			if (aIsCharset && bIsCharset) {
				return 0;
			} else if (aIsCharset !== bIsCharset) {
				return aIsCharset ? -1 : 1;
			}

			const aIsImport = a.type === 'atrule' && a.name === 'import';
			const bIsImport = b.type === 'atrule' && b.name === 'import';
			if (aIsImport && bIsImport) {
				return 0;
			} else if (aIsImport !== bIsImport) {
				return aIsImport ? -1 : 1;
			}

			const aIsLayer = a.type === 'atrule' && a.name === 'layer';
			const bIsLayer = b.type === 'atrule' && b.name === 'layer';
			if (aIsLayer && bIsLayer) {
				return this.layerOrder.get(a.params) - this.layerOrder.get(b.params);
			} else if (aIsLayer !== bIsLayer) {
				return aIsLayer ? -1 : 1;
			}

			return 0;
		});
	}
}
