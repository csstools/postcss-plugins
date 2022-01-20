# Updating PostCSS

see : `packages/postcss-tape/package.json`

Set the `postcss` version to match the peer dependency of all plugins.<br>
Set the `postcss-oldest-supported` depending on community needs. This can be the same as the `postcss` version.


- Plugins use `^MAJOR.MINOR`.
- PostCSS Tape uses `~MAJOR.MINOR`.

Avoid increasing these versions when possible.

Major version updates are also always a breaking change.
