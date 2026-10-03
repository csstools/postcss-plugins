---
title: PostCSS Mixins And PostCSS Custom Functions
description: Use @mixin and @function in CSS
date: 2026-10-03
---

We are happy to announce the release of [`@csstools/postcss-mixins`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-mixins#readme) and [`@csstools/postcss-custom-functions`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-functions#readme).

_If you are using [`postcss-preset-env`](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env#readme) you will already have this plugin when using the latest version. Otherwise now is a great time to upgrade 🎉_

## `@function`

Custom functions work at the value level and allow you to abstract complex bits of logic into a shared function.  

For example, in a columns system you sometimes still need to compute the size of a number of columns:

```css
@function --columns-size(--span <integer>: 1, --columns <integer>: 1, --container-size <length>: 100px, --gutter-size <length>: 0px) {
	result: calc(((var(--container-size) - (var(--gutter-size) * (var(--columns) - 1))) / var(--columns) * var(--span)) + (var(--gutter-size) * (var(--span) - 1)));
}

.foo {
	width: --columns-size(5, 12, calc(100vw - 40px), 8px);
}
```

Typed arguments and a typed return can't be fully transpiled by a build tool. But we think there is still enough here to make a PostCSS plugin.

Try it out in [the playground](https://preset-env.cssdb.org/playground/#JTdCJTIyc291cmNlJTIyJTNBJTIyJTQwZnVuY3Rpb24lMjAtLWNvbHVtbnMtc2l6ZSgtLXNwYW4lMjAlM0NpbnRlZ2VyJTNFJTNBJTIwMSUyQyUyMC0tY29sdW1ucyUyMCUzQ2ludGVnZXIlM0UlM0ElMjAxJTJDJTIwLS1jb250YWluZXItc2l6ZSUyMCUzQ2xlbmd0aCUzRSUzQSUyMDEwMHB4JTJDJTIwLS1ndXR0ZXItc2l6ZSUyMCUzQ2xlbmd0aCUzRSUzQSUyMDBweCklMjAlN0IlNUNuJTVDdHJlc3VsdCUzQSUyMGNhbGMoKCh2YXIoLS1jb250YWluZXItc2l6ZSklMjAtJTIwKHZhcigtLWd1dHRlci1zaXplKSUyMColMjAodmFyKC0tY29sdW1ucyklMjAtJTIwMSkpKSUyMCUyRiUyMHZhcigtLWNvbHVtbnMpJTIwKiUyMHZhcigtLXNwYW4pKSUyMCUyQiUyMCh2YXIoLS1ndXR0ZXItc2l6ZSklMjAqJTIwKHZhcigtLXNwYW4pJTIwLSUyMDEpKSklM0IlNUNuJTdEJTVDbiU1Q24uZm9vJTIwJTdCJTVDbiU1Q3R3aWR0aCUzQSUyMC0tY29sdW1ucy1zaXplKDUlMkMlMjAxMiUyQyUyMGNhbGMoMTAwdnclMjAtJTIwNDBweCklMkMlMjA4cHgpJTNCJTVDbiU3RCUyMiUyQyUyMmNvbmZpZyUyMiUzQSU3QiUyMmJyb3dzZXJzJTIyJTNBJTVCJTIyJTNFJTIwMC4yJTI1JTIwYW5kJTIwbm90JTIwZGVhZCUyMiU1RCUyQyUyMm1pbmltdW1WZW5kb3JJbXBsZW1lbnRhdGlvbnMlMjIlM0EwJTJDJTIyc3RhZ2UlMjIlM0EyJTJDJTIyZW5hYmxlQ2xpZW50U2lkZVBvbHlmaWxscyUyMiUzQWZhbHNlJTJDJTIybG9naWNhbCUyMiUzQSU3QiUyMmlubGluZURpcmVjdGlvbiUyMiUzQSUyMmxlZnQtdG8tcmlnaHQlMjIlMkMlMjJibG9ja0RpcmVjdGlvbiUyMiUzQSUyMnRvcC10by1ib3R0b20lMjIlN0QlN0QlN0Q=).

Another example is a gamut-mapped version of `oklch()` with the ray tracing algorithm:

```css
@function --oklch-in-srgb-gamut(--l <number>: 0, --c <number>: 0, --h <number>: 0) {
	--angle: calc(var(--h) * 1deg);
	--ca: cos(var(--angle));
	--sa: sin(var(--angle));
	--oka: calc(var(--c) * var(--ca));
	--okb: calc(var(--c) * var(--sa));
	--lr0: calc(var(--l) + 0.3963377773761749 * var(--oka) + 0.2158037573099136 * var(--okb));
	--mr0: calc(var(--l) - 0.1055613458156586 * var(--oka) - 0.0638541728258133 * var(--okb));
	--sr0: calc(var(--l) - 0.0894841775298119 * var(--oka) - 1.2914855480194092 * var(--okb));
	--or: calc(4.076741636 * pow(var(--lr0),3) + -3.307711539 * pow(var(--mr0),3) + 0.2309699032 * pow(var(--sr0),3));
	--og: calc(-1.268437973 * pow(var(--lr0),3) + 2.609757349 * pow(var(--mr0),3) + -0.341319376 * pow(var(--sr0),3));
	--ob: calc(-0.004196076139 * pow(var(--lr0),3) + -0.7034186179 * pow(var(--mr0),3) + 1.707614694 * pow(var(--sr0),3));
	--inr: clamp(0, sign(var(--or)) + sign(1 - var(--or)) - 1, 1);
	--ing: clamp(0, sign(var(--og)) + sign(1 - var(--og)) - 1, 1);
	--inb: clamp(0, sign(var(--ob)) + sign(1 - var(--ob)) - 1, 1);
	--mask: calc(var(--inr) * var(--ing) * var(--inb));
	--low: clamp(0, sign(0.000001 - var(--l)), 1);
	--high: clamp(0, sign(var(--l) - 0.999999), 1);
	--anchor: pow(var(--l),3);
	--origin: oklch(var(--l) var(--c) var(--h));
	--p0: color(from var(--origin) srgb-linear calc(var(--anchor) + (r - var(--anchor)) * min((max(0, sign(r - var(--anchor))) - var(--anchor)) / (r - var(--anchor) + 0.000000000001),(max(0, sign(g - var(--anchor))) - var(--anchor)) / (g - var(--anchor) + 0.000000000001),(max(0, sign(b - var(--anchor))) - var(--anchor)) / (b - var(--anchor) + 0.000000000001))) calc(var(--anchor) + (g - var(--anchor)) * min((max(0, sign(r - var(--anchor))) - var(--anchor)) / (r - var(--anchor) + 0.000000000001),(max(0, sign(g - var(--anchor))) - var(--anchor)) / (g - var(--anchor) + 0.000000000001),(max(0, sign(b - var(--anchor))) - var(--anchor)) / (b - var(--anchor) + 0.000000000001))) calc(var(--anchor) + (b - var(--anchor)) * min((max(0, sign(r - var(--anchor))) - var(--anchor)) / (r - var(--anchor) + 0.000000000001),(max(0, sign(g - var(--anchor))) - var(--anchor)) / (g - var(--anchor) + 0.000000000001),(max(0, sign(b - var(--anchor))) - var(--anchor)) / (b - var(--anchor) + 0.000000000001))));
	--k1: oklch(from var(--p0) var(--l) c var(--h));
	--p1: color(from var(--k1) srgb-linear calc(var(--anchor) + (r - var(--anchor)) * min((max(0, sign(r - var(--anchor))) - var(--anchor)) / (r - var(--anchor) + 0.000000000001),(max(0, sign(g - var(--anchor))) - var(--anchor)) / (g - var(--anchor) + 0.000000000001),(max(0, sign(b - var(--anchor))) - var(--anchor)) / (b - var(--anchor) + 0.000000000001))) calc(var(--anchor) + (g - var(--anchor)) * min((max(0, sign(r - var(--anchor))) - var(--anchor)) / (r - var(--anchor) + 0.000000000001),(max(0, sign(g - var(--anchor))) - var(--anchor)) / (g - var(--anchor) + 0.000000000001),(max(0, sign(b - var(--anchor))) - var(--anchor)) / (b - var(--anchor) + 0.000000000001))) calc(var(--anchor) + (b - var(--anchor)) * min((max(0, sign(r - var(--anchor))) - var(--anchor)) / (r - var(--anchor) + 0.000000000001),(max(0, sign(g - var(--anchor))) - var(--anchor)) / (g - var(--anchor) + 0.000000000001),(max(0, sign(b - var(--anchor))) - var(--anchor)) / (b - var(--anchor) + 0.000000000001))));
	--k2: oklch(from var(--p1) var(--l) c var(--h));
	--p2: color(from var(--k2) srgb-linear calc(var(--anchor) + (r - var(--anchor)) * min((max(0, sign(r - var(--anchor))) - var(--anchor)) / (r - var(--anchor) + 0.000000000001),(max(0, sign(g - var(--anchor))) - var(--anchor)) / (g - var(--anchor) + 0.000000000001),(max(0, sign(b - var(--anchor))) - var(--anchor)) / (b - var(--anchor) + 0.000000000001))) calc(var(--anchor) + (g - var(--anchor)) * min((max(0, sign(r - var(--anchor))) - var(--anchor)) / (r - var(--anchor) + 0.000000000001),(max(0, sign(g - var(--anchor))) - var(--anchor)) / (g - var(--anchor) + 0.000000000001),(max(0, sign(b - var(--anchor))) - var(--anchor)) / (b - var(--anchor) + 0.000000000001))) calc(var(--anchor) + (b - var(--anchor)) * min((max(0, sign(r - var(--anchor))) - var(--anchor)) / (r - var(--anchor) + 0.000000000001),(max(0, sign(g - var(--anchor))) - var(--anchor)) / (g - var(--anchor) + 0.000000000001),(max(0, sign(b - var(--anchor))) - var(--anchor)) / (b - var(--anchor) + 0.000000000001))));
	--k3: oklch(from var(--p2) var(--l) c var(--h));
	--p3: color(from var(--k3) srgb-linear calc(var(--anchor) + (r - var(--anchor)) * min((max(0, sign(r - var(--anchor))) - var(--anchor)) / (r - var(--anchor) + 0.000000000001),(max(0, sign(g - var(--anchor))) - var(--anchor)) / (g - var(--anchor) + 0.000000000001),(max(0, sign(b - var(--anchor))) - var(--anchor)) / (b - var(--anchor) + 0.000000000001))) calc(var(--anchor) + (g - var(--anchor)) * min((max(0, sign(r - var(--anchor))) - var(--anchor)) / (r - var(--anchor) + 0.000000000001),(max(0, sign(g - var(--anchor))) - var(--anchor)) / (g - var(--anchor) + 0.000000000001),(max(0, sign(b - var(--anchor))) - var(--anchor)) / (b - var(--anchor) + 0.000000000001))) calc(var(--anchor) + (b - var(--anchor)) * min((max(0, sign(r - var(--anchor))) - var(--anchor)) / (r - var(--anchor) + 0.000000000001),(max(0, sign(g - var(--anchor))) - var(--anchor)) / (g - var(--anchor) + 0.000000000001),(max(0, sign(b - var(--anchor))) - var(--anchor)) / (b - var(--anchor) + 0.000000000001))));
	result: oklch(from var(--p3) clamp(0, var(--l), 1) calc((c * (1 - var(--mask)) + var(--c) * var(--mask)) * (1 - var(--high)) * (1 - var(--low))) var(--h));
}

.example {
	outline: 2px solid red;
	width: 100px;
	height: 100px;
	background-color: oklch(0.99 0.99 0);
}

.example-mapped {
	outline: 2px solid red;
	width: 100px;
	height: 100px;
	background-color: --oklch-in-srgb-gamut(0.99, 0.99, 0);
}
```

See it [in action here](https://codepen.io/romainmenke/pen/WbpZLoR), and with [the transpiled code in the playground](https://preset-env.cssdb.org/playground/#JTdCJTIyc291cmNlJTIyJTNBJTIyJTQwZnVuY3Rpb24lMjAtLW9rbGNoLWluLXNyZ2ItZ2FtdXQoLS1sJTIwJTNDbnVtYmVyJTNFJTNBJTIwMCUyQyUyMC0tYyUyMCUzQ251bWJlciUzRSUzQSUyMDAlMkMlMjAtLWglMjAlM0NudW1iZXIlM0UlM0ElMjAwKSUyMCU3QiU1Q24lNUN0LS1hbmdsZSUzQSUyMGNhbGModmFyKC0taCklMjAqJTIwMWRlZyklM0IlNUNuJTVDdC0tY2ElM0ElMjBjb3ModmFyKC0tYW5nbGUpKSUzQiU1Q24lNUN0LS1zYSUzQSUyMHNpbih2YXIoLS1hbmdsZSkpJTNCJTVDbiU1Q3QtLW9rYSUzQSUyMGNhbGModmFyKC0tYyklMjAqJTIwdmFyKC0tY2EpKSUzQiU1Q24lNUN0LS1va2IlM0ElMjBjYWxjKHZhcigtLWMpJTIwKiUyMHZhcigtLXNhKSklM0IlNUNuJTVDdC0tbHIwJTNBJTIwY2FsYyh2YXIoLS1sKSUyMCUyQiUyMDAuMzk2MzM3Nzc3Mzc2MTc0OSUyMColMjB2YXIoLS1va2EpJTIwJTJCJTIwMC4yMTU4MDM3NTczMDk5MTM2JTIwKiUyMHZhcigtLW9rYikpJTNCJTVDbiU1Q3QtLW1yMCUzQSUyMGNhbGModmFyKC0tbCklMjAtJTIwMC4xMDU1NjEzNDU4MTU2NTg2JTIwKiUyMHZhcigtLW9rYSklMjAtJTIwMC4wNjM4NTQxNzI4MjU4MTMzJTIwKiUyMHZhcigtLW9rYikpJTNCJTVDbiU1Q3QtLXNyMCUzQSUyMGNhbGModmFyKC0tbCklMjAtJTIwMC4wODk0ODQxNzc1Mjk4MTE5JTIwKiUyMHZhcigtLW9rYSklMjAtJTIwMS4yOTE0ODU1NDgwMTk0MDkyJTIwKiUyMHZhcigtLW9rYikpJTNCJTVDbiU1Q3QtLW9yJTNBJTIwY2FsYyg0LjA3Njc0MTYzNiUyMColMjBwb3codmFyKC0tbHIwKSUyQzMpJTIwJTJCJTIwLTMuMzA3NzExNTM5JTIwKiUyMHBvdyh2YXIoLS1tcjApJTJDMyklMjAlMkIlMjAwLjIzMDk2OTkwMzIlMjAqJTIwcG93KHZhcigtLXNyMCklMkMzKSklM0IlNUNuJTVDdC0tb2clM0ElMjBjYWxjKC0xLjI2ODQzNzk3MyUyMColMjBwb3codmFyKC0tbHIwKSUyQzMpJTIwJTJCJTIwMi42MDk3NTczNDklMjAqJTIwcG93KHZhcigtLW1yMCklMkMzKSUyMCUyQiUyMC0wLjM0MTMxOTM3NiUyMColMjBwb3codmFyKC0tc3IwKSUyQzMpKSUzQiU1Q24lNUN0LS1vYiUzQSUyMGNhbGMoLTAuMDA0MTk2MDc2MTM5JTIwKiUyMHBvdyh2YXIoLS1scjApJTJDMyklMjAlMkIlMjAtMC43MDM0MTg2MTc5JTIwKiUyMHBvdyh2YXIoLS1tcjApJTJDMyklMjAlMkIlMjAxLjcwNzYxNDY5NCUyMColMjBwb3codmFyKC0tc3IwKSUyQzMpKSUzQiU1Q24lNUN0LS1pbnIlM0ElMjBjbGFtcCgwJTJDJTIwc2lnbih2YXIoLS1vcikpJTIwJTJCJTIwc2lnbigxJTIwLSUyMHZhcigtLW9yKSklMjAtJTIwMSUyQyUyMDEpJTNCJTVDbiU1Q3QtLWluZyUzQSUyMGNsYW1wKDAlMkMlMjBzaWduKHZhcigtLW9nKSklMjAlMkIlMjBzaWduKDElMjAtJTIwdmFyKC0tb2cpKSUyMC0lMjAxJTJDJTIwMSklM0IlNUNuJTVDdC0taW5iJTNBJTIwY2xhbXAoMCUyQyUyMHNpZ24odmFyKC0tb2IpKSUyMCUyQiUyMHNpZ24oMSUyMC0lMjB2YXIoLS1vYikpJTIwLSUyMDElMkMlMjAxKSUzQiU1Q24lNUN0LS1tYXNrJTNBJTIwY2FsYyh2YXIoLS1pbnIpJTIwKiUyMHZhcigtLWluZyklMjAqJTIwdmFyKC0taW5iKSklM0IlNUNuJTVDdC0tbG93JTNBJTIwY2xhbXAoMCUyQyUyMHNpZ24oMC4wMDAwMDElMjAtJTIwdmFyKC0tbCkpJTJDJTIwMSklM0IlNUNuJTVDdC0taGlnaCUzQSUyMGNsYW1wKDAlMkMlMjBzaWduKHZhcigtLWwpJTIwLSUyMDAuOTk5OTk5KSUyQyUyMDEpJTNCJTVDbiU1Q3QtLWFuY2hvciUzQSUyMHBvdyh2YXIoLS1sKSUyQzMpJTNCJTVDbiU1Q3QtLW9yaWdpbiUzQSUyMG9rbGNoKHZhcigtLWwpJTIwdmFyKC0tYyklMjB2YXIoLS1oKSklM0IlNUNuJTVDdC0tcDAlM0ElMjBjb2xvcihmcm9tJTIwdmFyKC0tb3JpZ2luKSUyMHNyZ2ItbGluZWFyJTIwY2FsYyh2YXIoLS1hbmNob3IpJTIwJTJCJTIwKHIlMjAtJTIwdmFyKC0tYW5jaG9yKSklMjAqJTIwbWluKChtYXgoMCUyQyUyMHNpZ24ociUyMC0lMjB2YXIoLS1hbmNob3IpKSklMjAtJTIwdmFyKC0tYW5jaG9yKSklMjAlMkYlMjAociUyMC0lMjB2YXIoLS1hbmNob3IpJTIwJTJCJTIwMC4wMDAwMDAwMDAwMDEpJTJDKG1heCgwJTJDJTIwc2lnbihnJTIwLSUyMHZhcigtLWFuY2hvcikpKSUyMC0lMjB2YXIoLS1hbmNob3IpKSUyMCUyRiUyMChnJTIwLSUyMHZhcigtLWFuY2hvciklMjAlMkIlMjAwLjAwMDAwMDAwMDAwMSklMkMobWF4KDAlMkMlMjBzaWduKGIlMjAtJTIwdmFyKC0tYW5jaG9yKSkpJTIwLSUyMHZhcigtLWFuY2hvcikpJTIwJTJGJTIwKGIlMjAtJTIwdmFyKC0tYW5jaG9yKSUyMCUyQiUyMDAuMDAwMDAwMDAwMDAxKSkpJTIwY2FsYyh2YXIoLS1hbmNob3IpJTIwJTJCJTIwKGclMjAtJTIwdmFyKC0tYW5jaG9yKSklMjAqJTIwbWluKChtYXgoMCUyQyUyMHNpZ24ociUyMC0lMjB2YXIoLS1hbmNob3IpKSklMjAtJTIwdmFyKC0tYW5jaG9yKSklMjAlMkYlMjAociUyMC0lMjB2YXIoLS1hbmNob3IpJTIwJTJCJTIwMC4wMDAwMDAwMDAwMDEpJTJDKG1heCgwJTJDJTIwc2lnbihnJTIwLSUyMHZhcigtLWFuY2hvcikpKSUyMC0lMjB2YXIoLS1hbmNob3IpKSUyMCUyRiUyMChnJTIwLSUyMHZhcigtLWFuY2hvciklMjAlMkIlMjAwLjAwMDAwMDAwMDAwMSklMkMobWF4KDAlMkMlMjBzaWduKGIlMjAtJTIwdmFyKC0tYW5jaG9yKSkpJTIwLSUyMHZhcigtLWFuY2hvcikpJTIwJTJGJTIwKGIlMjAtJTIwdmFyKC0tYW5jaG9yKSUyMCUyQiUyMDAuMDAwMDAwMDAwMDAxKSkpJTIwY2FsYyh2YXIoLS1hbmNob3IpJTIwJTJCJTIwKGIlMjAtJTIwdmFyKC0tYW5jaG9yKSklMjAqJTIwbWluKChtYXgoMCUyQyUyMHNpZ24ociUyMC0lMjB2YXIoLS1hbmNob3IpKSklMjAtJTIwdmFyKC0tYW5jaG9yKSklMjAlMkYlMjAociUyMC0lMjB2YXIoLS1hbmNob3IpJTIwJTJCJTIwMC4wMDAwMDAwMDAwMDEpJTJDKG1heCgwJTJDJTIwc2lnbihnJTIwLSUyMHZhcigtLWFuY2hvcikpKSUyMC0lMjB2YXIoLS1hbmNob3IpKSUyMCUyRiUyMChnJTIwLSUyMHZhcigtLWFuY2hvciklMjAlMkIlMjAwLjAwMDAwMDAwMDAwMSklMkMobWF4KDAlMkMlMjBzaWduKGIlMjAtJTIwdmFyKC0tYW5jaG9yKSkpJTIwLSUyMHZhcigtLWFuY2hvcikpJTIwJTJGJTIwKGIlMjAtJTIwdmFyKC0tYW5jaG9yKSUyMCUyQiUyMDAuMDAwMDAwMDAwMDAxKSkpKSUzQiU1Q24lNUN0LS1rMSUzQSUyMG9rbGNoKGZyb20lMjB2YXIoLS1wMCklMjB2YXIoLS1sKSUyMGMlMjB2YXIoLS1oKSklM0IlNUNuJTVDdC0tcDElM0ElMjBjb2xvcihmcm9tJTIwdmFyKC0tazEpJTIwc3JnYi1saW5lYXIlMjBjYWxjKHZhcigtLWFuY2hvciklMjAlMkIlMjAociUyMC0lMjB2YXIoLS1hbmNob3IpKSUyMColMjBtaW4oKG1heCgwJTJDJTIwc2lnbihyJTIwLSUyMHZhcigtLWFuY2hvcikpKSUyMC0lMjB2YXIoLS1hbmNob3IpKSUyMCUyRiUyMChyJTIwLSUyMHZhcigtLWFuY2hvciklMjAlMkIlMjAwLjAwMDAwMDAwMDAwMSklMkMobWF4KDAlMkMlMjBzaWduKGclMjAtJTIwdmFyKC0tYW5jaG9yKSkpJTIwLSUyMHZhcigtLWFuY2hvcikpJTIwJTJGJTIwKGclMjAtJTIwdmFyKC0tYW5jaG9yKSUyMCUyQiUyMDAuMDAwMDAwMDAwMDAxKSUyQyhtYXgoMCUyQyUyMHNpZ24oYiUyMC0lMjB2YXIoLS1hbmNob3IpKSklMjAtJTIwdmFyKC0tYW5jaG9yKSklMjAlMkYlMjAoYiUyMC0lMjB2YXIoLS1hbmNob3IpJTIwJTJCJTIwMC4wMDAwMDAwMDAwMDEpKSklMjBjYWxjKHZhcigtLWFuY2hvciklMjAlMkIlMjAoZyUyMC0lMjB2YXIoLS1hbmNob3IpKSUyMColMjBtaW4oKG1heCgwJTJDJTIwc2lnbihyJTIwLSUyMHZhcigtLWFuY2hvcikpKSUyMC0lMjB2YXIoLS1hbmNob3IpKSUyMCUyRiUyMChyJTIwLSUyMHZhcigtLWFuY2hvciklMjAlMkIlMjAwLjAwMDAwMDAwMDAwMSklMkMobWF4KDAlMkMlMjBzaWduKGclMjAtJTIwdmFyKC0tYW5jaG9yKSkpJTIwLSUyMHZhcigtLWFuY2hvcikpJTIwJTJGJTIwKGclMjAtJTIwdmFyKC0tYW5jaG9yKSUyMCUyQiUyMDAuMDAwMDAwMDAwMDAxKSUyQyhtYXgoMCUyQyUyMHNpZ24oYiUyMC0lMjB2YXIoLS1hbmNob3IpKSklMjAtJTIwdmFyKC0tYW5jaG9yKSklMjAlMkYlMjAoYiUyMC0lMjB2YXIoLS1hbmNob3IpJTIwJTJCJTIwMC4wMDAwMDAwMDAwMDEpKSklMjBjYWxjKHZhcigtLWFuY2hvciklMjAlMkIlMjAoYiUyMC0lMjB2YXIoLS1hbmNob3IpKSUyMColMjBtaW4oKG1heCgwJTJDJTIwc2lnbihyJTIwLSUyMHZhcigtLWFuY2hvcikpKSUyMC0lMjB2YXIoLS1hbmNob3IpKSUyMCUyRiUyMChyJTIwLSUyMHZhcigtLWFuY2hvciklMjAlMkIlMjAwLjAwMDAwMDAwMDAwMSklMkMobWF4KDAlMkMlMjBzaWduKGclMjAtJTIwdmFyKC0tYW5jaG9yKSkpJTIwLSUyMHZhcigtLWFuY2hvcikpJTIwJTJGJTIwKGclMjAtJTIwdmFyKC0tYW5jaG9yKSUyMCUyQiUyMDAuMDAwMDAwMDAwMDAxKSUyQyhtYXgoMCUyQyUyMHNpZ24oYiUyMC0lMjB2YXIoLS1hbmNob3IpKSklMjAtJTIwdmFyKC0tYW5jaG9yKSklMjAlMkYlMjAoYiUyMC0lMjB2YXIoLS1hbmNob3IpJTIwJTJCJTIwMC4wMDAwMDAwMDAwMDEpKSkpJTNCJTVDbiU1Q3QtLWsyJTNBJTIwb2tsY2goZnJvbSUyMHZhcigtLXAxKSUyMHZhcigtLWwpJTIwYyUyMHZhcigtLWgpKSUzQiU1Q24lNUN0LS1wMiUzQSUyMGNvbG9yKGZyb20lMjB2YXIoLS1rMiklMjBzcmdiLWxpbmVhciUyMGNhbGModmFyKC0tYW5jaG9yKSUyMCUyQiUyMChyJTIwLSUyMHZhcigtLWFuY2hvcikpJTIwKiUyMG1pbigobWF4KDAlMkMlMjBzaWduKHIlMjAtJTIwdmFyKC0tYW5jaG9yKSkpJTIwLSUyMHZhcigtLWFuY2hvcikpJTIwJTJGJTIwKHIlMjAtJTIwdmFyKC0tYW5jaG9yKSUyMCUyQiUyMDAuMDAwMDAwMDAwMDAxKSUyQyhtYXgoMCUyQyUyMHNpZ24oZyUyMC0lMjB2YXIoLS1hbmNob3IpKSklMjAtJTIwdmFyKC0tYW5jaG9yKSklMjAlMkYlMjAoZyUyMC0lMjB2YXIoLS1hbmNob3IpJTIwJTJCJTIwMC4wMDAwMDAwMDAwMDEpJTJDKG1heCgwJTJDJTIwc2lnbihiJTIwLSUyMHZhcigtLWFuY2hvcikpKSUyMC0lMjB2YXIoLS1hbmNob3IpKSUyMCUyRiUyMChiJTIwLSUyMHZhcigtLWFuY2hvciklMjAlMkIlMjAwLjAwMDAwMDAwMDAwMSkpKSUyMGNhbGModmFyKC0tYW5jaG9yKSUyMCUyQiUyMChnJTIwLSUyMHZhcigtLWFuY2hvcikpJTIwKiUyMG1pbigobWF4KDAlMkMlMjBzaWduKHIlMjAtJTIwdmFyKC0tYW5jaG9yKSkpJTIwLSUyMHZhcigtLWFuY2hvcikpJTIwJTJGJTIwKHIlMjAtJTIwdmFyKC0tYW5jaG9yKSUyMCUyQiUyMDAuMDAwMDAwMDAwMDAxKSUyQyhtYXgoMCUyQyUyMHNpZ24oZyUyMC0lMjB2YXIoLS1hbmNob3IpKSklMjAtJTIwdmFyKC0tYW5jaG9yKSklMjAlMkYlMjAoZyUyMC0lMjB2YXIoLS1hbmNob3IpJTIwJTJCJTIwMC4wMDAwMDAwMDAwMDEpJTJDKG1heCgwJTJDJTIwc2lnbihiJTIwLSUyMHZhcigtLWFuY2hvcikpKSUyMC0lMjB2YXIoLS1hbmNob3IpKSUyMCUyRiUyMChiJTIwLSUyMHZhcigtLWFuY2hvciklMjAlMkIlMjAwLjAwMDAwMDAwMDAwMSkpKSUyMGNhbGModmFyKC0tYW5jaG9yKSUyMCUyQiUyMChiJTIwLSUyMHZhcigtLWFuY2hvcikpJTIwKiUyMG1pbigobWF4KDAlMkMlMjBzaWduKHIlMjAtJTIwdmFyKC0tYW5jaG9yKSkpJTIwLSUyMHZhcigtLWFuY2hvcikpJTIwJTJGJTIwKHIlMjAtJTIwdmFyKC0tYW5jaG9yKSUyMCUyQiUyMDAuMDAwMDAwMDAwMDAxKSUyQyhtYXgoMCUyQyUyMHNpZ24oZyUyMC0lMjB2YXIoLS1hbmNob3IpKSklMjAtJTIwdmFyKC0tYW5jaG9yKSklMjAlMkYlMjAoZyUyMC0lMjB2YXIoLS1hbmNob3IpJTIwJTJCJTIwMC4wMDAwMDAwMDAwMDEpJTJDKG1heCgwJTJDJTIwc2lnbihiJTIwLSUyMHZhcigtLWFuY2hvcikpKSUyMC0lMjB2YXIoLS1hbmNob3IpKSUyMCUyRiUyMChiJTIwLSUyMHZhcigtLWFuY2hvciklMjAlMkIlMjAwLjAwMDAwMDAwMDAwMSkpKSklM0IlNUNuJTVDdC0tazMlM0ElMjBva2xjaChmcm9tJTIwdmFyKC0tcDIpJTIwdmFyKC0tbCklMjBjJTIwdmFyKC0taCkpJTNCJTVDbiU1Q3QtLXAzJTNBJTIwY29sb3IoZnJvbSUyMHZhcigtLWszKSUyMHNyZ2ItbGluZWFyJTIwY2FsYyh2YXIoLS1hbmNob3IpJTIwJTJCJTIwKHIlMjAtJTIwdmFyKC0tYW5jaG9yKSklMjAqJTIwbWluKChtYXgoMCUyQyUyMHNpZ24ociUyMC0lMjB2YXIoLS1hbmNob3IpKSklMjAtJTIwdmFyKC0tYW5jaG9yKSklMjAlMkYlMjAociUyMC0lMjB2YXIoLS1hbmNob3IpJTIwJTJCJTIwMC4wMDAwMDAwMDAwMDEpJTJDKG1heCgwJTJDJTIwc2lnbihnJTIwLSUyMHZhcigtLWFuY2hvcikpKSUyMC0lMjB2YXIoLS1hbmNob3IpKSUyMCUyRiUyMChnJTIwLSUyMHZhcigtLWFuY2hvciklMjAlMkIlMjAwLjAwMDAwMDAwMDAwMSklMkMobWF4KDAlMkMlMjBzaWduKGIlMjAtJTIwdmFyKC0tYW5jaG9yKSkpJTIwLSUyMHZhcigtLWFuY2hvcikpJTIwJTJGJTIwKGIlMjAtJTIwdmFyKC0tYW5jaG9yKSUyMCUyQiUyMDAuMDAwMDAwMDAwMDAxKSkpJTIwY2FsYyh2YXIoLS1hbmNob3IpJTIwJTJCJTIwKGclMjAtJTIwdmFyKC0tYW5jaG9yKSklMjAqJTIwbWluKChtYXgoMCUyQyUyMHNpZ24ociUyMC0lMjB2YXIoLS1hbmNob3IpKSklMjAtJTIwdmFyKC0tYW5jaG9yKSklMjAlMkYlMjAociUyMC0lMjB2YXIoLS1hbmNob3IpJTIwJTJCJTIwMC4wMDAwMDAwMDAwMDEpJTJDKG1heCgwJTJDJTIwc2lnbihnJTIwLSUyMHZhcigtLWFuY2hvcikpKSUyMC0lMjB2YXIoLS1hbmNob3IpKSUyMCUyRiUyMChnJTIwLSUyMHZhcigtLWFuY2hvciklMjAlMkIlMjAwLjAwMDAwMDAwMDAwMSklMkMobWF4KDAlMkMlMjBzaWduKGIlMjAtJTIwdmFyKC0tYW5jaG9yKSkpJTIwLSUyMHZhcigtLWFuY2hvcikpJTIwJTJGJTIwKGIlMjAtJTIwdmFyKC0tYW5jaG9yKSUyMCUyQiUyMDAuMDAwMDAwMDAwMDAxKSkpJTIwY2FsYyh2YXIoLS1hbmNob3IpJTIwJTJCJTIwKGIlMjAtJTIwdmFyKC0tYW5jaG9yKSklMjAqJTIwbWluKChtYXgoMCUyQyUyMHNpZ24ociUyMC0lMjB2YXIoLS1hbmNob3IpKSklMjAtJTIwdmFyKC0tYW5jaG9yKSklMjAlMkYlMjAociUyMC0lMjB2YXIoLS1hbmNob3IpJTIwJTJCJTIwMC4wMDAwMDAwMDAwMDEpJTJDKG1heCgwJTJDJTIwc2lnbihnJTIwLSUyMHZhcigtLWFuY2hvcikpKSUyMC0lMjB2YXIoLS1hbmNob3IpKSUyMCUyRiUyMChnJTIwLSUyMHZhcigtLWFuY2hvciklMjAlMkIlMjAwLjAwMDAwMDAwMDAwMSklMkMobWF4KDAlMkMlMjBzaWduKGIlMjAtJTIwdmFyKC0tYW5jaG9yKSkpJTIwLSUyMHZhcigtLWFuY2hvcikpJTIwJTJGJTIwKGIlMjAtJTIwdmFyKC0tYW5jaG9yKSUyMCUyQiUyMDAuMDAwMDAwMDAwMDAxKSkpKSUzQiU1Q24lNUN0cmVzdWx0JTNBJTIwb2tsY2goZnJvbSUyMHZhcigtLXAzKSUyMGNsYW1wKDAlMkMlMjB2YXIoLS1sKSUyQyUyMDEpJTIwY2FsYygoYyUyMColMjAoMSUyMC0lMjB2YXIoLS1tYXNrKSklMjAlMkIlMjB2YXIoLS1jKSUyMColMjB2YXIoLS1tYXNrKSklMjAqJTIwKDElMjAtJTIwdmFyKC0taGlnaCkpJTIwKiUyMCgxJTIwLSUyMHZhcigtLWxvdykpKSUyMHZhcigtLWgpKSUzQiU1Q24lN0QlNUNuJTVDbi5leGFtcGxlJTIwJTdCJTVDbiUyMCUyMG91dGxpbmUlM0ElMjAycHglMjBzb2xpZCUyMHJlZCUzQiU1Q24lMjAlMjB3aWR0aCUzQSUyMDEwMHB4JTNCJTVDbiUyMCUyMGhlaWdodCUzQSUyMDEwMHB4JTNCJTVDbiU1Q3RiYWNrZ3JvdW5kLWNvbG9yJTNBJTIwb2tsY2goMC45OSUyMDAuOTklMjAwKSUzQiU1Q24lN0QlNUNuJTVDbi5leGFtcGxlLW1hcHBlZCUyMCU3QiU1Q24lMjAlMjBvdXRsaW5lJTNBJTIwMnB4JTIwc29saWQlMjByZWQlM0IlNUNuJTIwJTIwd2lkdGglM0ElMjAxMDBweCUzQiU1Q24lMjAlMjBoZWlnaHQlM0ElMjAxMDBweCUzQiU1Q24lNUN0YmFja2dyb3VuZC1jb2xvciUzQSUyMC0tb2tsY2gtaW4tc3JnYi1nYW11dCgwLjk5JTJDJTIwMC45OSUyQyUyMDApJTNCJTVDbiU3RCU1Q24lMjIlMkMlMjJjb25maWclMjIlM0ElN0IlMjJicm93c2VycyUyMiUzQSU1QiUyMiUzRSUyMDAuMiUyNSUyMGFuZCUyMG5vdCUyMGRlYWQlMjIlNUQlMkMlMjJtaW5pbXVtVmVuZG9ySW1wbGVtZW50YXRpb25zJTIyJTNBMCUyQyUyMnN0YWdlJTIyJTNBMiUyQyUyMmVuYWJsZUNsaWVudFNpZGVQb2x5ZmlsbHMlMjIlM0FmYWxzZSUyQyUyMmxvZ2ljYWwlMjIlM0ElN0IlMjJpbmxpbmVEaXJlY3Rpb24lMjIlM0ElMjJsZWZ0LXRvLXJpZ2h0JTIyJTJDJTIyYmxvY2tEaXJlY3Rpb24lMjIlM0ElMjJ0b3AtdG8tYm90dG9tJTIyJTdEJTdEJTdE).

## `@mixin`

Mixins make larger chunks of CSS reusable.  
We like to use mixins for typography:

`card.html`

```html
<div class="card">
	<div class="card__title">
		Hello!
	</div>
</div>
```

`typography.css`

```css
@mixin --type-a {
	font-family: monospace;
	font-size: 2rem;
	font-weight: 500;
}
```

`card.css`

```css
.card {
	padding: 20px;
	background-color: #ffd7f8;
}

.card__title {
	color: #410633;

	@apply --type-a;
}
```

Try it out in [the playground](https://preset-env.cssdb.org/playground/#JTdCJTIyc291cmNlJTIyJTNBJTIyJTQwbWl4aW4lMjAtLXR5cGUtYSUyMCU3QiU1Q24lNUN0Zm9udC1mYW1pbHklM0ElMjBtb25vc3BhY2UlM0IlNUNuJTVDdGZvbnQtc2l6ZSUzQSUyMDJyZW0lM0IlNUNuJTVDdGZvbnQtd2VpZ2h0JTNBJTIwNTAwJTNCJTVDbiU3RCU1Q24lNUNuLmNhcmQlMjAlN0IlNUNuJTVDdHBhZGRpbmclM0ElMjAyMHB4JTNCJTVDbiU1Q3RiYWNrZ3JvdW5kLWNvbG9yJTNBJTIwJTIzZmZkN2Y4JTNCJTVDbiU3RCU1Q24lNUNuLmNhcmRfX3RpdGxlJTIwJTdCJTVDbiU1Q3Rjb2xvciUzQSUyMCUyMzQxMDYzMyUzQiU1Q24lNUNuJTVDdCU0MGFwcGx5JTIwLS10eXBlLWElM0IlNUNuJTdEJTIyJTJDJTIyY29uZmlnJTIyJTNBJTdCJTIyYnJvd3NlcnMlMjIlM0ElNUIlMjIlM0UlMjAwLjIlMjUlMjBhbmQlMjBub3QlMjBkZWFkJTIyJTVEJTJDJTIybWluaW11bVZlbmRvckltcGxlbWVudGF0aW9ucyUyMiUzQTAlMkMlMjJzdGFnZSUyMiUzQTIlMkMlMjJlbmFibGVDbGllbnRTaWRlUG9seWZpbGxzJTIyJTNBZmFsc2UlMkMlMjJsb2dpY2FsJTIyJTNBJTdCJTIyaW5saW5lRGlyZWN0aW9uJTIyJTNBJTIybGVmdC10by1yaWdodCUyMiUyQyUyMmJsb2NrRGlyZWN0aW9uJTIyJTNBJTIydG9wLXRvLWJvdHRvbSUyMiU3RCU3RCU3RA==).
