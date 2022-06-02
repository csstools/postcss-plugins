import { getCustomMediaNameReference } from './custom-media-name';

// return transformed medias, replacing custom pseudo medias with custom medias
export default function transformMediaList(mediaList, customMedias) {
	let index = mediaList.nodes.length - 1;

	while (index >= 0) {
		const transformedMedias = transformMedia(mediaList.nodes[index], customMedias);

		if (transformedMedias.length) {
			mediaList.nodes.splice(index, 1, ...transformedMedias);
		}

		--index;
	}

	return mediaList;
}

// return custom pseudo medias replaced with custom medias
function transformMedia(media, customMedias) {
	const transpiledMedias = [];

	for (const index in media.nodes) {
		const { value, nodes } = media.nodes[index];
		const key = getCustomMediaNameReference(value);
		if (key && (key in customMedias)) {
			for (const replacementMedia of customMedias[key].nodes) {
				// use the first available modifier unless they cancel each other out
				const modifier = media.modifier !== replacementMedia.modifier
					? media.modifier || replacementMedia.modifier
					: '';
				const mediaClone = media.clone({
					modifier,
					// conditionally use the raws from the first available modifier
					raws: !modifier || media.modifier
						? { ...media.raws }
						: { ...replacementMedia.raws },
					type: media.type || replacementMedia.type,
				});

				// conditionally include more replacement raws when the type is present
				if (mediaClone.type === replacementMedia.type) {
					Object.assign(mediaClone.raws, {
						and: replacementMedia.raws.and,
						beforeAnd: replacementMedia.raws.beforeAnd,
						beforeExpression: replacementMedia.raws.beforeExpression,
					});
				}

				mediaClone.nodes.splice(index, 1, ...replacementMedia.clone().nodes.map(node => {
					// use raws and spacing from the current usage
					if (media.nodes[index].raws.and) {
						node.raws = { ...media.nodes[index].raws };
					}

					node.spaces = { ...media.nodes[index].spaces };

					return node;
				}));

				// remove the currently transformed key to prevent recursion
				const nextCustomMedia = getCustomMediasWithoutKey(customMedias, key);
				const retranspiledMedias = transformMedia(mediaClone, nextCustomMedia);

				if (retranspiledMedias.length) {
					transpiledMedias.push(...retranspiledMedias);
				} else {
					transpiledMedias.push(mediaClone);
				}
			}

			return transpiledMedias;
		} else if (nodes && nodes.length) {
			transformMediaList(media.nodes[index], customMedias);
		}
	}

	return transpiledMedias;
}

const getCustomMediasWithoutKey = (customMedias, key) => {
	const nextCustomMedias = Object.assign({}, customMedias);

	delete nextCustomMedias[key];

	return nextCustomMedias;
};
