module.exports = {
  root: true,
  extends: ["@workspace/eslint-config/base"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
};
