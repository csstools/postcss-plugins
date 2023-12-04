import { PluginCreator } from 'postcss';
/** postcss-cascasde-layers plugin options */
type pluginOptions = {
    /** Emit a warning when the "revert" keyword is found in your CSS. default: "warn" */
    onRevertLayerKeyword?: "warn" | false;
    /** Emit a warning when conditional rules could change the layer order. default: "warn" */
    onConditionalRulesChangingLayerOrder?: "warn" | false;
    /** Emit a warning when "layer" is used in "@import". default: "warn" */
    onImportLayerRule?: "warn" | false;
};
declare const creator: PluginCreator<pluginOptions>;
export type { pluginOptions };
export = creator;
