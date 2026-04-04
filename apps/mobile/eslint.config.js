// https://docs.expo.dev/guides/using-eslint/
import expoConfig from "eslint-config-expo/flat";
import { defineConfig } from "eslint/config";
module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
]);
