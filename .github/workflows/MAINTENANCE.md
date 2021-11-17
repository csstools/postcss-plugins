# test.yml

## workspaces

At the moment not all current LTS node versions have workspaces support.
We work around this by building in node 16 and switching to an older version to run tests.

Once node 20 reaches LTS each version will have workspaces support.
At that point the `test_without_workspaces_support` job can be removed.

## test_with_workspaces_support

This can be renamed to `test` once node 20 reaches LTS.
We include all LTS versions + latest in the matrix.
At the moment there is no `current` or `latest` keyword so this is hard coded.
