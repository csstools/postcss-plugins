function onParsed() {
	initFeatureNav();
	onHashChange();
	onCopyClipboard();
}

!function d() {
	/c/.test(document.readyState) && document.body
		? document.removeEventListener('readystatechange', d) | onParsed()
	: document.addEventListener('readystatechange', d)
}()

window.addEventListener('hashchange', onHashChange);

const hashElements = [];
const omittedElements = [];
const stages = [0, 1, 2, 3];
let stageSelect = null;

function onCopyClipboard() {
	Array.prototype.forEach.call(
		document.querySelectorAll('[data-clipboard]'),
		$target => {
			const $parent = $target.parentNode;
			const $input = document.createElement('input');
			$input.value = $target.textContent || $target.innerText;
			const $button = document.createElement('button');
			$button.className = 'ppe-landing-clipboard-button';
			$button.title = 'copy to clipboard';
			$button.innerHTML = '<svg class="ppe-landing-clipboard-action" viewBox="0 0 14 16" width="16" height="16" aria-hidden="true">' +
				'<path fill-rule="evenodd" d="M2 13h4v1H2v-1zm5-6H2v1h5V7zm2 3V8l-3 3 3 3v-2h5v-2H9zM4.5 9H2v1h2.5V9zM2 12h2.5v-1H2v1zm9 1h1v2c-.02.28-.11.52-.3.7-.19.18-.42.28-.7.3H1c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h3c0-1.11.89-2 2-2 1.11 0 2 .89 2 2h3c.55 0 1 .45 1 1v5h-1V6H1v9h10v-2zM2 5h8c0-.55-.45-1-1-1H8c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1-.45 1-1 1H3c-.55 0-1 .45-1 1z"></path>' +
				'</svg>' +
			'</button>';
			$button.addEventListener('click', () => {
				document.body.appendChild($input);
				$input.select();
				document.execCommand('copy');
				document.body.removeChild($input);
			});
			$parent.insertBefore($button, $target.nextElementSibling);
		}
	);
}

function onHashChange() {
	hashElements.forEach(element => {
		element.removeAttribute('aria-current');
	});

	const selector = `.ppe-features a[href="${location.pathname}${location.hash}"]`;

	hashElements.splice(
		0,
		hashElements.length,
		...Array.prototype.slice.call(
			document.querySelectorAll(selector)
		)
	);

	hashElements.forEach(element => {
		element.setAttribute('aria-current', 'page');
	});

	const stageRegExp = /^#stage-([0-4])$/;

	if (stageRegExp.test(location.hash)) {
		const stageNumber = location.hash.match(stageRegExp)[1];

		updateStage(stageNumber);
	}
}

function initFeatureNav() {
	const nav = document.querySelector('.ppe-navigation');

	if (nav) {
		const select = stageSelect = document.createElement('select');

		select.className = 'ppe-navigation-select';

		select.label = 'Select which stages to navigate'

		stages.forEach(stage => {
			const option = select.appendChild(document.createElement('option'));

			option.value = stage;

			option.appendChild(document.createTextNode(`Stage ${stage}+`));
		});

		select.addEventListener('change', () => {
			location.hash = `#stage-${select.value}`;
		});

		nav.insertBefore(select, nav.firstChild);
	}
}

document.addEventListener('click', function (event) {
	const closestHash = event.target.closest('a[href*="#"]');

	if (closestHash) {
		const target = document.getElementById(closestHash.hash.slice(1));
		const easing = function (t) {
			return t * (2 - t);
		};

		if (target) {
			event.preventDefault();

			scrollTo(target, 300, easing, function () {
				location.hash = closestHash.hash;
			});
		}
	}
});

function scrollTo(target, duration, easing, callback) {
	const start = window.pageYOffset;
	const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

	const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
	const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
	const targetOffset = typeof target === 'number' ? target : target.offsetTop;
	const targetOffsetToScroll = Math.round(documentHeight - targetOffset < windowHeight ? documentHeight - windowHeight : targetOffset);

	scroll();

	function scroll() {
		const now = 'now' in window.performance ? performance.now() : new Date().getTime();
		const time = Math.min(1, ((now - startTime) / duration));
		const timeFunction = easing(time);

		window.scroll(0, Math.ceil((timeFunction * (targetOffsetToScroll - start)) + start));

		if (window.pageYOffset !== targetOffsetToScroll) {
			requestAnimationFrame(scroll);
		} else {
			window.scroll(0, start);

			callback();
		}
	}
}

function updateStage(number) {
	omittedElements.forEach(element => {
		element.hidden = false;
	});
	const omittedStages = stages.slice(0, stages.indexOf(Number(number)));
	const selector = omittedStages.map(stage => `[data-stage="${stage}"]`).join(',');

	omittedElements.splice(
		0,
		omittedElements.length,
		...Array.prototype.slice.call(
			selector ? document.querySelectorAll(selector) : []
		)
	);

	omittedElements.forEach(element => {
		element.hidden = true;
	});

	if (stageSelect) {
		stageSelect.value = number;
	}
}
