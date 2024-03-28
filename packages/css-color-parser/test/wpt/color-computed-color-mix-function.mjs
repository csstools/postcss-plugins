import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { canonicalize } from '../util/canonical.mjs';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

{
	const tests = [

		['color-mix(in hsl, hsl(120deg 10% 20%), hsl(30deg 30% 40%))', 'rgb(84, 92, 61)'],
		['color-mix(in hsl, hsl(120deg 10% 20%) 25%, hsl(30deg 30% 40%))', 'rgb(112, 106, 67)'],
		['color-mix(in hsl, 25% hsl(120deg 10% 20%), hsl(30deg 30% 40%))', 'rgb(112, 106, 67)'],
		['color-mix(in hsl, hsl(120deg 10% 20%), 25% hsl(30deg 30% 40%))', 'rgb(61, 73, 54)'],
		['color-mix(in hsl, hsl(120deg 10% 20%), hsl(30deg 30% 40%) 25%)', 'rgb(61, 73, 54)'],
		['color-mix(in hsl, hsl(120deg 10% 20%) 25%, hsl(30deg 30% 40%) 75%)', 'rgb(112, 106, 67)'],
		['color-mix(in hsl, hsl(120deg 10% 20%) 30%, hsl(30deg 30% 40%) 90%)', 'rgb(112, 106, 67)'], // Scale down > 100% sum.
		['color-mix(in hsl, hsl(120deg 10% 20%) 12.5%, hsl(30deg 30% 40%) 37.5%)', 'rgba(112, 106, 67, 0.5)'], // Scale up < 100% sum, causes alpha multiplication.
		['color-mix(in hsl, hsl(120deg 10% 20%) 0%, hsl(30deg 30% 40%))', 'rgb(133, 102, 71)'],

		['color-mix(in hsl, hsl(120deg 10% 20% / .4), hsl(30deg 30% 40% / .8))', 'rgba(95, 105, 65, 0.6)'],
		['color-mix(in hsl, hsl(120deg 10% 20%) 25%, hsl(30deg 30% 40% / .8))', 'rgba(108, 103, 66, 0.85)'],
		['color-mix(in hsl, 25% hsl(120deg 10% 20% / .4), hsl(30deg 30% 40% / .8))', 'rgba(120, 114, 69, 0.7)'],
		['color-mix(in hsl, hsl(120deg 10% 20% / .4), 25% hsl(30deg 30% 40% / .8))', 'rgba(68, 84, 59, 0.5)'],
		['color-mix(in hsl, hsl(120deg 10% 20% / .4), hsl(30deg 30% 40% / .8) 25%)', 'rgba(68, 84, 59, 0.5)'],
		['color-mix(in hsl, hsl(120deg 10% 20% / .4) 25%, hsl(30deg 30% 40% / .8) 75%)', 'rgba(120, 114, 69, 0.7)'],
		['color-mix(in hsl, hsl(120deg 10% 20% / .4) 30%, hsl(30deg 30% 40% / .8) 90%)', 'rgba(120, 114, 69, 0.7)'], // Scale down > 100% sum.
		['color-mix(in hsl, hsl(120deg 10% 20% / .4) 12.5%, hsl(30deg 30% 40% / .8) 37.5%)', 'rgba(120, 114, 69, 0.35)'], // Scale up < 100% sum, causes alpha multiplication.
		['color-mix(in hsl, hsl(120deg 10% 20% / .4) 0%, hsl(30deg 30% 40% / .8))', 'rgba(133, 102, 71, 0.8)'],

		['color-mix(in hsl, transparent, hsl(30deg 30% 40%))', canonicalize('hsl(30deg 30% 40% / 0.5)')],
		['color-mix(in hsl, transparent 10%, hsl(30deg 30% 40%))', canonicalize('hsl(30deg 30% 40% / 0.9)')],
		['color-mix(in hsl, hsl(120deg 10% 20% / 0), hsl(30deg 30% 40%))', canonicalize('hsl(75deg 30% 40% / 0.5)')],
		['color-mix(in hsl, hsl(120deg 10% 20% / 0) 10%, hsl(30deg 30% 40%))', canonicalize('hsl(39deg 30% 40% / 0.9)')],

		['color-mix(in hsl, hsl(40deg 50% 50%), hsl(60deg 50% 50%))', canonicalize('hsl(50deg 50% 50%)')],
		['color-mix(in hsl, hsl(60deg 50% 50%), hsl(40deg 50% 50%))', canonicalize('hsl(50deg 50% 50%)')],
		['color-mix(in hsl, hsl(50deg 50% 50%), hsl(330deg 50% 50%))', canonicalize('hsl(10deg 50% 50%)')],
		['color-mix(in hsl, hsl(330deg 50% 50%), hsl(50deg 50% 50%))', canonicalize('hsl(10deg 50% 50%)')],
		['color-mix(in hsl, hsl(20deg 50% 50%), hsl(320deg 50% 50%))', canonicalize('hsl(350deg 50% 50%)')],
		['color-mix(in hsl, hsl(320deg 50% 50%), hsl(20deg 50% 50%))', canonicalize('hsl(350deg 50% 50%)')],

		['color-mix(in hsl shorter hue, hsl(40deg 50% 50%), hsl(60deg 50% 50%))', canonicalize('hsl(50deg 50% 50%)')],
		['color-mix(in hsl shorter hue, hsl(60deg 50% 50%), hsl(40deg 50% 50%))', canonicalize('hsl(50deg 50% 50%)')],
		['color-mix(in hsl shorter hue, hsl(50deg 50% 50%), hsl(330deg 50% 50%))', canonicalize('hsl(10deg 50% 50%)')],
		['color-mix(in hsl shorter hue, hsl(330deg 50% 50%), hsl(50deg 50% 50%))', canonicalize('hsl(10deg 50% 50%)')],
		['color-mix(in hsl shorter hue, hsl(20deg 50% 50%), hsl(320deg 50% 50%))', canonicalize('hsl(350deg 50% 50%)')],
		['color-mix(in hsl shorter hue, hsl(320deg 50% 50%), hsl(20deg 50% 50%))', canonicalize('hsl(350deg 50% 50%)')],

		['color-mix(in hsl longer hue, hsl(40deg 50% 50%), hsl(60deg 50% 50%))', canonicalize('hsl(230deg 50% 50%)')],
		['color-mix(in hsl longer hue, hsl(60deg 50% 50%), hsl(40deg 50% 50%))', canonicalize('hsl(230deg 50% 50%)')],
		['color-mix(in hsl longer hue, hsl(50deg 50% 50%), hsl(330deg 50% 50%))', canonicalize('hsl(190deg 50% 50%)')],
		['color-mix(in hsl longer hue, hsl(330deg 50% 50%), hsl(50deg 50% 50%))', canonicalize('hsl(190deg 50% 50%)')],
		['color-mix(in hsl longer hue, hsl(20deg 50% 50%), hsl(320deg 50% 50%))', canonicalize('hsl(170deg 50% 50%)')],
		['color-mix(in hsl longer hue, hsl(320deg 50% 50%), hsl(20deg 50% 50%))', canonicalize('hsl(170deg 50% 50%)')],

		['color-mix(in hsl increasing hue, hsl(40deg 50% 50%), hsl(60deg 50% 50%))', canonicalize('hsl(50deg 50% 50%)')],
		['color-mix(in hsl increasing hue, hsl(60deg 50% 50%), hsl(40deg 50% 50%))', canonicalize('hsl(230deg 50% 50%)')],
		['color-mix(in hsl increasing hue, hsl(50deg 50% 50%), hsl(330deg 50% 50%))', canonicalize('hsl(190deg 50% 50%)')],
		['color-mix(in hsl increasing hue, hsl(330deg 50% 50%), hsl(50deg 50% 50%))', canonicalize('hsl(10deg 50% 50%)')],
		['color-mix(in hsl increasing hue, hsl(20deg 50% 50%), hsl(320deg 50% 50%))', canonicalize('hsl(170deg 50% 50%)')],
		['color-mix(in hsl increasing hue, hsl(320deg 50% 50%), hsl(20deg 50% 50%))', canonicalize('hsl(350deg 50% 50%)')],

		['color-mix(in hsl decreasing hue, hsl(40deg 50% 50%), hsl(60deg 50% 50%))', canonicalize('hsl(230deg 50% 50%)')],
		['color-mix(in hsl decreasing hue, hsl(60deg 50% 50%), hsl(40deg 50% 50%))', canonicalize('hsl(50deg 50% 50%)')],
		['color-mix(in hsl decreasing hue, hsl(50deg 50% 50%), hsl(330deg 50% 50%))', canonicalize('hsl(10deg 50% 50%)')],
		['color-mix(in hsl decreasing hue, hsl(330deg 50% 50%), hsl(50deg 50% 50%))', canonicalize('hsl(190deg 50% 50%)')],
		['color-mix(in hsl decreasing hue, hsl(20deg 50% 50%), hsl(320deg 50% 50%))', canonicalize('hsl(350deg 50% 50%)')],
		['color-mix(in hsl decreasing hue, hsl(320deg 50% 50%), hsl(20deg 50% 50%))', canonicalize('hsl(170deg 50% 50%)')],

		['color-mix(in hsl, hsl(none none none), hsl(none none none))', canonicalize('hsl(none none none)')],
		['color-mix(in hsl, hsl(none none none), hsl(30deg 40% 80%))', canonicalize('hsl(30deg 40% 80%)')],
		['color-mix(in hsl, hsl(120deg 20% 40%), hsl(none none none))', canonicalize('hsl(120deg 20% 40%)')],
		['color-mix(in hsl, hsl(120deg 20% none), hsl(30deg 40% 60%))', canonicalize('hsl(75deg 30% 60%)')],
		['color-mix(in hsl, hsl(120deg 20% 40%), hsl(30deg 20% none))', canonicalize('hsl(75deg 20% 40%)')],
		['color-mix(in hsl, hsl(none 20% 40%), hsl(30deg none 80%))', canonicalize('hsl(30deg 20% 60%)')],

		['color-mix(in hsl, hsl(120deg 40% 40% / none), hsl(0deg 40% 40%))', canonicalize('hsl(60deg 40% 40%)')],
		['color-mix(in hsl, hsl(120deg 40% 40% / none), hsl(0deg 40% 40% / 0.5))', canonicalize('hsl(60deg 40% 40% / 0.5)')],
		['color-mix(in hsl, hsl(120deg 40% 40% / none), hsl(0deg 40% 40% / none))', canonicalize('hsl(60deg 40% 40% / none)')],

		['color-mix(in hwb, hwb(120deg 10% 20%), hwb(30deg 30% 40%))', 'rgb(147, 179, 51)'],
		['color-mix(in hwb, hwb(120deg 10% 20%) 25%, hwb(30deg 30% 40%))', 'rgb(166, 153, 64)'],
		['color-mix(in hwb, 25% hwb(120deg 10% 20%), hwb(30deg 30% 40%))', 'rgb(166, 153, 64)'],
		['color-mix(in hwb, hwb(120deg 10% 20%), 25% hwb(30deg 30% 40%))', 'rgb(96, 191, 38)'],
		['color-mix(in hwb, hwb(120deg 10% 20%), hwb(30deg 30% 40%) 25%)', 'rgb(96, 191, 38)'],
		['color-mix(in hwb, hwb(120deg 10% 20%) 25%, hwb(30deg 30% 40%) 75%)', 'rgb(166, 153, 64)'],
		['color-mix(in hwb, hwb(120deg 10% 20%) 30%, hwb(30deg 30% 40%) 90%)', 'rgb(166, 153, 64)'], // Scale down > 100% sum.
		['color-mix(in hwb, hwb(120deg 10% 20%) 12.5%, hwb(30deg 30% 40%) 37.5%)', 'rgba(166, 153, 64, 0.5)'], // Scale up < 100% sum, causes alpha multiplication.
		['color-mix(in hwb, hwb(120deg 10% 20%) 0%, hwb(30deg 30% 40%))', 'rgb(153, 115, 77)'],

		['color-mix(in hwb, hwb(120deg 10% 20% / .4), hwb(30deg 30% 40% / .8))', 'rgba(142, 170, 59, 0.6)'],
		['color-mix(in hwb, hwb(120deg 10% 20% / .4) 25%, hwb(30deg 30% 40% / .8))', 'rgba(160, 149, 69, 0.7)'],
		['color-mix(in hwb, 25% hwb(120deg 10% 20% / .4), hwb(30deg 30% 40% / .8))', 'rgba(160, 149, 69, 0.7)'],
		['color-mix(in hwb, hwb(120deg 10% 20%), 25% hwb(30deg 30% 40% / .8))', 'rgba(95, 193, 36, 0.95)'],
		['color-mix(in hwb, hwb(120deg 10% 20% / .4), hwb(30deg 30% 40% / .8) 25%)', 'rgba(98, 184, 46, 0.5)'],
		['color-mix(in hwb, hwb(120deg 10% 20% / .4) 25%, hwb(30deg 30% 40% / .8) 75%)', 'rgba(160, 149, 69, 0.7)'],
		['color-mix(in hwb, hwb(120deg 10% 20% / .4) 30%, hwb(30deg 30% 40% / .8) 90%)', 'rgba(160, 149, 69, 0.7)'], // Scale down > 100% sum.
		['color-mix(in hwb, hwb(120deg 10% 20% / .4) 12.5%, hwb(30deg 30% 40% / .8) 37.5%)', 'rgba(160, 149, 69, 0.35)'], // Scale up < 100% sum, causes alpha multiplication.
		['color-mix(in hwb, hwb(120deg 10% 20% / .4) 0%, hwb(30deg 30% 40% / .8))', 'rgba(153, 115, 77, 0.8)'],

		['color-mix(in hwb, transparent, hwb(30deg 30% 40%))', canonicalize('hwb(30deg 30% 40% / 0.5)')],
		['color-mix(in hwb, transparent 10%, hwb(30deg 30% 40%))', canonicalize('hwb(30deg 30% 40% / 0.9)')],
		['color-mix(in hwb, hwb(120deg 10% 20% / 0), hwb(30deg 30% 40%))', canonicalize('hwb(75deg 30% 40% / 0.5)')],
		['color-mix(in hwb, hwb(120deg 10% 20% / 0) 10%, hwb(30deg 30% 40%))', canonicalize('hwb(39deg 30% 40% / 0.9)')],

		['color-mix(in hwb, hwb(40deg 30% 40%), hwb(60deg 30% 40%))', canonicalize('hwb(50deg 30% 40%)')],
		['color-mix(in hwb, hwb(60deg 30% 40%), hwb(40deg 30% 40%))', canonicalize('hwb(50deg 30% 40%)')],
		['color-mix(in hwb, hwb(50deg 30% 40%), hwb(330deg 30% 40%))', canonicalize('hwb(10deg 30% 40%)')],
		['color-mix(in hwb, hwb(330deg 30% 40%), hwb(50deg 30% 40%))', canonicalize('hwb(10deg 30% 40%)')],
		['color-mix(in hwb, hwb(20deg 30% 40%), hwb(320deg 30% 40%))', canonicalize('hwb(350deg 30% 40%)')],
		['color-mix(in hwb, hwb(320deg 30% 40%), hwb(20deg 30% 40%))', canonicalize('hwb(350deg 30% 40%)')],

		['color-mix(in hwb shorter hue, hwb(40deg 30% 40%), hwb(60deg 30% 40%))', canonicalize('hwb(50deg 30% 40%)')],
		['color-mix(in hwb shorter hue, hwb(60deg 30% 40%), hwb(40deg 30% 40%))', canonicalize('hwb(50deg 30% 40%)')],
		['color-mix(in hwb shorter hue, hwb(50deg 30% 40%), hwb(330deg 30% 40%))', canonicalize('hwb(10deg 30% 40%)')],
		['color-mix(in hwb shorter hue, hwb(330deg 30% 40%), hwb(50deg 30% 40%))', canonicalize('hwb(10deg 30% 40%)')],
		['color-mix(in hwb shorter hue, hwb(20deg 30% 40%), hwb(320deg 30% 40%))', canonicalize('hwb(350deg 30% 40%)')],
		['color-mix(in hwb shorter hue, hwb(320deg 30% 40%), hwb(20deg 30% 40%))', canonicalize('hwb(350deg 30% 40%)')],

		['color-mix(in hwb longer hue, hwb(40deg 30% 40%), hwb(60deg 30% 40%))', canonicalize('hwb(230deg 30% 40%)')],
		['color-mix(in hwb longer hue, hwb(60deg 30% 40%), hwb(40deg 30% 40%))', canonicalize('hwb(230deg 30% 40%)')],
		['color-mix(in hwb longer hue, hwb(50deg 30% 40%), hwb(330deg 30% 40%))', canonicalize('hwb(190deg 30% 40%)')],
		['color-mix(in hwb longer hue, hwb(330deg 30% 40%), hwb(50deg 30% 40%))', canonicalize('hwb(190deg 30% 40%)')],
		['color-mix(in hwb longer hue, hwb(20deg 30% 40%), hwb(320deg 30% 40%))', canonicalize('hwb(170deg 30% 40%)')],
		['color-mix(in hwb longer hue, hwb(320deg 30% 40%), hwb(20deg 30% 40%))', canonicalize('hwb(170deg 30% 40%)')],

		['color-mix(in hwb increasing hue, hwb(40deg 30% 40%), hwb(60deg 30% 40%))', canonicalize('hwb(50deg 30% 40%)')],
		['color-mix(in hwb increasing hue, hwb(60deg 30% 40%), hwb(40deg 30% 40%))', canonicalize('hwb(230deg 30% 40%)')],
		['color-mix(in hwb increasing hue, hwb(50deg 30% 40%), hwb(330deg 30% 40%))', canonicalize('hwb(190deg 30% 40%)')],
		['color-mix(in hwb increasing hue, hwb(330deg 30% 40%), hwb(50deg 30% 40%))', canonicalize('hwb(10deg 30% 40%)')],
		['color-mix(in hwb increasing hue, hwb(20deg 30% 40%), hwb(320deg 30% 40%))', canonicalize('hwb(170deg 30% 40%)')],
		['color-mix(in hwb increasing hue, hwb(320deg 30% 40%), hwb(20deg 30% 40%))', canonicalize('hwb(350deg 30% 40%)')],

		['color-mix(in hwb decreasing hue, hwb(40deg 30% 40%), hwb(60deg 30% 40%))', canonicalize('hwb(230deg 30% 40%)')],
		['color-mix(in hwb decreasing hue, hwb(60deg 30% 40%), hwb(40deg 30% 40%))', canonicalize('hwb(50deg 30% 40%)')],
		['color-mix(in hwb decreasing hue, hwb(50deg 30% 40%), hwb(330deg 30% 40%))', canonicalize('hwb(10deg 30% 40%)')],
		['color-mix(in hwb decreasing hue, hwb(330deg 30% 40%), hwb(50deg 30% 40%))', canonicalize('hwb(190deg 30% 40%)')],
		['color-mix(in hwb decreasing hue, hwb(20deg 30% 40%), hwb(320deg 30% 40%))', canonicalize('hwb(350deg 30% 40%)')],
		['color-mix(in hwb decreasing hue, hwb(320deg 30% 40%), hwb(20deg 30% 40%))', canonicalize('hwb(170deg 30% 40%)')],

		['color-mix(in hwb, hwb(none none none), hwb(none none none))', canonicalize('hwb(none none none)')],
		['color-mix(in hwb, hwb(none none none), hwb(30deg 30% 40%))', canonicalize('hwb(30deg 30% 40%)')],
		['color-mix(in hwb, hwb(120deg 10% 20%), hwb(none none none))', canonicalize('hwb(120deg 10% 20%)')],
		['color-mix(in hwb, hwb(120deg 10% none), hwb(30deg 30% 40%))', canonicalize('hwb(75deg 20% 40%)')],
		['color-mix(in hwb, hwb(120deg 10% 20%), hwb(30deg 30% none))', canonicalize('hwb(75deg 20% 20%)')],
		['color-mix(in hwb, hwb(none 10% 20%), hwb(30deg none 40%))', canonicalize('hwb(30deg 10% 30%)')],
		['color-mix(in hwb, hwb(120deg 10% 20% / none), hwb(30deg 30% 40%))', canonicalize('hwb(75deg 20% 30%)')],
		['color-mix(in hwb, hwb(120deg 10% 20% / none), hwb(30deg 30% 40% / 0.5))', canonicalize('hwb(75deg 20% 30% / 0.5)')],
		['color-mix(in hwb, hwb(120deg 10% 20% / none), hwb(30deg 30% 40% / none))', canonicalize('hwb(75deg 20% 30% / none)')],

		['color-mix(in lch, lch(10 20 30deg), lch(50 60 70deg))', canonicalize('lch(30 40 50)')],
		['color-mix(in lch, lch(10 20 30deg) 25%, lch(50 60 70deg))', canonicalize('lch(40 50 60)')],
		['color-mix(in lch, 25% lch(10 20 30deg), lch(50 60 70deg))', canonicalize('lch(40 50 60)')],
		['color-mix(in lch, lch(10 20 30deg), 25% lch(50 60 70deg))', canonicalize('lch(20 30 40)')],
		['color-mix(in lch, lch(10 20 30deg), lch(50 60 70deg) 25%)', canonicalize('lch(20 30 40)')],
		['color-mix(in lch, lch(10 20 30deg) 25%, lch(50 60 70deg) 75%)', canonicalize('lch(40 50 60)')],
		['color-mix(in lch, lch(10 20 30deg) 30%, lch(50 60 70deg) 90%)', canonicalize('lch(40 50 60)')],
		['color-mix(in lch, lch(10 20 30deg) 12.5%, lch(50 60 70deg) 37.5%)', canonicalize('lch(40 50 60 / 0.5)')],
		['color-mix(in lch, lch(10 20 30deg) 0%, lch(50 60 70deg))', canonicalize('lch(50 60 70)')],

		['color-mix(in lch, lch(10 20 30deg / .4), lch(50 60 70deg / .8))', canonicalize('lch(36.666664 46.666664 50 / 0.6)')],
		['color-mix(in lch, lch(10 20 30deg / .4) 25%, lch(50 60 70deg / .8))', canonicalize('lch(44.285713 54.285717 60 / 0.7)')],
		['color-mix(in lch, 25% lch(10 20 30deg / .4), lch(50 60 70deg / .8))', canonicalize('lch(44.285713 54.285717 60 / 0.7)')],
		['color-mix(in lch, lch(10 20 30deg / .4), 25% lch(50 60 70deg / .8))', canonicalize('lch(26 36 40 / 0.5)')],
		['color-mix(in lch, lch(10 20 30deg / .4), lch(50 60 70deg / .8) 25%)', canonicalize('lch(26 36 40 / 0.5)')],
		['color-mix(in lch, lch(10 20 30deg / .4) 25%, lch(50 60 70deg / .8) 75%)', canonicalize('lch(44.285713 54.285717 60 / 0.7)')],
		['color-mix(in lch, lch(10 20 30deg / .4) 30%, lch(50 60 70deg / .8) 90%)', canonicalize('lch(44.285713 54.285717 60 / 0.7)')],
		['color-mix(in lch, lch(10 20 30deg / .4) 12.5%, lch(50 60 70deg / .8) 37.5%)', canonicalize('lch(44.285713 54.285717 60 / 0.35)')],
		['color-mix(in lch, lch(10 20 30deg / .4) 0%, lch(50 60 70deg / .8))', canonicalize('lch(50 60 70 / 0.8)')],

		['color-mix(in lch, transparent, lch(30 40 30deg))', canonicalize('lch(30 40 30deg / 0.5)')],
		['color-mix(in lch, transparent 10%, lch(30 40 30deg))', canonicalize('lch(30 40 30deg / 0.9)')],
		['color-mix(in lch, lch(10 20 120deg / 0), lch(30 40 30deg))', canonicalize('lch(30 40 75deg / 0.5)')],
		['color-mix(in lch, lch(10 20 120deg / 0) 10%, lch(30 40 30deg))', canonicalize('lch(30 40 39deg / 0.9)')],

		['color-mix(in lch, lch(100 0 40deg), lch(100 0 60deg))', canonicalize('lch(100 0 50)')],
		['color-mix(in lch, lch(100 0 60deg), lch(100 0 40deg))', canonicalize('lch(100 0 50)')],
		['color-mix(in lch, lch(100 0 50deg), lch(100 0 330deg))', canonicalize('lch(100 0 10)')],
		['color-mix(in lch, lch(100 0 330deg), lch(100 0 50deg))', canonicalize('lch(100 0 10)')],
		['color-mix(in lch, lch(100 0 20deg), lch(100 0 320deg))', canonicalize('lch(100 0 350)')],
		['color-mix(in lch, lch(100 0 320deg), lch(100 0 20deg))', canonicalize('lch(100 0 350)')],

		['color-mix(in lch shorter hue, lch(100 0 40deg), lch(100 0 60deg))', canonicalize('lch(100 0 50)')],
		['color-mix(in lch shorter hue, lch(100 0 60deg), lch(100 0 40deg))', canonicalize('lch(100 0 50)')],
		['color-mix(in lch shorter hue, lch(100 0 50deg), lch(100 0 330deg))', canonicalize('lch(100 0 10)')],
		['color-mix(in lch shorter hue, lch(100 0 330deg), lch(100 0 50deg))', canonicalize('lch(100 0 10)')],
		['color-mix(in lch shorter hue, lch(100 0 20deg), lch(100 0 320deg))', canonicalize('lch(100 0 350)')],
		['color-mix(in lch shorter hue, lch(100 0 320deg), lch(100 0 20deg))', canonicalize('lch(100 0 350)')],

		['color-mix(in lch longer hue, lch(100 0 40deg), lch(100 0 60deg))', canonicalize('lch(100 0 230)')],
		['color-mix(in lch longer hue, lch(100 0 60deg), lch(100 0 40deg))', canonicalize('lch(100 0 230)')],
		['color-mix(in lch longer hue, lch(100 0 50deg), lch(100 0 330deg))', canonicalize('lch(100 0 190)')],
		['color-mix(in lch longer hue, lch(100 0 330deg), lch(100 0 50deg))', canonicalize('lch(100 0 190)')],
		['color-mix(in lch longer hue, lch(100 0 20deg), lch(100 0 320deg))', canonicalize('lch(100 0 170)')],
		['color-mix(in lch longer hue, lch(100 0 320deg), lch(100 0 20deg))', canonicalize('lch(100 0 170)')],

		['color-mix(in lch increasing hue, lch(100 0 40deg), lch(100 0 60deg))', canonicalize('lch(100 0 50)')],
		['color-mix(in lch increasing hue, lch(100 0 60deg), lch(100 0 40deg))', canonicalize('lch(100 0 230)')],
		['color-mix(in lch increasing hue, lch(100 0 50deg), lch(100 0 330deg))', canonicalize('lch(100 0 190)')],
		['color-mix(in lch increasing hue, lch(100 0 330deg), lch(100 0 50deg))', canonicalize('lch(100 0 10)')],
		['color-mix(in lch increasing hue, lch(100 0 20deg), lch(100 0 320deg))', canonicalize('lch(100 0 170)')],
		['color-mix(in lch increasing hue, lch(100 0 320deg), lch(100 0 20deg))', canonicalize('lch(100 0 350)')],

		['color-mix(in lch decreasing hue, lch(100 0 40deg), lch(100 0 60deg))', canonicalize('lch(100 0 230)')],
		['color-mix(in lch decreasing hue, lch(100 0 60deg), lch(100 0 40deg))', canonicalize('lch(100 0 50)')],
		['color-mix(in lch decreasing hue, lch(100 0 50deg), lch(100 0 330deg))', canonicalize('lch(100 0 10)')],
		['color-mix(in lch decreasing hue, lch(100 0 330deg), lch(100 0 50deg))', canonicalize('lch(100 0 190)')],
		['color-mix(in lch decreasing hue, lch(100 0 20deg), lch(100 0 320deg))', canonicalize('lch(100 0 350)')],
		['color-mix(in lch decreasing hue, lch(100 0 320deg), lch(100 0 20deg))', canonicalize('lch(100 0 170)')],

		['color-mix(in lch, lch(none none none), lch(none none none))', canonicalize('lch(none none none)')],
		['color-mix(in lch, lch(none none none), lch(50 60 70deg))', canonicalize('lch(50 60 70)')],
		['color-mix(in lch, lch(10 20 30deg), lch(none none none))', canonicalize('lch(10 20 30)')],
		['color-mix(in lch, lch(10 20 none), lch(50 60 70deg))', canonicalize('lch(30 40 70)')],
		['color-mix(in lch, lch(10 20 30deg), lch(50 60 none))', canonicalize('lch(30 40 30)')],
		['color-mix(in lch, lch(none 20 30deg), lch(50 none 70deg))', canonicalize('lch(50 20 50)')],
		['color-mix(in lch, lch(10 20 30deg / none), lch(50 60 70deg))', canonicalize('lch(30 40 50)')],
		['color-mix(in lch, lch(10 20 30deg / none), lch(50 60 70deg / 0.5))', canonicalize('lch(30 40 50 / 0.5)')],
		['color-mix(in lch, lch(10 20 30deg / none), lch(50 60 70deg / none))', canonicalize('lch(30 40 50 / none)')],

		['color-mix(in oklch, oklch(10 20 30deg), oklch(50 60 70deg))', canonicalize('oklch(30 40 50)')],
		['color-mix(in oklch, oklch(10 20 30deg) 25%, oklch(50 60 70deg))', canonicalize('oklch(40 50 60)')],
		['color-mix(in oklch, 25% oklch(10 20 30deg), oklch(50 60 70deg))', canonicalize('oklch(40 50 60)')],
		['color-mix(in oklch, oklch(10 20 30deg), 25% oklch(50 60 70deg))', canonicalize('oklch(20 30 40)')],
		['color-mix(in oklch, oklch(10 20 30deg), oklch(50 60 70deg) 25%)', canonicalize('oklch(20 30 40)')],
		['color-mix(in oklch, oklch(10 20 30deg) 25%, oklch(50 60 70deg) 75%)', canonicalize('oklch(40 50 60)')],
		['color-mix(in oklch, oklch(10 20 30deg) 30%, oklch(50 60 70deg) 90%)', canonicalize('oklch(40 50 60)')],
		['color-mix(in oklch, oklch(10 20 30deg) 12.5%, oklch(50 60 70deg) 37.5%)', canonicalize('oklch(40 50 60 / 0.5)')],
		['color-mix(in oklch, oklch(10 20 30deg) 0%, oklch(50 60 70deg))', canonicalize('oklch(50 60 70)')],

		['color-mix(in oklch, oklch(10 20 30deg / .4), oklch(50 60 70deg / .8))', canonicalize('oklch(36.666664 46.666664 50 / 0.6)')],
		['color-mix(in oklch, oklch(10 20 30deg / .4) 25%, oklch(50 60 70deg / .8))', canonicalize('oklch(44.285713 54.285717 60 / 0.7)')],
		['color-mix(in oklch, 25% oklch(10 20 30deg / .4), oklch(50 60 70deg / .8))', canonicalize('oklch(44.285713 54.285717 60 / 0.7)')],
		['color-mix(in oklch, oklch(10 20 30deg / .4), 25% oklch(50 60 70deg / .8))', canonicalize('oklch(26 36 40 / 0.5)')],
		['color-mix(in oklch, oklch(10 20 30deg / .4), oklch(50 60 70deg / .8) 25%)', canonicalize('oklch(26 36 40 / 0.5)')],
		['color-mix(in oklch, oklch(10 20 30deg / .4) 25%, oklch(50 60 70deg / .8) 75%)', canonicalize('oklch(44.285713 54.285717 60 / 0.7)')],
		['color-mix(in oklch, oklch(10 20 30deg / .4) 30%, oklch(50 60 70deg / .8) 90%)', canonicalize('oklch(44.285713 54.285717 60 / 0.7)')],
		['color-mix(in oklch, oklch(10 20 30deg / .4) 12.5%, oklch(50 60 70deg / .8) 37.5%)', canonicalize('oklch(44.285713 54.285717 60 / 0.35)')],
		['color-mix(in oklch, oklch(10 20 30deg / .4) 0%, oklch(50 60 70deg / .8))', canonicalize('oklch(50 60 70 / 0.8)')],

		['color-mix(in oklch, transparent, oklch(0.3 0.4 30deg))', canonicalize('oklch(0.3 0.4 30deg / 0.5)')],
		['color-mix(in oklch, transparent 10%, oklch(0.3 0.4 30deg))', canonicalize('oklch(0.3 0.4 30deg / 0.9)')],
		['color-mix(in oklch, oklch(0.1 0.2 120deg / 0), oklch(0.3 0.4 30deg))', canonicalize('oklch(0.3 0.4 75deg / 0.5)')],
		['color-mix(in oklch, oklch(0.1 0.2 120deg / 0) 10%, oklch(0.3 0.4 30deg))', canonicalize('oklch(0.3 0.4 39deg / 0.9)')],

		['color-mix(in oklch, oklch(100 0 40deg), oklch(100 0 60deg))', canonicalize('oklch(100 0 50)')],
		['color-mix(in oklch, oklch(100 0 60deg), oklch(100 0 40deg))', canonicalize('oklch(100 0 50)')],
		['color-mix(in oklch, oklch(100 0 50deg), oklch(100 0 330deg))', canonicalize('oklch(100 0 10)')],
		['color-mix(in oklch, oklch(100 0 330deg), oklch(100 0 50deg))', canonicalize('oklch(100 0 10)')],
		['color-mix(in oklch, oklch(100 0 20deg), oklch(100 0 320deg))', canonicalize('oklch(100 0 350)')],
		['color-mix(in oklch, oklch(100 0 320deg), oklch(100 0 20deg))', canonicalize('oklch(100 0 350)')],

		['color-mix(in oklch shorter hue, oklch(100 0 40deg), oklch(100 0 60deg))', canonicalize('oklch(100 0 50)')],
		['color-mix(in oklch shorter hue, oklch(100 0 60deg), oklch(100 0 40deg))', canonicalize('oklch(100 0 50)')],
		['color-mix(in oklch shorter hue, oklch(100 0 50deg), oklch(100 0 330deg))', canonicalize('oklch(100 0 10)')],
		['color-mix(in oklch shorter hue, oklch(100 0 330deg), oklch(100 0 50deg))', canonicalize('oklch(100 0 10)')],
		['color-mix(in oklch shorter hue, oklch(100 0 20deg), oklch(100 0 320deg))', canonicalize('oklch(100 0 350)')],
		['color-mix(in oklch shorter hue, oklch(100 0 320deg), oklch(100 0 20deg))', canonicalize('oklch(100 0 350)')],

		['color-mix(in oklch longer hue, oklch(100 0 40deg), oklch(100 0 60deg))', canonicalize('oklch(100 0 230)')],
		['color-mix(in oklch longer hue, oklch(100 0 60deg), oklch(100 0 40deg))', canonicalize('oklch(100 0 230)')],
		['color-mix(in oklch longer hue, oklch(100 0 50deg), oklch(100 0 330deg))', canonicalize('oklch(100 0 190)')],
		['color-mix(in oklch longer hue, oklch(100 0 330deg), oklch(100 0 50deg))', canonicalize('oklch(100 0 190)')],
		['color-mix(in oklch longer hue, oklch(100 0 20deg), oklch(100 0 320deg))', canonicalize('oklch(100 0 170)')],
		['color-mix(in oklch longer hue, oklch(100 0 320deg), oklch(100 0 20deg))', canonicalize('oklch(100 0 170)')],

		['color-mix(in oklch increasing hue, oklch(100 0 40deg), oklch(100 0 60deg))', canonicalize('oklch(100 0 50)')],
		['color-mix(in oklch increasing hue, oklch(100 0 60deg), oklch(100 0 40deg))', canonicalize('oklch(100 0 230)')],
		['color-mix(in oklch increasing hue, oklch(100 0 50deg), oklch(100 0 330deg))', canonicalize('oklch(100 0 190)')],
		['color-mix(in oklch increasing hue, oklch(100 0 330deg), oklch(100 0 50deg))', canonicalize('oklch(100 0 10)')],
		['color-mix(in oklch increasing hue, oklch(100 0 20deg), oklch(100 0 320deg))', canonicalize('oklch(100 0 170)')],
		['color-mix(in oklch increasing hue, oklch(100 0 320deg), oklch(100 0 20deg))', canonicalize('oklch(100 0 350)')],

		['color-mix(in oklch decreasing hue, oklch(100 0 40deg), oklch(100 0 60deg))', canonicalize('oklch(100 0 230)')],
		['color-mix(in oklch decreasing hue, oklch(100 0 60deg), oklch(100 0 40deg))', canonicalize('oklch(100 0 50)')],
		['color-mix(in oklch decreasing hue, oklch(100 0 50deg), oklch(100 0 330deg))', canonicalize('oklch(100 0 10)')],
		['color-mix(in oklch decreasing hue, oklch(100 0 330deg), oklch(100 0 50deg))', canonicalize('oklch(100 0 190)')],
		['color-mix(in oklch decreasing hue, oklch(100 0 20deg), oklch(100 0 320deg))', canonicalize('oklch(100 0 350)')],
		['color-mix(in oklch decreasing hue, oklch(100 0 320deg), oklch(100 0 20deg))', canonicalize('oklch(100 0 170)')],

		['color-mix(in oklch, oklch(none none none), oklch(none none none))', canonicalize('oklch(none none none)')],
		['color-mix(in oklch, oklch(none none none), oklch(50 60 70deg))', canonicalize('oklch(50 60 70)')],
		['color-mix(in oklch, oklch(10 20 30deg), oklch(none none none))', canonicalize('oklch(10 20 30)')],
		['color-mix(in oklch, oklch(10 20 none), oklch(50 60 70deg))', canonicalize('oklch(30 40 70)')],
		['color-mix(in oklch, oklch(10 20 30deg), oklch(50 60 none))', canonicalize('oklch(30 40 30)')],
		['color-mix(in oklch, oklch(none 20 30deg), oklch(50 none 70deg))', canonicalize('oklch(50 20 50)')],
		['color-mix(in oklch, oklch(10 20 30deg / none), oklch(50 60 70deg))', canonicalize('oklch(30 40 50)')],
		['color-mix(in oklch, oklch(10 20 30deg / none), oklch(50 60 70deg / 0.5))', canonicalize('oklch(30 40 50 / 0.5)')],
		['color-mix(in oklch, oklch(10 20 30deg / none), oklch(50 60 70deg / none))', canonicalize('oklch(30 40 50 / none)')],

		['color-mix(in oklch, oklch(none none none), oklch(none none none))', canonicalize('oklch(none none none)')],
		['color-mix(in oklch, oklch(none none none), oklch(0.5 0.6 70deg))', canonicalize('oklch(0.5 0.6 70)')],
		['color-mix(in oklch, oklch(0.1 0.2 30deg), oklch(none none none))', canonicalize('oklch(0.1 0.2 30)')],
		['color-mix(in oklch, oklch(0.1 0.2 none), oklch(0.5 0.6 70deg))', canonicalize('oklch(0.3 0.4 70)')],
		['color-mix(in oklch, oklch(0.1 0.2 30deg), oklch(0.5 0.6 none))', canonicalize('oklch(0.3 0.4 30)')],
		['color-mix(in oklch, oklch(none 0.2 30deg), oklch(0.5 none 70deg))', canonicalize('oklch(0.5 0.2 50)')],
		['color-mix(in oklch, oklch(0.1 0.2 30deg / none), oklch(0.5 0.6 70deg))', canonicalize('oklch(0.3 0.4 50)')],
		['color-mix(in oklch, oklch(0.1 0.2 30deg / none), oklch(0.5 0.6 70deg / 0.5))', canonicalize('oklch(0.3 0.4 50 / 0.5)')],
		['color-mix(in oklch, oklch(0.1 0.2 30deg / none), oklch(0.5 0.6 70deg / none))', canonicalize('oklch(0.3 0.4 50 / none)')],

		['color-mix(in oklch, oklch(0.1 0.2 30deg / 25%) 0%, oklch(0.5 none none / none))', canonicalize('oklch(0.5 0.2 30 / 0.25)')],
		['color-mix(in oklch, oklch(0.1 0.2 30deg / 25%) 0%, oklch(none 0.5 none / none))', canonicalize('oklch(0.1 0.5 30 / 0.25)')],
		['color-mix(in oklch, oklch(0.1 0.2 30deg / 25%) 0%, oklch(none none 90deg / none))', canonicalize('oklch(0.1 0.2 90 / 0.25)')],
		['color-mix(in oklch, oklch(0.1 0.2 30deg / 25%) 0%, oklch(0.5 0.5 none / none))', canonicalize('oklch(0.5 0.5 30 / 0.25)')],
		['color-mix(in oklch, oklch(0.1 0.2 30deg / 25%) 0%, oklch(none none none / 0.5))', canonicalize('oklch(0.1 0.2 30 / 0.5)')],
		['color-mix(in oklch, oklch(0.1 0.2 30deg / 25%) 0%, oklch(0.5 none none / 0.5))', canonicalize('oklch(0.5 0.2 30 / 0.5)')],
		// Achromatic colors should have powerless hues. https://www.w3.org/TR/css-color-4/#lab-to-lch
		['color-mix(in oklch, oklab(0.5 0 0), black)', canonicalize('oklch(0.25 0 none)')],

		// https://github.com/w3c/csswg-drafts/issues/8563
		['color-mix(in hsl, hsl(90deg 100% none), hsl(90deg 100% 50%))', canonicalize('hsl(90deg 100% 50%)')],
		['color-mix(in oklch, oklch(none 0.265 135.9), oklch(89% 0.265 135.9))', canonicalize('oklch(0.89 0.265 135.9)')],
		['color-mix(in oklch, hsl(90deg 100% none), hsl(90deg 100% 50%))', canonicalize('rgb(179, 239, 150)')],
		['color-mix(in oklch, hsl(90deg 100% none), hsl(90deg 100% 50%))', canonicalize('oklch(89% 0.1325 135.9)')],
		['color-mix(in oklch, hsl(90deg 100% none), oklch(89% 0.265 135.9))', canonicalize('oklch(89% 0.1325 135.9)')],
		['color-mix(in oklch, oklch(89% 0 135.9), oklch(89% 0.265 135.9))', canonicalize('oklch(89% 0.1325 135.9)')],
		['color-mix(in oklch, oklch(89% none 135.9), oklch(89% 0.265 135.9))', canonicalize('oklch(89% 0.265 135.9)')],
	];

	for (const test of tests) {
		assert.deepStrictEqual(
			serialize_sRGB_data(color(parse(test[0]))),
			test[1],
			`"${test[0]}" : ${test[1]}`,
		);
	}
}

