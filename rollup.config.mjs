import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import alias from "@rollup/plugin-alias";
import { builtinModules } from "module";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import path from "path";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const browserPolyfills = {
    util: require.resolve("util/"),
    path: require.resolve("path-browserify"),
    stream: require.resolve("stream-browserify"),
    buffer: require.resolve("buffer/"),
    querystring: require.resolve("querystring-es3")
};

export default /** @type {import('rollup').RollupOptions} */ ({
    input: "src/index.ts",
    output: [
        {
            file: "dist/index.cjs.js",
            format: "cjs",
            sourcemap: true
        },
        {
            file: "dist/index.esm.js",
            format: "esm",
            sourcemap: true
        }
    ],
    external: ["axios"],
    plugins: [
        // Алиасы для замены Node.js модулей на браузерные полифиллы
        alias({
            entries: Object.keys(browserPolyfills).map(find => ({
                find,
                replacement: browserPolyfills[find]
            }))
        }),
        resolve({
            browser: true, // Указываем, что это браузерная сборка
            preferBuiltins: false // Не использовать встроенные модули Node.js
        }),
        resolve(),
        commonjs(),
        json(),
        typescript({
            tsconfig: "./tsconfig.json",
            clean: true
        })
    ]
});
