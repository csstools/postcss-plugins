import { tokenizer } from '@csstools/css-tokenizer';
import { postcssTokenizer } from '@csstools/css-tokenizer';

function collectTokens(t) {
	const bag = [];
	// eslint-disable-next-line no-constant-condition
	while (true) {
		bag.push(t.nextToken());

		if (!bag[bag.length - 1]) {
			break;
		}

		if (bag[bag.length - 1][0] === 'EOF-token') {
			break;
		}
	}

	return bag;
}

const a = [];
const b = [];

for (let i = 0; i < 1000; i++) {

	{
		const start = performance.now();
		const t = tokenizer({
			css: postcssPresetEnvSource(),
		});

		collectTokens(t);
		a.push(performance.now() - start);
	}

	{
		const start = performance.now();
		const t = postcssTokenizer.tokenizer({
			css: postcssPresetEnvSource(),
		});

		collectTokens(t);
		b.push(performance.now() - start);
	}
}

a.sort(function (a, b) {
	return a - b;
});
b.sort(function (a, b) {
	return a - b;
});

console.log(`
[spec tokenizer]:
	1th  : ${a[10]}
	50th : ${a[500]}
	95th : ${a[950]}
	99th : ${a[990]}
	max  : ${a[999]}

tokens / ms
	50th : ${3771 / a[500]}
	95th : ${3771 / a[950]}
	99th : ${3771 / a[990]}
	max  : ${3771 / a[999]}

[postcss tokenizer]:
	1th  : ${b[10]}
	50th : ${b[500]}
	95th : ${b[950]}
	99th : ${b[990]}
	max  : ${b[999]}

tokens / ms
	50th : ${3054 / b[500]}
	95th : ${3054 / b[950]}
	99th : ${3054 / b[990]}
	max  : ${3054 / b[999]}
`);

