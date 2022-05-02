/** @constant {string} INVALID_LAYER_NAME Used to replace "layer" temporarily when an invalid layer is detected. This allows us to ignore this rule in further processing. */
export const INVALID_LAYER_NAME = 'csstools-invalid-layer';
/** @constant {string} WITH_SELECTORS_LAYER_NAME Used to replace "layer" temporarily for any layer at rules that contain selectors. This allows us to sort these differently from other layer at rules. */
export const WITH_SELECTORS_LAYER_NAME = 'csstools-layer-with-selector-rules';
