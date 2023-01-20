# Contributing to CSSTools Plugins

You want to help? You rock! Now, take a moment to be sure your contributions
make sense to everyone else.

## Reporting Issues

Found a problem? Want a new feature?

- See if your issue or idea has [already been reported].
- Provide a [reduced test case] or a [live example].

Remember, a bug is a _demonstrable problem_ caused by _our_ code.

_If this guide itself is not working or is not clear, please report it._

## Project setup

If you do need to set the project up locally yourself, feel free to follow these
instructions:

### System Requirements

- [Node.js](https://nodejs.org/) >= 16.0.0

### Quick start

1. fork the repo and clone it locally
2. `npm run ci` to install dependencies
3. `cd plugins/<plugin-name>`
4. `npm run build && npm run test` to build and test the plugin after making changes
5. open a pull request with the changes

## Submitting Pull Requests

We try our best to create a safe and welcoming environment for contributors.

Your changes do not have to be complete and tests do not have to pass before opening a pull request.
Receiving early feedback on your work will help you iterate more quickly in the right direction.

1. To begin; [fork this project], clone your fork, and add our upstream.
   ```bash
   # Clone your fork of the repo into the current directory
   git clone https://github.com/<YOUR_USER>/postcss-plugins.git

   # Navigate to the newly cloned directory
   cd postcss-plugins

   # Assign the original repo to a remote called "upstream"
   git remote add upstream https://github.com/csstools/postcss-plugins.git
   ```

2. Where are you contributing?

* If you want to contribute to plugins, plugin-packs or the CLI, run the following command:

   ```bash
    # Install and build the needed things to start local development
    # This also does an initial test of everything.
    # If this gives errors please open an issue so that we can look into it.
    npm run setup-workspace
   ```

* If you want to contribute to sites, you need to run the following command: 

   ```bash
    cd sites
    # Install the needed things to start local development
    # If this gives errors please open an issue so that we can look into it.
    npm run setup-workspace
   ```

3. Create a branch for your feature or fix:
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

- Follow the guide for submitting a pull request
- Run `npm run ci` if you want to start local development.
- Run `npm run new-plugin <Your Plugin Name>` to create a new plugin.

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
- Run : "npm run test:rewrite-expects" to update test result files

Change "blue" to "purple" in "src/index.ts" and see how it affects the test outcome
```

## Read the guidelines and best practices for plugins

- [PostCSS API documentation](https://postcss.org/api/)
- [PostCSS guidelines for plugins](https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md)
- [CSSTools technical guidelines for plugins](https://github.com/csstools/postcss-plugins/wiki/Plugin-best-practices)
- [CSSTools authoring guidelines](https://github.com/csstools/postcss-plugins/blob/main/AUTHORING_GUIDELINES.md)

## Trouble shooting

This is a mono repo that contains unpublished packages.
If you get warning about missing files, modules, packages you should do :

- `npm install` -> get public dependencies
- `npm run build` -> build private dependencies

_if your issues is not mentioned here please open an issue so that we can extend the guides_

[already been reported]: https://github.com/csstools/postcss-plugins/issues
[fork this project]:     https://github.com/csstools/postcss-plugins/fork
[live example]:          https://codepen.io/pen
[open a pull request]:   https://help.github.com/articles/using-pull-requests/
[reduced test case]:     https://css-tricks.com/reduced-test-cases/
