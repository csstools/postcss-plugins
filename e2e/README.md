# e2e tests

We try to standardize how we build, bundle and publish each plugin.
To verify that we are doing this correctly for the ecosystem as a whole we have a set of e2e tests.

Things we currently verify :
- can we use plugins with `postcss-loader`?
- can we bundle plugins with `webpack` and use them in a browser?
- can we use TypeScript and import/run plugins?
- can we use plugins with `postcss-cli`?

We want to be sure that any give change is safe for as many users as possible.

_Contributions are welcome._
