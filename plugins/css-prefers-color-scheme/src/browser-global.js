/* global self */
import { default as prefersColorSchemeInit } from './browser';
self.prefersColorSchemeInit = prefersColorSchemeInit;

// Legacy : there used to be a rollup config that exposed this function under a different name.
self.initPrefersColorScheme = prefersColorSchemeInit;
