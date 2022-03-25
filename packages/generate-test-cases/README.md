# Generate Test Cases

Similar issues often appear in plugins and this can cause add extra friction
as it is easy to forget a plugin when testing for a new known issue.

## Usage :

```bash
npm run generate --workspace="@csstools/generate-test-cases"
```

## Incorrect CSS in result.css and expect.css

These tests should not be used to force 100% correctness of output CSS.
They are intended to make unknown bugs visible.

Some issues might be unfixable and this is ok.
