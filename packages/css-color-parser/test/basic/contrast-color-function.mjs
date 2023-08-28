import { color } from '@csstools/css-color-parser';
import assert from 'assert';
import { parse } from '../util/parse.mjs';
import { serialize_sRGB_data } from '../util/serialize.mjs';

const tests = [
	['contrast-color(black)', 'rgb(255, 255, 255)'],
	['contrast-color(#333)', 'rgb(255, 255, 255)'],
	['contrast-color(grey)', 'rgb(255, 255, 255)'],
	['contrast-color(#ccc)', 'rgb(0, 0, 0)'],
	['contrast-color(white)', 'rgb(0, 0, 0)'],
	['contrast-color(#1234b0)', 'rgb(255, 255, 255)'],
	['contrast-color(#b012a0)', 'rgb(255, 255, 255)'],

	['contrast-color(rgb(0 0 0))', 'rgb(255, 255, 255)'],
	['contrast-color(color(srgb 0 0 0))', 'rgb(255, 255, 255)'],
	['contrast-color(color(display-p3 0 0 0))', 'rgb(255, 255, 255)'],
	['contrast-color(rgb(255 255 255))', 'rgb(0, 0, 0)'],
	['contrast-color(color(srgb 1 1 1))', 'rgb(0, 0, 0)'],
	['contrast-color(color(display-p3 1 1 1))', 'rgb(0, 0, 0)'],

	['contrast-color(rgb(0 0 0 / 0))', 'rgb(255, 255, 255)'],
	['contrast-color(rgb(0 0 0 / 0.5))', 'rgb(255, 255, 255)'],
	['contrast-color(rgb(255 255 255 / 0))', 'rgb(0, 0, 0)'],
	['contrast-color(rgb(255 255 255 / 0.5))', 'rgb(0, 0, 0)'],

	['contrast-color(contrast-color(#b012a0))', 'rgb(0, 0, 0)'],

	['contrast-color(hsl(45deg 30% 0%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(45deg 30% none))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(45deg 30% 10%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(45deg 30% 20%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(45deg 30% 30%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(45deg 30% 40%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(45deg 30% 50%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(45deg 30% 60%))', 'rgb(0, 0, 0)'],
	['contrast-color(hsl(45deg 30% 70%))', 'rgb(0, 0, 0)'],
	['contrast-color(hsl(45deg 30% 80%))', 'rgb(0, 0, 0)'],
	['contrast-color(hsl(45deg 30% 90%))', 'rgb(0, 0, 0)'],
	['contrast-color(hsl(45deg 30% 100%))', 'rgb(0, 0, 0)'],

	['contrast-color(hsl(260deg 30% 0%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(260deg 30% none))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(260deg 30% 10%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(260deg 30% 20%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(260deg 30% 30%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(260deg 30% 40%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(260deg 30% 50%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(260deg 30% 60%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(260deg 30% 70%))', 'rgb(255, 255, 255)'],
	['contrast-color(hsl(260deg 30% 80%))', 'rgb(0, 0, 0)'],
	['contrast-color(hsl(260deg 30% 90%))', 'rgb(0, 0, 0)'],
	['contrast-color(hsl(260deg 30% 100%))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(none 30% 90deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(10% 30% 90deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(20% 30% 90deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(30% 30% 90deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(40% 30% 90deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(50% 30% 90deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(60% 30% 90deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(70% 30% 90deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(80% 30% 90deg))', 'rgb(0, 0, 0)'],
	['contrast-color(oklch(90% 30% 90deg))', 'rgb(0, 0, 0)'],
	['contrast-color(oklch(100% 30% 90deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(none 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(10% 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(20% 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(30% 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(40% 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(50% 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(60% 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(70% 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(80% 30% 300deg))', 'rgb(0, 0, 0)'],
	['contrast-color(oklch(90% 30% 300deg))', 'rgb(0, 0, 0)'],
	['contrast-color(oklch(100% 30% 300deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(72% 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(72.5% 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(72.55% 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(72.56% 30% 300deg))', 'rgb(0, 0, 0)'],
	['contrast-color(oklch(72.57% 30% 300deg))', 'rgb(0, 0, 0)'],
	['contrast-color(oklch(73% 30% 300deg))', 'rgb(0, 0, 0)'],
	['contrast-color(oklch(78% 30% 300deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 0deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 0deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 10deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 10deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 20deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 20deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 30deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 30deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 40deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 40deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 50deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 50deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 60deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 60deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 70deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 70deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 80deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 80deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 90deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 90deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 100deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 100deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 110deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 110deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 120deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 120deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 130deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 130deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 140deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 140deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 150deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 150deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 160deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 160deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 170deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 170deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 180deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 180deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 190deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 190deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 200deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 200deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 210deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 210deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 220deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 220deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 230deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 230deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 240deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 240deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 250deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 250deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 260deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 260deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 270deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 270deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 280deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 280deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 290deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 290deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 300deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 310deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 310deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 320deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 320deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 330deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 330deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 340deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 340deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 350deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 350deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 30% 360deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 30% 360deg))', 'rgb(0, 0, 0)'],


	// 50%
	['contrast-color(oklch(68% 50% 0deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 0deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 10deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 10deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 20deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 20deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 30deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 30deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 40deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 40deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 50deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 50deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 60deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 60deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 70deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 70deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 80deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 80deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 90deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 90deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 100deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 100deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 110deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 110deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 120deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 120deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 130deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 130deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 140deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 140deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 150deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 150deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 160deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 160deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 170deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 170deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 180deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 180deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 190deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 190deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 200deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 200deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 210deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 210deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 220deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 220deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 230deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 230deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 240deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 240deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 250deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 250deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 260deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 260deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 270deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 270deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 280deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 280deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 290deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 290deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 300deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 310deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 310deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 320deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 320deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 330deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 330deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 340deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 340deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 350deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 350deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 50% 360deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 50% 360deg))', 'rgb(0, 0, 0)'],

	// 0%
	['contrast-color(oklch(68% 75% 0deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(75% 75% 0deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 10deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 10deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 20deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 20deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 30deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 30deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 40deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 40deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 50deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 50deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 60deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 60deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 70deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 70deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 80deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 80deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 90deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 90deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 100deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 100deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 110deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 110deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 120deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 120deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 130deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 130deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 140deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 140deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 150deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 150deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 160deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 160deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 170deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 170deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 180deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 180deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 190deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 190deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 200deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 200deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 210deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 210deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 220deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 220deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 230deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 230deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 240deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 240deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 250deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 250deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 260deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 260deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 270deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 270deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 280deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 280deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 290deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 290deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 300deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 300deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 310deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 310deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 320deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 320deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 330deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 330deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 340deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 340deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 350deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 350deg))', 'rgb(0, 0, 0)'],

	['contrast-color(oklch(68% 75% 360deg))', 'rgb(255, 255, 255)'],
	['contrast-color(oklch(74% 75% 360deg))', 'rgb(0, 0, 0)'],
];

for (const test of tests) {
	assert.deepStrictEqual(
		serialize_sRGB_data(
			color(
				parse(test[0]),
				{ flags: { experimentalContrastColorFunction: true } },
			),
		),
		test[1],
		`"${test[0]}" : ${test[1]}`,
	);
}

{
	[
		'contrast-color(black)',
		'color-mix(in srgb, contrast-color(black), contrast-color(white))',
		'rgb(from contrast-color(black) r g b)',
	].forEach((testCase) => {
		assert.ok(
			color(parse(testCase)).syntaxFlags.has('experimental'),
		);
	});
}
