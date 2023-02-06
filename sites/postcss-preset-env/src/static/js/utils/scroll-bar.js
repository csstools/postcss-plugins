(() => {
	const calculateScrollBarWidth = () => {
		const root = document.documentElement;
		const scrollBarWidth = `${window.innerWidth - document.body.clientWidth}px`;
		root.style.setProperty('--scroll-bar', scrollBarWidth);
	};

	if (window.CSS && window.CSS.supports('color', 'var(--foo)')) {
		calculateScrollBarWidth();
		window.addEventListener('resize', calculateScrollBarWidth);
	}
})();
