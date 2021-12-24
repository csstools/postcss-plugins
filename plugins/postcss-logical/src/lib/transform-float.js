import { cloneRuleAsDir } from './clone-rule-for-variables';
import { varId } from './util/counter';

export default (decl, values, dir, preserve) => {
	if (/^inline-start$/i.test(decl.value)) {
		if (dir === 'ltr') {
			lDecl(decl);
			clean(decl, preserve);
			return;
		} else if (dir === 'rtl') {
			rDecl(decl);
			clean(decl, preserve);
			return;
		} else {
			const id = varId(decl);
			const dirLtr = cloneRuleAsDir(decl, 'ltr');
			const dirRtl = cloneRuleAsDir(decl, 'rtl');

			const ltrClone = decl.clone();
			ltrClone.prop = `--logical-${id}`;
			ltrClone.value = 'left';

			dirLtr.append(ltrClone);

			const rtlClone = decl.clone();
			rtlClone.prop = `--logical-${id}`;
			rtlClone.value = 'right';

			dirRtl.append(rtlClone);

			decl.cloneBefore({ value: 'left' });
			decl.cloneBefore({ value: `var(--logical-${id})` });
			clean(decl, preserve);
			return;
		}
	}

	if (/^inline-end$/i.test(decl.value)) {
		if (dir === 'ltr') {
			rDecl(decl);
			clean(decl, preserve);
			return;
		} else if (dir === 'rtl') {
			lDecl(decl);
			clean(decl, preserve);
			return;
		} else {
			const id = varId(decl);
			const dirLtr = cloneRuleAsDir(decl, 'ltr');
			const dirRtl = cloneRuleAsDir(decl, 'rtl');

			const ltrClone = decl.clone();
			ltrClone.prop = `--logical-${id}`;
			ltrClone.value = 'right';

			dirLtr.append(ltrClone);

			const rtlClone = decl.clone();
			rtlClone.prop = `--logical-${id}`;
			rtlClone.value = 'left';

			dirRtl.append(rtlClone);

			decl.cloneBefore({ value: 'right' });
			decl.cloneBefore({ value: `var(--logical-${id})` });
			clean(decl, preserve);
			return;
		}
	}
};

function lDecl(decl) {
	return decl.cloneBefore({ value: 'left' });
}

function rDecl(decl) {
	return decl.cloneBefore({ value: 'right' });
}

function clean(decl, preserve) {
	if (!preserve) decl.remove();
}
