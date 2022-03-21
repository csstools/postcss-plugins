(() => {
	const wordList = document.querySelector('.ppe-word-rotate');

	if (!wordList) {
		return;
	}

	const mq = '(prefers-reduced-motion: no-preference)';
	const canRun = window.matchMedia(mq) === true || window.matchMedia(mq).matches === true;
	const words = wordList.children;
	const ROTATION_DURATION = 3000;

	let x = 0;
	rotate(x);

	if (canRun) {
		setInterval(() => {
			x = ++x % words.length;
			rotate(x);
		}, ROTATION_DURATION);
	}

	function rotate(start) {
		for (let i = 0; i < words.length; ++i) {
			const j = (start + i) % words.length;
			const percent = j / words.length;
			const rad = percent * 2 * Math.PI;
			const translateY = Math.sin(rad) * 400;
			const translateZ = 40 * Math.cos(rad) - 40;
			const op = (Math.cos(rad) + 1) / 2;
			words[i].style.transform = `perspective(100px) translateZ(${translateZ}px) translateY(${translateY}%)`;
			words[i].style.opacity = `${op}`;
		}
	}
})();
