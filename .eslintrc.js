module.exports = {
    root: true,
    extends: ["plugin:vue/recommended", "@vue/typescript"],
    parser: "vue-eslint-parser",
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        project: "tsconfig.json",
        parser: "@typescript-eslint/parser"
    },
    overrides: [
        {
            files: ["**/__tests__/*.{j,t}s?(x)"],
            env: {
                mocha: true
            }
        }
    ],
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
        "vue/html-indent": ["error", 4],
        "vue/max-attributes-per-line": ["error", {
            "singleline": 6,
            "multiline": {
                "max": 6,
                "allowFirstLine": true
            }
        }],
        "vue/singleline-html-element-content-newline": ["off"],
        "vue/multiline-html-element-content-newline": ["off"],
        "vue/html-closing-bracket-newline": ["error", {
            "singleline": "never",
            "multiline": "always"
        }]
    }
};
