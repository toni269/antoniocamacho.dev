# Development and architecture

The application is a single static-first Astro package. `src/pages/index.astro` composes
`BaseLayout.astro`, replaceable `src/content/` data and `LinkedInLink.astro`.
`src/lib/structured-data.ts` connects WebSite and Person entities, validates HTTPS URLs and
escapes less-than characters before embedding JSON-LD. The decorative SVG is local. A small first-party module enhances the LinkedIn interaction;
no remote widget, SPA, SSR adapter or runtime feature flag is shipped.
The minimal styles in `src/styles/global.css` implement approved Design Baseline v3;
its semantic variables are a starting point, not the final Penpot design system.

## Configuration and dependencies

| File                                            | Purpose and dependency rationale                                                                                             |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `mise.toml`, `.npmrc`, `package.json`, lockfile | Exact Node/npm contract, private MIT package, reproducible exact direct dependencies                                         |
| `astro.config.mjs`                              | Astro static output; Tailwind 4 through `@tailwindcss/vite`, no legacy integration                                           |
| `tsconfig.json`, `tsconfig.tooling.json`        | Astro strict TypeScript plus checked Node script/config JavaScript; `@types/node` supplies runtime types                     |
| `eslint.config.mjs`                             | ESLint flat JS/TypeScript/Astro presets, correct parsers/globals; Prettier compatibility disables competing formatting rules |
| `prettier.config.mjs`, `.prettierignore`        | Prettier with Astro parser, separate write/check; preserve upstream Spec Kit and reviewer-owned checklist files              |
| `cspell.config.json`, project dictionary        | CSpell across owned readable source/docs/specs; reviewed technical terms and generated exclusions                            |
| `vitest.config.ts`                              | Vitest Node unit/integration suites and matching V8 coverage; no implicit builds or browsers                                 |
| `playwright.config.ts`                          | Playwright Chromium built-site acceptance at approved viewports, auto-started strict-port preview                            |
| `commitlint.config.mjs`                         | Commitlint conventional messages; direct CLI works independently of hooks                                                    |
| `lefthook.yml`                                  | Lefthook stage orchestration; project-owned Node scripts handle Git policy without extra branch packages                     |
| `.gitignore`                                    | Dependencies, artifacts, environments, reports and machine-local overrides excluded                                          |

`@astrojs/check` and TypeScript validate separately from build. npm scripts expose each tool;
there are no redundant linters, schema packages or icon libraries. Dependencies are development
build/test tools; the public artifact is HTML/CSS with an inline SVG, JSON-LD and the small interaction module.
`scripts/check-runtime.mjs`, `check-branch.mjs`, `check-staged.mjs`, `check-push-commits.mjs`
and `install-hooks.mjs` document their inputs and errors inline. Tests live in unit,
integration and E2E directories, with intentional Git operations isolated in temporary repos.

## Runtime and recovery

Use the README's `mise trust`, `mise install`, `mise exec -- npm ci` sequence.
For an interactive shell, follow [mise activation](https://mise.jdx.dev/dev-tools/).
For an editor or Git client, launch it from that activated shell or configure it to inherit
mise's Node PATH. A wrong Node version is rejected with the expected pin and remediation.
`mise exec -- npm run hooks:install` repairs hooks after dependency installation. Non-Git
source archives skip hook installation; CI skips local hook installation explicitly, while
independent validation commands remain available. No undocumented absolute machine paths
are embedded in project scripts.

Browser binaries are installed explicitly with `npm run test:e2e:install`. On supported Linux,
`-- --with-deps` also requests required system libraries; follow Playwright's printed diagnosis
if unavailable. macOS and WSL2 are supported targets, but only the recorded Linux environment
was exercised here. `preview` uses `--ignore-lock` to keep Astro in the foreground even when
an agent is detected; strict port handling prevents silently testing a different endpoint.
Stop a separate local server first. Test reports, browser traces and screenshots are ignored.

## Public content and icon attribution

Forks can change `src/content/site.ts` and `src/content/wip.ts` without replacing components.
Only approved public name, site URL and LinkedIn URL appear in metadata. No environment
variables are currently required; introduce safe `.env.example` documentation only if needed.
Never put private CV source or credentials into source or static assets.

The local `src/assets/linkedin.svg` is Font Awesome Free 7.0.0's `linkedin-in` brand icon:
[source](https://github.com/FortAwesome/Font-Awesome/blob/7.0.0/svgs/brands/linkedin-in.svg),
[license](https://github.com/FortAwesome/Font-Awesome/blob/7.0.0/LICENSE.txt).
Copyright 2025 Fonticons, Inc.; SVG icons use CC BY 4.0. The upstream attribution comment is
preserved, and the icon is rendered decoratively in the approved size/current text color.
The application MIT license does not grant LinkedIn trademark rights; use this mark only to
identify the profile destination, without implying endorsement.

## Delivery boundary

Hosting, DNS, GitHub Actions, credentials and paid services are deliberately unconfigured.
See [delivery direction](delivery-architecture.md). Local quality does not prove remote CI,
staging or production. Hooks are bypassable; future CI must independently check the PR head
branch and complete commit range, all quality gates, coverage, one static build and E2E.

Lefthook uses `scripts/run-lefthook.mjs` with `--no-stage-fixed` so its default unstaged-change
hiding cannot bypass our overlap rejection. This disables automatic stash/fix behavior, not
quality checks. See the [custom command option](https://lefthook.dev/configuration/lefthook/)
and [upstream guard discussion](https://github.com/evilmartians/lefthook/issues/1561).
The shared `scripts/git-utils.mjs` runs argument arrays and preserves error causes.
`allowScripts.lefthook: false` suppresses duplicate dependency postinstall; the project
`prepare` entry point performs the explicit, documented hook installation instead.

Design Baseline v3 uses a 24px message and a blue `#0A66C2` profile icon. The heading
fills the message-defined width with native CSS `text-fit: grow` where supported; its
inline-size containment prevents the heading itself from establishing that width. The
semantic text remains CSS-fitted without a text-sizing script. Other browsers retain
the readable 5rem fallback; exact width matching is verified in the approved Chromium matrix.

Browser light/dark preference controls the page background and text using semantic CSS
variables and `prefers-color-scheme`. The focus outline follows the foreground token;
the blue profile accent stays constant. Changes apply live without scripts or stored settings.

## LinkedIn invitation and activation

`src/lib/linkedin-motion.ts` generates six bounded random particle trajectories, decides which
clicks can be enhanced, and owns the one-shot 600ms launch timer. `src/scripts/linkedin-link.ts`
connects that behavior to existing native anchors, removes particles when reduced motion is
requested, and announces launch feedback through a status region. The Astro component bundles
that local entry point; Astro may inline a sufficiently small module into the built HTML.
There are no animation dependencies, external requests or stored visitor preferences.

The 44px circular anchor stays stationary while the 24px icon sways and decorative dots
converge into its translucent halo. Invitation animations repeat, pause on keyboard focus and use a stronger halo/glow in dark mode. Hover keeps the loop moving and intensifies blue in both themes.
Click/Enter shows the rocket before same-tab navigation; repeated activation schedules only
one navigation. Modified/middle clicks retain browser behavior, and disabling JavaScript
leaves a functional native link. Reduced motion disables dots/sway and rocket movement,
while retaining the static rocket feedback. Themes, spacing and focus colors remain shared.
