# USAGE:
# python3 -m pip install coloraide
# npm run generate-color-corpus

from coloraide import Color
import json

# This is a simple script to generate a JSON file with colors.
# It is not perfect, but it is good enough for testing.

lab_in_gamut = []
lab_out_of_gamut = []

aR = [-127, 0, 128]
bR = [-127, 0, 128]

for aX in range(-120, 120, 10):
	aR.append(aX)

for bX in range(-120, 120, 10):
	bR.append(bX)

for l in range(0, 100, 5):
	for a in aR:
		for b in bR:
			color = Color('lab({}% {} {})'.format(l, a, b))
			if color.in_gamut('lab'):
				if color.in_gamut('srgb'):
					lab_in_gamut.append([[l,a,b], list(map(lambda x: x * 100, color.convert('srgb').coords()))])
				else:
					lab_out_of_gamut.append([[l,a,b], list(map(lambda x: x * 100, color.convert('srgb').fit('srgb', method='clip').coords()))])
			else:
				if color.in_gamut('srgb'):
					lab_in_gamut.append([[l,a,b], list(map(lambda x: x * 100, color.convert('srgb').coords()))])
				else:
					lab_out_of_gamut.append([[l,a,b], list(map(lambda x: x * 100, color.convert('srgb').fit('srgb', method='clip').coords()))])

with open('./test/color/corpus-lab-in-gamut.json', 'w') as lab_in_gamut_file:
	json.dump(lab_in_gamut, lab_in_gamut_file)

with open('./test/color/corpus-lab-out-of-gamut.json', 'w') as lab_out_of_gamut_file:
	json.dump(lab_out_of_gamut, lab_out_of_gamut_file)

lch_in_gamut = []
lch_out_of_gamut = []

for l in range(0, 100, 5):
	for c in range(0, 230, 10):
		for h in range(0, 360, 15):
			color = Color('lch({}% {} {})'.format(l, c, h))
			if color.in_gamut('srgb'):
				lch_in_gamut.append([[l,c,h], list(map(lambda x: x * 100, color.convert('srgb').coords()))])
			else:
				lch_out_of_gamut.append([[l,c,h], list(map(lambda x: x * 100, color.convert('srgb').fit('srgb', method='clip').coords()))])

with open('./test/color/corpus-lch-in-gamut.json', 'w') as lch_in_gamut_file:
	json.dump(lch_in_gamut, lch_in_gamut_file)

with open('./test/color/corpus-lch-out-of-gamut.json', 'w') as lch_out_of_gamut_file:
	json.dump(lch_out_of_gamut, lch_out_of_gamut_file)
