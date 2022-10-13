import { VirtualMedia, Operator } from '@csstools/virtual-media';

// What with units?
// Maybe a map of facts per property
// { px: { low, high }, rem: { low, high } }
//
// Or a map of VirtualMedia and a way to share unitless properties?
//
// How to deal with "not (width: 300px)"

{
	const media = new VirtualMedia();
	console.log(media.width);

	media.mustMatchWidth(10, Operator.GT, 100, Operator.LT);
	console.log(media.width);

	media.mustMatchWidth(1000, Operator.GT, 10000, Operator.LT);
	console.log(media.width);
}

{
	const media = new VirtualMedia();
	console.log(media.width);

	media.mustMatchWidth(10, Operator.EQ, 10, Operator.EQ);
	console.log(media.width);
}
