import kayahrConfigs from "@kayahr/eslint-config";
import globals from "globals";

export default [
    {
        ignores: [
            "doc",
            "lib"
        ]
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    },
    {
        files: [ "**/*.js" ],
        languageOptions: {
            sourceType: "commonjs"
        }
    },
    ...kayahrConfigs
];