{
	const tests = [
		['color-mix(in lab, transparent, lab(30 40 50))', canonicalize('lab(30 40 50 / 0.5)')],
		['color-mix(in lab, transparent 10%, lab(30 40 50))', canonicalize('lab(30 40 50 / 0.9)')],
		['color-mix(in lab, lab(10 20 30 / 0), lab(30 40 50))', canonicalize('lab(30 40 50 / 0.5)')],
		['color-mix(in lab, lab(10 20 30 / 0) 10%, lab(30 40 50))', canonicalize('lab(30 40 50 / 0.9)')],

		['color-mix(in oklab, transparent, oklab(0.3 0.4 0.5))', canonicalize('oklab(0.3 0.4 0.5 / 0.5)')],
		['color-mix(in oklab, transparent 10%, oklab(0.3 0.4 0.5))', canonicalize('oklab(0.3 0.4 0.5 / 0.9)')],
		['color-mix(in oklab, oklab(0.1 0.2 0.3 / 0), oklab(0.3 0.4 0.5))', canonicalize('oklab(0.3 0.4 0.5 / 0.5)')],
		['color-mix(in oklab, oklab(0.1 0.2 0.3 / 0) 10%, oklab(0.3 0.4 0.5))', canonicalize('oklab(0.3 0.4 0.5 / 0.9)')],
	];

	for (const test of tests) {
		assert.deepStrictEqual(
			serialize_sRGB_data(color(parse(test[0]))),
			test[1],
			`"${test[0]}" : ${test[1]}`,
		);
	}
}

