import { testPack } from '@csstools/pack-test';

if (Number(process.versions.node.split('.')[0]) < 22) {
	process.exit(0);
}

await testPack('@csstools/stylelint-at-risk');
