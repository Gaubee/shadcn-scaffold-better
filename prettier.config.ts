import { type Config } from "prettier";

const config: Config = {
  trailingComma: "all",
  singleQuote: false,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  bracketSpacing: true,
  arrowParens: "always",
  printWidth: 120,
  endOfLine: "lf",
  jsxBracketSameLine: true,
  jsxSingleQuote: false,
  bracketSameLine: true,
  plugins: ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"],
};

export default config;