{
	for (const colorSpace of ['lab', 'oklab']) {
		const tests = [
			[`color-mix(in ${colorSpace}, ${colorSpace}(10 20 30), ${colorSpace}(50 60 70))`, canonicalize(`${colorSpace}(30 40 50)`)],
			[`color-mix(in ${colorSpace}, ${colorSpace}(10 20 30) 25%, ${colorSpace}(50 60 70))`, canonicalize(`${colorSpace}(40 50 60)`)],
			[`color-mix(in ${colorSpace}, 25% ${colorSpace}(10 20 30), ${colorSpace}(50 60 70))`, canonicalize(`${colorSpace}(40 50 60)`)],
			[`color-mix(in ${colorSpace}, ${colorSpace}(10 20 30), 25% ${colorSpace}(50 60 70))`, canonicalize(`${colorSpace}(20 30 40)`)],
			[`color-mix(in ${colorSpace}, ${colorSpace}(10 20 30), ${colorSpace}(50 60 70) 25%)`, canonicalize(`${colorSpace}(20 30 40)`)],
			[`color-mix(in ${colorSpace}, ${colorSpace}(10 20 30) 25%, ${colorSpace}(50 60 70) 75%)`, canonicalize(`${colorSpace}(40 50 60)`)],
			[`color-mix(in ${colorSpace}, ${colorSpace}(10 20 30) 30%, ${colorSpace}(50 60 70) 90%)`, canonicalize(`${colorSpace}(40 50 60)`)],
			[`color-mix(in ${colorSpace}, ${colorSpace}(10 20 30) 12.5%, ${colorSpace}(50 60 70) 37.5%)`, canonicalize(`${colorSpace}(40 50 60 / 0.5)`)],
			[`color-mix(in ${colorSpace}, ${colorSpace}(10 20 30) 0%, ${colorSpace}(50 60 70))`, canonicalize(`${colorSpace}(50 60 70)`)],

			[`color-mix(in ${colorSpace}, ${colorSpace}(10 20 30 / .4), ${colorSpace}(50 60 70 / .8))`, canonicalize(`${colorSpace}(36.666664 46.666664 56.666664 / 0.6)`)],
			[`color-mix(in ${colorSpace}, ${colorSpace}(10 20 30 / .4) 25%, ${colorSpace}(50 60 70 / .8))`, canonicalize(`${colorSpace}(44.285713 54.285717 64.28571 / 0.7)`)],
			[`color-mix(in ${colorSpace}, 25% ${colorSpace}(10 20 30 / .4), ${colorSpace}(50 60 70 / .8))`, canonicalize(`${colorSpace}(44.285713 54.285717 64.28571 / 0.7)`)],
			[`color-mix(in ${colorSpace}, ${colorSpace}(10 20 30 / .4), 25% ${colorSpace}(50 60 70 / .8))`, canonicalize(`${colorSpace}(26 36 46 / 0.5)`)],
			[`color-mix(in ${colorSpace}, ${colorSpace}(10 20 30 / .4), ${colorSpace}(50 60 70 / .8) 25%)`, canonicalize(`${colorSpace}(26 36 46 / 0.5)`)],
			[`color-mix(in ${colorSpace}, ${colorSpace}(10 20 30 / .4) 25%, ${colorSpace}(50 60 70 / .8) 75%)`, canonicalize(`${colorSpace}(44.285713 54.285717 64.28571 / 0.7)`)],
			[`color-mix(in ${colorSpace}, ${colorSpace}(10 20 30 / .4) 30%, ${colorSpace}(50 60 70 / .8) 90%)`, canonicalize(`${colorSpace}(44.285713 54.285717 64.28571 / 0.7)`)],
			[`color-mix(in ${colorSpace}, ${colorSpace}(10 20 30 / .4) 12.5%, ${colorSpace}(50 60 70 / .8) 37.5%)`, canonicalize(`${colorSpace}(44.285713 54.285717 64.28571 / 0.35)`)],
			[`color-mix(in ${colorSpace}, ${colorSpace}(10 20 30 / .4) 0%, ${colorSpace}(50 60 70 / .8))`, canonicalize(`${colorSpace}(50 60 70 / 0.8)`)],

			[`color-mix(in ${colorSpace}, ${colorSpace}(none none none), ${colorSpace}(none none none))`, canonicalize(`${colorSpace}(none none none)`)],
			[`color-mix(in ${colorSpace}, ${colorSpace}(none none none), ${colorSpace}(50 60 70))`, canonicalize(`${colorSpace}(50 60 70)`)],
			[`color-mix(in ${colorSpace}, ${colorSpace}(10 20 30), ${colorSpace}(none none none))`, canonicalize(`${colorSpace}(10 20 30)`)],
			[`color-mix(in ${colorSpace}, ${colorSpace}(10 20 none), ${colorSpace}(50 60 70))`, canonicalize(`${colorSpace}(30 40 70)`)],
			[`color-mix(in ${colorSpace}, ${colorSpace}(10 20 30), ${colorSpace}(50 60 none))`, canonicalize(`${colorSpace}(30 40 30)`)],
			[`color-mix(in ${colorSpace}, ${colorSpace}(none 20 30), ${colorSpace}(50 none 70))`, canonicalize(`${colorSpace}(50 20 50)`)],
			[`color-mix(in ${colorSpace}, ${colorSpace}(10 20 30 / none), ${colorSpace}(50 60 70))`, canonicalize(`${colorSpace}(30 40 50)`)],
			[`color-mix(in ${colorSpace}, ${colorSpace}(10 20 30 / none), ${colorSpace}(50 60 70 / 0.5))`, canonicalize(`${colorSpace}(30 40 50 / 0.5)`)],
			[`color-mix(in ${colorSpace}, ${colorSpace}(10 20 30 / none), ${colorSpace}(50 60 70 / none))`, canonicalize(`${colorSpace}(30 40 50 / none)`)],
		];

		for (const test of tests) {
			assert.deepStrictEqual(
				serialize_sRGB_data(color(parse(test[0]))),
				test[1],
				`"${test[0]}" : ${test[1]}`,
			);
		}
	}
}

