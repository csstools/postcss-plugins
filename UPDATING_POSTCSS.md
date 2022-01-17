# Updating PostCSS

see : `packages/postcss-tape/package.json`

Set the `postcss` versions to match the peer dependency of all plugins.

- Plugins use `^MAJOR.MINOR`.
- PostCSS Tape uses `~MAJOR.MINOR`.

Avoid raising these versions when possible.

Major version updates are also always a breaking change.
