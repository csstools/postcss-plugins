// Every nesting selector is replaced by the full parent selector.
// The resulting size is the number of nesting selectors times the size of the parent.
// Bound it so that a small input can not cause a huge output.
export const MAX_SELECTOR_COMBINATIONS = 10_000;
