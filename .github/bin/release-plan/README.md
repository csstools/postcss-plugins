# Release Plan

This is a mono repo with a complex dependency graph.  
A small change in a single package might require releasing dozens of packages.

To orchestrate this, we use the `CHANGELOG.md` files in each public package.

Any package that contains `### Unreleased (patch|minor|major)` is considered to have unreleased changes.

The release planner is aware of npm workspaces and can build a correct dependency graph.  
It will create discrete release plans, containing as many packages as possible.

A package will be part of the current release plan only when :
- it has a correct entry in the `CHANGELOG.md` file
- it does not depend on any other unreleased packages
- it is a public package

The release planner will update any `CHANGELOG.md` file of dependant packages so that these will be part of a future release plan.

_While technically possible to automate and release all package in a single run we have chosen to pause between each plan.  
This gives maintainers the option to intervene and do manual work when needed._


## Dry Run

The `--dry-run` flag will stop the command after initial analysis.  
This is useful to gain some insights into what will be released before actually releasing anything.


## DEBUG

The `DEBUG` env variable will prevent any work to be done that is permanent or observable from the outside.

Things that will be skipped :
- git commit
- npm publish
- discord notifications

The command itself however will continue as if the work was actually done.
