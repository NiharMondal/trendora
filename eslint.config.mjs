import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    {
        ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
    },
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
        },
    },
    {
        // Accessibility (FE-32). `next/core-web-vitals` registers jsx-a11y
        // but enables only a handful of its rules; these are the ones the app
        // was clean against after the FE-32 pass, so they are errors — a new
        // clickable <div> or unlabelled field fails lint, not an audit.
        //
        // They cannot see inside our own components: an icon-only shadcn
        // <Button> with no aria-label passes. Give those a label by hand.
        files: ["src/**/*.tsx"],
        ignores: ["src/shared/ui/**"], // vendored shadcn primitives
        rules: {
            "jsx-a11y/click-events-have-key-events": "error",
            "jsx-a11y/no-static-element-interactions": "error",
            "jsx-a11y/no-noninteractive-element-interactions": "error",
            "jsx-a11y/interactive-supports-focus": "error",
            "jsx-a11y/label-has-associated-control": [
                "error",
                // Our <Input> is a real <input>; an implicit <label> around it
                // is a valid label.
                { controlComponents: ["Input"], depth: 3 },
            ],
            "jsx-a11y/control-has-associated-label": [
                "error",
                {
                    ignoreElements: ["td", "th", "tr", "input", "textarea", "video", "audio", "canvas", "embed"],
                    ignoreRoles: ["grid", "listbox", "menu", "menubar", "radiogroup", "row", "tablist", "toolbar", "tree", "treegrid"],
                },
            ],
            "jsx-a11y/anchor-is-valid": "error",
            "jsx-a11y/anchor-has-content": "error",
            "jsx-a11y/heading-has-content": "error",
            "jsx-a11y/img-redundant-alt": "error",
            "jsx-a11y/no-autofocus": "error",
        },
    },
];

export default eslintConfig;
