# Updating PostCSS

see : `packages/postcss-tape/package.json`

```js
"dependencies": {
	// most recent version
	"postcss": "~8.4",
	// oldest supported
	"postcss-8.2": "npm:postcss@~8.2"
},
```

## updating

- only update `postcss-tape`
- run `npm run lint` from the root

This will update the peer dependency version for PostCSS in all packages and plugins.

## most recent version

- kept up to date
- only used in CI to catch regressions

## oldest supported

- used as the peer dependency version in all plugins and packages
- updated based on community needs
- can be the same as the **most recent version** version

## semver flags

- Plugins use `^MAJOR.MINOR`.
- PostCSS Tape uses `~MAJOR.MINOR`.

## notes

Avoid increasing these versions when possible.

Major version updates are also always a breaking change.
