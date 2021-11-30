import valueParser from 'postcss-value-parser';
import { getComma } from './get-comma';
import { getImage } from './get-image';
import { getMedia, getMediaDPI } from './get-media';
import { handleInvalidation } from './handle-invalidation';
import type { AtRule, Container, Declaration, Result, Postcss } from 'postcss';

export const processImageSet = (imageSetOptionNodes, decl: Declaration, opts: { decl: Declaration, oninvalid: string, preserve: boolean, result: Result, postcss: Postcss }) => {
	const parent = decl.parent;
	const mediasByDpr: Map<number, AtRule> = new Map();

	const length = imageSetOptionNodes.length;
	let index = -1;

	while (index < length) {
		const comma = index < 0 ? true : getComma(imageSetOptionNodes[index]);
		const value = getImage(imageSetOptionNodes[index + 1]);
		const mediaDPI = getMediaDPI(imageSetOptionNodes[index + 2]);

		const media = getMedia(mediaDPI, opts.postcss);

		// handle invalidations
		if (!comma) {
			handleInvalidation(opts, 'expected a comma', valueParser.stringify(imageSetOptionNodes));
			return;
		} else if (!value) {
			handleInvalidation(opts, 'unexpected image', valueParser.stringify(imageSetOptionNodes));
			return;
		} else if (!media || !mediaDPI || mediasByDpr.has(mediaDPI)) {
			handleInvalidation(opts, 'unexpected resolution', valueParser.stringify(imageSetOptionNodes));
			return;
		}

		mediasByDpr.set(mediaDPI, media);

		// prepare @media { decl: <image> }
		const parentClone = parent.clone().removeAll();
		const declClone = decl.clone({ value: value.trim() });

		parentClone.append(declClone);
		media.append(parentClone);

		index += 3;
	}

	const medias = Array.from(mediasByDpr.keys())
		.sort((a, b) => a - b)
		.map(params => mediasByDpr.get(params));

	if (!medias.length) {
		return;
	}

	const smallestMedia = medias[0];
	const mediasWithoutSmallest = medias.slice(1);

	if (mediasWithoutSmallest.length) {
		parent.after(mediasWithoutSmallest);
	}

	const firstDecl = (smallestMedia.nodes[0] as Container).nodes[0] as Declaration;
	decl.cloneBefore({ value: firstDecl.value.trim() });

	if (!opts.preserve) {
		decl.remove();

		// and then conditionally remove its parent
		if (!parent.nodes.length) {
			parent.remove();
		}
	}

	return;
};
