const getComma = require('./get-comma');
const getImage = require('./get-image');
const getMedia = require('./get-media');
const handleInvalidation = require('./handle-invalidation');

/**
 * @param {import('postcss-values-parser').ChildNode[]} imageSetOptionNodes
 * @param {import('postcss').Declaration} decl
 * @param {{ decl: import('postcss').Declaration, oninvalid: string, preserve: boolean, result: import('postcss').Result }} opts
 * @returns {void}
 */
module.exports = (imageSetOptionNodes, decl, opts) => {
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
			handleInvalidation(opts, 'unexpected comma', imageSetOptionNodes[index]);
			return;
		} else if (!value) {
			handleInvalidation(opts, 'unexpected image', imageSetOptionNodes[index + 1]);
			return;
		} else if (!media) {
			handleInvalidation(opts, 'unexpected resolution', imageSetOptionNodes[index + 2]);
			return;
		}

		// prepare @media { decl: <image> }
		const parentClone = parent.clone().removeAll();
		const declClone = decl.clone({ value });

		parentClone.append(declClone);
		media.append(parentClone);

		index += 3
	}

	const medias = Object.keys(mediasByDpr)
		.sort((a, b) => a - b)
		.map(params => mediasByDpr[params]);

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
