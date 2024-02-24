import esbuild from "esbuild";
import sveltePlugin from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import process from "process";
import builtins from "builtin-modules";
import { config } from "dotenv";

config();

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this module
*/
`;

const prod = process.argv[2] === "production";

const parameters = {
    banner: {
        js: banner
    },
    entryPoints: ["src/main.ts", "src/styles.css"],
    bundle: true,
    external: [
        "obsidian",
        "electron",
        "codemirror",
        "@codemirror/autocomplete",
        "@codemirror/closebrackets",
        "@codemirror/collab",
        "@codemirror/commands",
        "@codemirror/comment",
        "@codemirror/fold",
        "@codemirror/gutter",
        "@codemirror/highlight",
        "@codemirror/history",
        "@codemirror/language",
        "@codemirror/lint",
        "@codemirror/matchbrackets",
        "@codemirror/panel",
        "@codemirror/rangeset",
        "@codemirror/rectangular-selection",
        "@codemirror/search",
        "@codemirror/state",
        "@codemirror/stream-parser",
        "@codemirror/text",
        "@codemirror/tooltip",
        "@codemirror/view",
        "moment",
        ...builtins
    ],
    format: "cjs",
    target: "es2020",
    logLevel: "info",
    sourcemap: prod ? false : "inline",
    minify: prod,
    treeShaking: true,
    outdir: "./build",
    plugins: [
        sveltePlugin({
            compilerOptions: { css: "injected" },
            preprocess: sveltePreprocess(),
            filterWarnings: (warning) => {
                if (warning.code.toLowerCase().startsWith("a11y-")) {
                    return false;
                }
                return true;
            }
        })
    ]
};

if (prod) {
    await esbuild.build(parameters).catch((x) => {
        if (x.errors) {
            console.error(x.errors);
        } else {
            console.error(x);
        }
        process.exit(1);
    });
} else {
    let ctx = await esbuild.context(parameters);
    await ctx.watch();
}