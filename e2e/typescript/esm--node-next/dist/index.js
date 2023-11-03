"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const postcss_preset_env_1 = __importDefault(require("postcss-preset-env"));
(0, postcss_preset_env_1.default)({ preserve: true });
assert_1.default.ok(postcss_preset_env_1.default.postcss, 'should have "postcss flag"');
assert_1.default.equal(typeof postcss_preset_env_1.default, 'function', 'should return a function');
