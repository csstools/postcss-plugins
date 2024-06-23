import valueParser from 'postcss-value-parser';
import { isComma } from './is-comma';
import { getImage } from './get-image';
import { getMedia, getMediaDPI } from './get-media';
import { handleInvalidation } from './handle-invalidation';
import type { AtRule, Declaration, Result, Postcss } from 'postcss';
import type { Node } from 'postcss-value-parser';

type imageSetFunction = {
	imageSetFunction: Node;
	imageSetOptionNodes: Array<Node>;
}

type mediaByDpr = {
	atRule: AtRule;
	value: string;
}

export const processImageSet = (imageSetFunctions: Array<imageSetFunction>, decl: Declaration, opts: { decl: Declaration, oninvalid: 'warn' | 'throw' | 'ignore' | false | undefined, preserve: boolean, result: Result, postcss: Postcss }): void => {
	const parent = decl.parent;
	if (!parent) {
		return;
	}

	const mediasByDpr: Map<number, mediaByDpr> = new Map();
	const declValue = decl.value;

	for (let i = 0; i < imageSetFunctions.length; i++) {
		const { imageSetFunction, imageSetOptionNodes } = imageSetFunctions[i];
		const mediasByDprPerItem: Map<number, AtRule> = new Map();

		const length = imageSetOptionNodes.length;
		let index = -1;

		while (index < length) {
			const comma = index < 0 ? true : isComma(imageSetOptionNodes[index]);
			const value = getImage(imageSetOptionNodes[index + 1]);
			const mediaDPI = getMediaDPI(imageSetOptionNodes[index + 2]);

			const media = getMedia(mediaDPI, opts.postcss, decl);

			// handle invalidations
			if (!comma) {
				handleInvalidation(opts, 'expected a comma', valueParser.stringify(imageSetOptionNodes));
				return;
			} else if (!value) {
				handleInvalidation(opts, 'unexpected image', valueParser.stringify(imageSetOptionNodes));
				return;
			} else if (!media || !mediaDPI || mediasByDprPerItem.has(mediaDPI)) {
				handleInvalidation(opts, 'unexpected resolution', valueParser.stringify(imageSetOptionNodes));
				return;
			}

			mediasByDprPerItem.set(mediaDPI, media);

			if (mediasByDpr.has(mediaDPI)) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const m = mediasByDpr.get(mediaDPI)!;
				m.value = m.value.replace(valueParser.stringify(imageSetFunction), value.trim());
				mediasByDpr.set(mediaDPI, m);
			} else {
				mediasByDpr.set(mediaDPI, {
					atRule: media,
					value: declValue.replace(valueParser.stringify(imageSetFunction), value.trim()),
				});
			}

			index += 3;
		}
	}

	for (const { atRule, value } of mediasByDpr.values()) {
		// prepare @media { decl: <image> }
		const parentClone = parent.clone().removeAll();
		const declClone = decl.clone({ value: value });

		parentClone.append(declClone);
		atRule.append(parentClone);
	}

	const mediaSizes = Array.from(mediasByDpr.keys())
		.sort((a, b) => a - b);

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
	const medias: Array<AtRule> = mediaSizes
		.map(params => mediasByDpr.get(params)?.atRule)
		.filter((x) => !!x) as Array<AtRule>;

	if (!medias.length) {
		return;
	}

	const smallestValue = mediasByDpr.get(mediaSizes[0])?.value;
	if (!smallestValue) {
		return;
	}

	const mediasWithoutSmallest = medias.slice(1);

	if (mediasWithoutSmallest.length) {
		parent.after(mediasWithoutSmallest);
	}

	decl.cloneBefore({ value: smallestValue.trim() });

	if (!opts.preserve) {
		decl.remove();

		// and then conditionally remove its parent
		if (!parent.nodes?.length) {
			parent.remove();
		}
	}

	return;
};
