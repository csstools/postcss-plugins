(() => {
	const isFeaturesPage = document.body.classList.contains('ppe-features-page');

	if (!isFeaturesPage) {
		return;
	}

	const hashElements = [];
	const omittedElements = [];
	const stages = [0, 1, 2, 3];
	let stageSelect = null;

	function onParsed() {
		initFeatureNav();
		onHashChange();
	}

	!function d() {
		if (/c/.test(document.readyState) && document.body) {
			document.removeEventListener('readystatechange', d);
			onParsed();
		} else {
			document.addEventListener('readystatechange', d);
		}
	}();

	window.addEventListener('hashchange', onHashChange);

	function onHashChange() {
		hashElements.forEach(element => {
			element.removeAttribute('aria-current');
		});

		const selector = `.ppe-features a[href="${location.pathname}${location.hash}"]`;

		hashElements.splice(
			0,
			hashElements.length,
			...Array.prototype.slice.call(
				document.querySelectorAll(selector),
			),
		);

		hashElements.forEach(element => {
			element.setAttribute('aria-current', 'page');
		});

		const STAGE_REGEX = /^#stage-([0-4])$/;
		if (STAGE_REGEX.test(location.hash)) {
			const stageNumber = location.hash.match(STAGE_REGEX)[1];

			updateStage(stageNumber);
		}
	}

	function initFeatureNav() {
		const select = document.querySelector('.ppe-navigation-select');

		select.addEventListener('change', () => {
			location.hash = `#stage-${select.value}`;
		});
	}

	function updateStage(number) {
		omittedElements.forEach(element => {
			element.hidden = false;
		});
		const omittedStages = stages.slice(0, stages.indexOf(Number(number)));
		const selector = omittedStages.map(stage => `[data-stage="${ stage }"]`).join(',');

		omittedElements.splice(
			0,
			omittedElements.length,
			...Array.prototype.slice.call(
				selector ? document.querySelectorAll(selector) : [],
			),
		);

		omittedElements.forEach(element => {
			element.hidden = true;
		});

		if (stageSelect) {
			stageSelect.value = number;
		}
	}
})();