function postcssPresetEnvSource() {
	return `:root {
    --color-black-alpha-40: rgba(0,0,0,.4);
    --color-blue: #1f8dff;
    --color-magenta: #ff2bf3;
    --color-purple: #c566ff;
    --color-gray: #f8f8f8;
    --color-white: #fff;
    --space-8: 8px;
    --space-10: 10px;
    --space-15: 15px;
    --space-20: 20px;
    --space-25: 25px;
    --space-40: 40px;
    --font-baseline: 400 100%/1.5;
    --font-body: system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;
    --font-code: monospace;
    --font-size-18: 1.125rem;
    --font-size-20: 1.25rem;
    --font-size-26: 1.625rem;
    --heading-size-from-medium: 5rem;
    --heading-size: 2.5rem;
    --t-slow: .3s;
    --transition: cubic-bezier(0.250,0.460,0.450,0.940)
}

@supports (color: color(display-p3 0 0 0)) {
    :root {
        --color-blue:color(display-p3 0.268 0.544 0.975);
        --color-magenta: color(display-p3 0.96 0.264 0.926);
        --color-purple: color(display-p3 0.723 0.419 0.985)
    }
}

.u-visually-hidden {
    clip: rect(0 0 0 0)!important;
    border: none!important;
    height: 1px!important;
    margin: -1px!important;
    overflow: hidden!important;
    padding: 0!important;
    position: absolute!important;
    white-space: nowrap!important;
    width: 1px!important
}

*,:after,:before {
    box-sizing: inherit
}

html {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: 100%;
    box-sizing: border-box;
    font: var(--font-baseline) var(--font-body);
    font-size: 1rem;
    scroll-behavior: auto;
    text-rendering: optimizeLegibility
}

@media screen and (prefers-reduced-motion:no-preference) {
    html {
        scroll-behavior: smooth
    }
}

body {
    margin: 0
}

a {
    color: inherit;
    text-decoration: none
}

nav ul {
    list-style-type: none;
    margin: 0;
    padding: 0
}

pre {
    box-sizing: border-box;
    font: var(--font-baseline) var(--font-code);
    max-width: 100%;
    white-space: pre-wrap;
    word-break: break-word
}

[aria-current] {
    font-weight: 500
}

.ppe-heading {
    align-items: center;
    background-image: linear-gradient(90deg,var(--color-purple),var(--color-blue));
    color: var(--color-white);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between
}

.ppe-heading-title-link {
    font-size: var(--font-size-18);
    font-weight: 400;
    letter-spacing: -.02em;
    margin: 0;
    padding-left: var(--space-10);
    white-space: nowrap
}

@media (min-width: 370px) {
    .ppe-heading-title-link {
        font-size:var(--font-size-20)
    }
}

@media (min-width: 870px) {
    .ppe-heading-title-link {
        padding-left:var(--space-20)
    }
}

@media (min-width: 1024px) {
    .ppe-heading-title-link {
        font-size:var(--font-size-26);
        padding: 0 var(--space-25)
    }
}

.ppe-heading-menu-list {
    display: flex;
    margin: 0;
    padding: 0
}

.ppe-heading-menu-item {
    display: inline-block
}

.ppe-heading-menu-link {
    align-items: center;
    display: flex;
    overflow: hidden;
    padding: var(--space-8) var(--space-10);
    transition: background-color var(--t-slow) var(--transition),color var(--t-slow) var(--transition)
}

@media (min-width: 370px) {
    .ppe-heading-menu-link {
        padding:var(--space-8) var(--space-15)
    }
}

@media (min-width: 870px) {
    .ppe-heading-menu-link {
        padding:var(--space-20) var(--space-25)
    }
}

.ppe-heading-menu-link:hover {
    background-color: #fff;
    color: var(--color-magenta)
}

@media (max-width: 639px) {
    .ppe-heading-menu-link span {
        display:none
    }
}

.ppe-heading-menu-link[aria-current=page] {
    background-color: var(--color-black-alpha-40)
}

.ppe-heading-menu-link svg {
    fill: currentColor;
    display: block;
    height: 24px;
    margin-right: 0;
    width: 24px
}

@media (min-width: 640px) {
    .ppe-heading-menu-link svg {
        margin-right:var(--space-20)
    }
}

@media (min-width: 870px) {
    .ppe-heading-menu-link svg {
        height:40px;
        width: 40px
    }
}

.ppe-heading-menu-link:hover svg {
    fill: url(#a)
}

code[class*=language-],pre[class*=language-] {
    word-wrap: normal;
    background: #263238;
    border-radius: 3px;
    color: #c3cee3;
    font-size: 1rem;
    -webkit-hyphens: none;
    hyphens: none;
    line-height: 1.5;
    -moz-tab-size: 2;
    -o-tab-size: 2;
    tab-size: 2;
    text-align: left;
    white-space: pre;
    word-break: normal;
    word-spacing: normal
}

code[class*=language-] ::-moz-selection,code[class*=language-]::-moz-selection,pre[class*=language-] ::-moz-selection,pre[class*=language-]::-moz-selection {
    background: #363636
}

code[class*=language-] ::selection,code[class*=language-]::selection,pre[class*=language-] ::selection,pre[class*=language-]::selection {
    background: #363636
}

:not(pre)>code[class*=language-] {
    border-radius: .2em;
    padding: .1em;
    white-space: normal
}

pre[class*=language-] {
    margin: 0;
    overflow: auto;
    padding: 1rem;
    position: relative
}

.language-css>code,.language-sass>code,.language-scss>code {
    color: #fd9170
}

[class*=language-] .namespace {
    opacity: .7
}

.token.atrule {
    color: #c792ea
}

.token.attr-name {
    color: #ffcb6b
}

.token.attr-value,.token.attribute {
    color: #c3e88d
}

.token.boolean {
    color: #c792ea
}

.token.builtin {
    color: #ffcb6b
}

.token.cdata,.token.char {
    color: #80cbc4
}

.token.class {
    color: #ffcb6b
}

.token.class-name,.token.color {
    color: #f2ff00
}

.token.comment {
    color: #546e7a
}

.token.constant {
    color: #c792ea
}

.token.deleted {
    color: #f07178
}

.token.doctype {
    color: #546e7a
}

.token.entity {
    color: #f07178
}

.token.function {
    color: #c792ea
}

.token.hexcode {
    color: #f2ff00
}

.token.id,.token.important {
    color: #c792ea;
    font-weight: 700
}

.token.inserted {
    color: #80cbc4
}

.token.keyword {
    color: #c792ea;
    font-style: italic
}

.token.number {
    color: #fd9170
}

.token.operator {
    color: #89ddff
}

.token.prolog {
    color: #546e7a
}

.token.property {
    color: #80cbc4
}

.token.pseudo-class,.token.pseudo-element {
    color: #c3e88d
}

.token.punctuation {
    color: #fff
}

.token.regex {
    color: #f2ff00
}

.token.selector {
    color: #f07178
}

.token.string {
    color: #c3e88d
}

.token.symbol {
    color: #c792ea
}

.token.tag,.token.unit {
    color: #f07178
}

.token.url {
    color: #fd9170
}

.token.variable {
    color: #f07178
}

.ppe-landing-hero {
    background-image: linear-gradient(90deg,var(--color-purple),var(--color-blue));
    color: var(--color-white);
    overflow: auto;
    text-align: center
}

.ppe-landing-container {
    margin: 0 auto;
    max-width: 65rem;
    padding: 0 1rem
}

.ppe-landing-title {
    margin: 0 0 1.5rem
}

.ppe-hero-cards {
    grid-gap: 3rem;
    display: grid;
    gap: 3rem;
    grid-template-columns: repeat(auto-fit,minmax(25rem,1fr));
    padding-bottom: 2rem
}

.ppe-hero-card {
    display: flex;
    flex-direction: column;
    max-height: 41.5rem;
    text-align: left
}

.ppe-hero-card-title {
    font-weight: 500
}

.ppe-landing-getting-started {
    background-color: var(--color-gray);
    box-shadow: 0 -1px 3px 0 rgba(37,38,39,.03),0 1px 2px -5px rgba(37,38,39,.03),0 2px 5px -5px rgba(37,38,39,.05),0 4px 12px -5px rgba(37,38,39,.06),0 12px 15px -5px rgba(37,38,39,.08);
    overflow: auto;
    padding: 2rem 0
}

.ppe-landing-getting-started .ppe-getting-started-title {
    text-align: center
}

.ppe-landing-section {
    overflow: auto;
    padding: 2.5rem 0;
    width: 100%
}

@media (min-width: 870px) {
    .ppe-landing-section {
        padding:4rem 0
    }
}

.ppe-landing-section .ppe-landing-container {
    align-items: center;
    display: flex;
    flex-wrap: wrap
}

@media (min-width: 870px) {
    .ppe-landing-section .ppe-landing-container {
        flex-wrap:nowrap
    }
}

.ppe-landing-section h2 {
    margin-top: 0
}

.ppe-landing-section img {
    height: auto;
    max-width: 100%;
    width: 300px
}

.ppe-landing-section img.ppe-postcss-logo {
    width: 250px
}

.ppe-landing-section .ppe-section-decoration {
    flex-shrink: 0;
    margin-top: 2rem;
    text-align: center;
    width: 100%
}

@media (min-width: 870px) {
    .ppe-landing-section .ppe-section-decoration {
        margin-top:0;
        text-align: right;
        width: 40%
    }
}

.ppe-landing-section:nth-child(odd) .ppe-landing-container {
    flex-direction: row-reverse
}

@media (min-width: 870px) {
    .ppe-landing-section:nth-child(odd) .ppe-section-decoration {
        text-align:left
    }
}

.ppe-word-rotate {
    display: inline-block;
    font-size: 1.125rem;
    height: 1em;
    list-style-type: none;
    margin: 0;
    padding: 0;
    position: relative;
    width: 12rem
}

.ppe-word-rotate li {
    bottom: 0;
    height: 1em;
    left: 0;
    position: absolute;
    transition: all .5s
}

.ppe-latest-version {
    margin-left: auto;
    margin-right: auto
}

.ppe-landing-content,.ppe-latest-version {
    font-weight: 400;
    max-width: 37em;
    padding: 0 1em;
    text-align: center
}

.ppe-landing-content {
    margin-bottom: 20px;
    margin-top: 50px
}

.ppe-latest-version {
    font-size: 18px;
    margin-bottom: 30px
}

.ppe-landing-container a {
    box-shadow: 0 1px 0 0 transparent;
    color: #0078d6;
    text-decoration: none
}

.ppe-landing-container a:focus,.ppe-landing-container a:hover {
    box-shadow: 0 1px 0 0
}

.ppe-deploys {
    text-align: center
}

.ppe-playground {
    display: flex
}

.ppe-codepen {
    background-color: #1b2b34;
    min-height: calc(100vh - var(--heading-size));
    width: 100%
}

@media (min-width: 870px) {
    .ppe-codepen {
        min-height:calc(100vh - var(--heading-size-from-medium))
    }
}

.ppe-features {
    display: grid;
    grid-template-areas: "aside" "list"
}

@media (min-width: 870px) {
    .ppe-features {
        grid-template-areas:"aside list"
    }
}

.ppe-navigation {
    background-color: #f7f7f7;
    grid-area: aside;
    padding: 0;
    width: 300px
}

@media (max-width: 1023px) {
    .ppe-navigation {
        width:200px
    }
}

@media (max-width: 869px) {
    .ppe-navigation {
        padding:25px 0;
        width: auto
    }
}

@media (min-width: 870px) {
    .ppe-navigation-sticky {
        position:sticky;
        top: 25px
    }
}

.ppe-navigation-sticky-overflow {
    height: auto;
    overflow-y: auto;
    padding: 0 var(--space-10)
}

@media (min-width: 870px) {
    .ppe-navigation-sticky-overflow {
        height:calc(100vh - var(--heading-size-from-medium));
        overflow-y: auto;
        padding: var(--space-25) var(--space-20)
    }
}

@media (min-width: 1024px) {
    .ppe-navigation-sticky-overflow {
        padding:var(--space-25)
    }
}

.ppe-navigation-select {
    display: block;
    margin: 10px 0 20px;
    width: 100px
}

@media (min-width: 870px) {
    .ppe-navigation-select {
        width:100%
    }
}

.ppe-menu-link {
    color: #2b2b2b;
    display: block;
    font-size: 14px;
    font-style: normal;
    line-height: 1.285;
    margin: 2px 0;
    padding: 7px 0
}

.ppe-menu-link:focus,.ppe-menu-link:hover,.ppe-menu-link[aria-current] {
    color: #000;
    text-decoration: underline
}

.ppe-features-list {
    grid-area: list;
    padding: 0 75px 50px
}

@media (max-width: 1023px) {
    .ppe-features-list {
        padding-left:20px;
        padding-right: 20px
    }
}

.ppe-sidebar-menu {
    box-shadow: 0 -1px 0 0 #ddd;
    margin-top: 15px;
    padding-top: 15px
}

.ppe-feature {
    margin: 0
}

.ppe-feature-heading {
    padding: 50px 0 0;
    word-break: break-word
}

.ppe-feature-title {
    color: #3c3c3c;
    font-size: 32px;
    font-weight: 400;
    letter-spacing: -.02em;
    line-height: 1.25;
    margin: 0 auto 10px 0
}

.ppe-feature-heading-link-list {
    display: flex;
    flex-wrap: wrap
}

.ppe-feature-heading-link {
    border-radius: 2px;
    flex-shrink: 0;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .08em;
    margin-bottom: 5px;
    padding: 5px 10px;
    text-transform: uppercase
}

.ppe-feature-heading-link:not(:last-child) {
    margin-right: 10px
}

.ppe-feature-heading-stage {
    color: #fff
}

.ppe-feature-heading-stage[data-stage="0"] {
    background-color: #414141
}

.ppe-feature-heading-stage[data-stage="1"] {
    background-color: #ed782a;
    color: #000
}

.ppe-feature-heading-stage[data-stage="2"] {
    background-color: #899c1f;
    color: #000
}

.ppe-feature-heading-stage[data-stage="3"] {
    background-color: #3e7817
}

.ppe-feature-heading-stage[data-stage="4"] {
    background-color: #005a9c
}

.ppe-feature-heading-pluginLink,.ppe-feature-heading-specLink {
    background-color: #eee;
    color: #000
}

.ppe-feature-heading a:not(.ppe-feature-heading-stage):focus,.ppe-feature-heading a:not(.ppe-feature-heading-stage):hover,.ppe-feature-heading:target {
    color: #3095ff
}

.ppe-feature-description {
    font-weight: 300
}
`;
}
