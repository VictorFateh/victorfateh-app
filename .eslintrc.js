module.exports = {
  root: true,
  env: { node: true },
  extends: [
    "plugin:vue/recommended"
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    "parser": "babel-eslint",
    "sourceType": "module"
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      env: { mocha: true }
    }
  ],
  ignorePatterns: [
    ".eslintrc.js",
    "babel.config.js",
    "vue.config.js"
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/html-indent": ["error", 2],
    "vue/max-attributes-per-line": ["error", {
      singleline: 6,
      multiline: {
        max: 6,
        allowFirstLine: true
      }
    }],
    "vue/singleline-html-element-content-newline": ["off"],
    "vue/multiline-html-element-content-newline": ["off"],
    "vue/html-closing-bracket-newline": ["error", {
      singleline: "never",
      multiline: "always"
    }],
    "curly": [
      "off"
    ],
    "nonblock-statement-body-position": [
      "error",
      "below"
    ],
    "class-methods-use-this": "off",
    "import/prefer-default-export": "off",
    "object-curly-newline": [
      "error",
      {
        "ObjectExpression": "always",
        "ObjectPattern": "never",
        "ImportDeclaration": "never",
        "ExportDeclaration": "never"
      }
    ],
    "object-curly-spacing": ["error", "always"],
    "object-curly-newline": [
      "error",
      { "multiline": true }
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": ["error", "always"],
    "no-useless-constructor": "off"
  }
};