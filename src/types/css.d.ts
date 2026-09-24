// Plain side-effect CSS imports — `import "./globals.css"`,
// `import "react-photo-view/dist/react-photo-view.css"`.
//
// Next's bundler handles these at build time, but TypeScript has no idea what
// a `.css` file is. Under `noUncheckedSideEffectImports` — on by default in
// newer TypeScript, including the version VS Code bundles — every bare import
// must resolve to a module, so without this each one is an error in the editor
// (TS2882) even though `pnpm build` passes.
//
// CSS Modules (`*.module.css`) keep Next's own, more specific typing: the
// longer pattern wins.
declare module "*.css";
