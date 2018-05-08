import getComma from './get-comma';
import getImage from './get-image';
import getMedia from './get-media';
import handleInvalidation from './handle-invalidation';

export default (imageSetOptionNodes, decl, opts) => {
	const parent = decl.parent;
	const mediasByDpr = {};

	let length = imageSetOptionNodes.length;
	let index = -1;

	while (index < length) {
		const [comma, value, media] = [
			index < 0 ? true : getComma(imageSetOptionNodes[index]),
			getImage(imageSetOptionNodes[index + 1]),
			getMedia(imageSetOptionNodes[index + 2], mediasByDpr)
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

	const medias = Object.keys(mediasByDpr).sort((a, b) => a - b).map(params => mediasByDpr[params]);

	// conditionally prepend previous siblings
	if (medias.length) {
		const firstDecl = medias[0].nodes[0].nodes[0];

		if (medias.length === 1) {
			decl.value = firstDecl.value
		} else {
			const siblings = parent.nodes;
			const previousSiblings = siblings.slice(0, siblings.indexOf(decl)).concat(firstDecl);

			if (previousSiblings.length) {
				const parentClone = parent.cloneBefore().removeAll();

				parentClone.append(previousSiblings);
			}

			// prepend any @media { decl: <image> } rules
			parent.before(medias.slice(1));

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
}