{
	for (const colorSpace of ['srgb', 'srgb-linear', 'display-p3', 'a98-rgb', 'prophoto-rgb', 'rec2020', 'xyz', 'xyz-d50', 'xyz-d65']) {
		const tests = [
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3), color(${colorSpace} .5 .6 .7))`, canonicalize(`color(${colorSpace} 0.3 0.4 0.5)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3) 25%, color(${colorSpace} .5 .6 .7))`, canonicalize(`color(${colorSpace} 0.4 0.5 0.6)`)],
			[`color-mix(in ${colorSpace}, 25% color(${colorSpace} .1 .2 .3), color(${colorSpace} .5 .6 .7))`, canonicalize(`color(${colorSpace} 0.4 0.5 0.6)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3), color(${colorSpace} .5 .6 .7) 25%)`, canonicalize(`color(${colorSpace} 0.2 0.3 0.4)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3), 25% color(${colorSpace} .5 .6 .7))`, canonicalize(`color(${colorSpace} 0.2 0.3 0.4)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3) 25%, color(${colorSpace} .5 .6 .7) 75%)`, canonicalize(`color(${colorSpace} 0.4 0.5 0.6)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3) 30%, color(${colorSpace} .5 .6 .7) 90%)`, canonicalize(`color(${colorSpace} 0.4 0.5 0.6)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3) 12.5%, color(${colorSpace} .5 .6 .7) 37.5%)`, canonicalize(`color(${colorSpace} 0.4 0.5 0.6 / 0.5)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3) 0%, color(${colorSpace} .5 .6 .7))`, canonicalize(`color(${colorSpace} 0.5 0.6 0.7)`)],

			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3 / .5), color(${colorSpace} .5 .6 .7 / .8))`, canonicalize(`color(${colorSpace} 0.3461539 0.4461539 0.5461539 / 0.65)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3 / .4) 25%, color(${colorSpace} .5 .6 .7 / .8))`, canonicalize(`color(${colorSpace} 0.44285715 0.54285717 0.64285713 / 0.7)`)],
			[`color-mix(in ${colorSpace}, 25% color(${colorSpace} .1 .2 .3 / .4), color(${colorSpace} .5 .6 .7 / .8))`, canonicalize(`color(${colorSpace} 0.44285715 0.54285717 0.64285713 / 0.7)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3 / .4), color(${colorSpace} .5 .6 .7 / .8) 25%)`, canonicalize(`color(${colorSpace} 0.26000002 0.36 0.46 / 0.5)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3 / .4), 25% color(${colorSpace} .5 .6 .7 / .8))`, canonicalize(`color(${colorSpace} 0.26000002 0.36 0.46 / 0.5)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3 / .4) 25%, color(${colorSpace} .5 .6 .7 / .8) 75%)`, canonicalize(`color(${colorSpace} 0.44285715 0.54285717 0.64285713 / 0.7)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3 / .4) 30%, color(${colorSpace} .5 .6 .7 / .8) 90%)`, canonicalize(`color(${colorSpace} 0.44285715 0.54285717 0.64285713 / 0.7)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3 / .4) 12.5%, color(${colorSpace} .5 .6 .7 / .8) 37.5%)`, canonicalize(`color(${colorSpace} 0.44285715 0.54285717 0.64285713 / 0.35)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3 / .4) 0%, color(${colorSpace} .5 .6 .7 / .8))`, canonicalize(`color(${colorSpace} 0.5 0.6 0.7 / 0.8)`)],

			[`color-mix(in ${colorSpace}, transparent, color(${colorSpace} 0.3 0.4 0.5))`, canonicalize(`color(${colorSpace} 0.3 0.4 0.5 / 0.5)`)],
			[`color-mix(in ${colorSpace}, transparent 10%, color(${colorSpace} 0.3 0.4 0.5))`, canonicalize(`color(${colorSpace} 0.3 0.4 0.5 / 0.9)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} 0.1 0.2 0.3 / 0), color(${colorSpace} 0.3 0.4 0.5))`, canonicalize(`color(${colorSpace} 0.3 0.4 0.5 / 0.5)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} 0.1 0.2 0.3 / 0) 10%, color(${colorSpace} 0.3 0.4 0.5))`, canonicalize(`color(${colorSpace} 0.3 0.4 0.5 / 0.9)`)],

			[`color-mix(in ${colorSpace}, color(${colorSpace} 2 3 4 / 5), color(${colorSpace} 4 6 8 / 10))`, canonicalize(`color(${colorSpace} 3 4.5 6)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} -2 -3 -4), color(${colorSpace} -4 -6 -8))`, canonicalize(`color(${colorSpace} -3 -4.5 -6)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} -2 -3 -4 / -5), color(${colorSpace} -4 -6 -8 / -10))`, canonicalize(`color(${colorSpace} 0 0 0 / 0)`)],

			[`color-mix(in ${colorSpace}, color(${colorSpace} none none none), color(${colorSpace} none none none))`, canonicalize(`color(${colorSpace} none none none)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} none none none), color(${colorSpace} .5 .6 .7))`, canonicalize(`color(${colorSpace} 0.5 0.6 0.7)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3), color(${colorSpace} none none none))`, canonicalize(`color(${colorSpace} 0.1 0.2 0.3)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 none), color(${colorSpace} .5 .6 .7))`, canonicalize(`color(${colorSpace} 0.3 0.4 0.7)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3), color(${colorSpace} .5 .6 none))`, canonicalize(`color(${colorSpace} 0.3 0.4 0.3)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} none .2 .3), color(${colorSpace} .5 none .7))`, canonicalize(`color(${colorSpace} 0.5 0.2 0.5)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3 / none), color(${colorSpace} .5 .6 .7))`, canonicalize(`color(${colorSpace} 0.3 0.4 0.5)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3 / none), color(${colorSpace} .5 .6 .7 / 0.5))`, canonicalize(`color(${colorSpace} 0.3 0.4 0.5 / 0.5)`)],
			[`color-mix(in ${colorSpace}, color(${colorSpace} .1 .2 .3 / none), color(${colorSpace} .5 .6 .7 / none))`, canonicalize(`color(${colorSpace} 0.3 0.4 0.5 / none)`)],
		];

		for (const test of tests) {
			assert.deepStrictEqual(
				serialize_sRGB_data(color(parse(test[0]))),
				test[1],
				`"${test[0]}" : ${test[1]}`,
			);
		}
	}
}
