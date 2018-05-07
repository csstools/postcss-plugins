import getComma from './get-comma';
import getImage from './get-image';
import getMedia from './get-media';
import handleInvalidation from './handle-invalidation';

export default (imageSetOptionNodes, decl, opts) => {
	const parent = decl.parent;
	const mediasByDpi = {};

	let length = imageSetOptionNodes.length;
	let index = -1;

	while (index < length) {
		const [comma, value, media] = [
			index < 0 ? true : getComma(imageSetOptionNodes[index]),
			getImage(imageSetOptionNodes[index + 1]),
			getMedia(imageSetOptionNodes[index + 2], mediasByDpi)
		];

		// handle invalidations
		if (!comma) {
			return handleInvalidation(opts, 'unexpected comma', imageSetOptionNodes[index]);
		} else if (!value) {
			return handleInvalidation(opts, 'unexpected image', imageSetOptionNodes[index + 1]);
		} else if (!media) {
			return handleInvalidation(opts, 'unexpected resolution', imageSetOptionNodes[index + 2]);
		}

		// prepare @media { decl: <image> }
		const parentClone = parent.clone().removeAll();
		const declClone = decl.clone({ value });

		parentClone.append(declClone);
		media.append(parentClone);

		index += 3
	}

	const medias = Object.keys(mediasByDpi).map(params => mediasByDpi[params]);

	// conditionally prepend previous siblings
	if (medias.length) {
		const siblings = parent.nodes;
		const previousSiblings = siblings.slice(0, siblings.indexOf(decl));

		if (previousSiblings.length) {
			const parentClone = parent.cloneBefore().removeAll();

			parentClone.append(previousSiblings);
		}

		// prepend any @media { decl: <image> } rules
		parent.before(medias);

		// conditionally remove the current rule
		if (!opts.preserve) {
			decl.remove();

			// and then conditionally remove its parent
			if (!parent.nodes.length) {
				parent.remove();
			}
		}
	}
}
