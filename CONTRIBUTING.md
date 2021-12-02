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

   # Install the tools necessary for testing
   # Node 16 or higher is required to build and run tests.
   # There is config for nvm and volta to help you use the right version.
   npm install

   # Do an initial build of everything to make sure local dependencies can be found.
   npm run build --workspaces
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

[already been reported]: issues
[fork this project]:     fork
[live example]:          https://codepen.io/pen
[open a pull request]:   https://help.github.com/articles/using-pull-requests/
[reduced test case]:     https://css-tricks.com/reduced-test-cases/
