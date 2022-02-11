# Contributing to CSSTools Plugins

You want to help? You rock! Now, take a moment to be sure your contributions
make sense to everyone else.

## Reporting Issues

Found a problem? Want a new feature?

- See if your issue or idea has [already been reported].
- Provide a [reduced test case] or a [live example].

Remember, a bug is a _demonstrable problem_ caused by _our_ code.

_If this guide itself is not working or is not clear, please report it._

## Submitting Pull Requests

Pull requests are the greatest contributions, so be sure they are focused in
scope and avoid unrelated commits.

1. To begin; [fork this project], clone your fork, and add our upstream.
   ```bash
   # Clone your fork of the repo into the current directory
   git clone https://github.com/<YOUR_USER>/postcss-plugins.git

   # Navigate to the newly cloned directory
   cd postcss-plugins

   # Assign the original repo to a remote called "upstream"
   git remote add upstream https://github.com/csstools/postcss-plugins.git

   # Install and build the needed things to start local development
   # This also does an initial test of everything.
   # If this gives errors please open an issue so that we can look into it.
   npm run get-me-going
   ```

2. Create a branch for your feature or fix:
   ```bash
   # Move into a new branch for your feature
   git checkout -b feature/thing
   ```
   ```bash
   # Move into a new branch for your fix
   git checkout -b fix/something
   ```

3. Navigate to the plugin you want to contribute to.
   ```bash
   # Navigate to a plugin directory
   cd plugins/<plugin-name>
   ```
   ```bash
   # Navigate to the postcss-preset-env directory
   cd plugin-packs/postcss-preset-env
   ```

4. If your code follows our practices, then push your feature branch:
   ```bash
   # Run the linter
   npm run lint
   # Test current code
   npm run build && npm run test
   ```
   ```bash
   # Push the branch for your new feature
   git push origin feature/thing
   ```
   ```bash
   # Or, push the branch for your update
   git push origin update/something
   ```

That’s it! Now [open a pull request] with a clear title and description.

## Creating a new plugin here

- follow the guide for submitting a pull request
- run `npm run get-me-going` if you want to start local development.
- run `npm run new-plugin` to create a new plugin.

```bash
npm run new-plugin

A plugin name must be provided:
  new-plugin <human readable name>
  new-plugin Cascade Layers
```

```bash
npm run new-plugin Cascade Layers

- Creating new plugin Cascade Layers
- Copied base plugin to ./plugins/postcss-cascade-layers
- Cleaned up files and directories not required in a new plugin
- Relabeled references to base plugin
- Updated "package.json"

Done! 🎉

Your next steps:
- Run : "npm install" from the root directory
- Run : "cd plugins/postcss-cascade-layers"
- Run : "npm run build" to build your plugin
- Run : "npm run test" to test your plugin
- Run : "npm run test:rewrite-expects" to update test expects

Change "blue" to "purple" in "src/index.ts" and see how it affects the test outcome
```

## Trouble shooting

This is a mono repo that contains unpublished packages.
If you get warning about missing files, modules, packages you should do :

- `npm install` -> get public dependencies
- `npm run build` -> build private dependencies

_if your issues is not mentioned here please open an issue so that we can extend the guides_

[already been reported]: issues
[fork this project]:     fork
[live example]:          https://codepen.io/pen
[open a pull request]:   https://help.github.com/articles/using-pull-requests/
[reduced test case]:     https://css-tricks.com/reduced-test-cases/
