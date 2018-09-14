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
		const key = value.replace(customPseudoRegExp, '$1');

		if (key in customMedias) {
			for (const replacementMedia of customMedias[key].nodes) {
				const mediaClone = media.clone({
					modifier: replacementMedia.modifier === media.modifier && modifierRegExp.test(media.modifier)
						? ''
					: replacementMedia.modifier
				});

				mediaClone.nodes.splice(index, 1, ...replacementMedia.clone().nodes.map(node => {
					// use spacing from the current usage
					node.spaces = { ...media.nodes[index].spaces };

					return node;
				}));

				const retranspiledMedias = String(mediaClone) === String(customMedias[key])
					? []
				: transformMedia(mediaClone, customMedias);

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

const modifierRegExp = /^not$/i;
const customPseudoRegExp = /\((--[A-z][\w-]*)\)/;
