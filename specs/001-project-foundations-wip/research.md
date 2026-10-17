# Research: Project Foundations and WIP Page

**Date**: 2026-10-17. Research and proposals only; no packages or services installed.
The owner selected the stack. Alternatives below compare integration approaches rather than
reopening approved product decisions. See plan C-01 for the owner-approved resolution of the initial quality-gate conflict.

## Runtime and reproducibility

**Decision**: Owner-approved exact Node 24.22.0 in `mise.toml`, npm bundled with that release, committed
lockfile and `npm ci`. Record actual npm version at lockfile creation; verify package peers
before installation. Avoid floating runtime aliases in committed configuration.

**Rationale**: Node's release notes identify 24.22.0 as LTS; an exact project pin reduces drift.
Mise supports project Node management. Reusing bundled npm avoids a second runtime manager.
`npm ci` rejects a mismatched lockfile and does not rewrite it.

**Alternatives considered**: A floating `24` alias drifts between clones; nvm-only setup adds
another manager; containers impose unnecessary bootstrap cost for one static page. Keep mise
as requested, with shell-independent execution and documented platform prerequisites.

**Sources**: [Node 24.22.0 release](https://nodejs.org/en/blog/release/v24.22.0),
[mise Node](https://mise.jdx.dev/lang/node.html),
[npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci/).

## Static framework, styling and checking

**Decision**: Astro static output, strict TypeScript, no server adapter; Tailwind 4 through
`@tailwindcss/vite`, global CSS import, minimal semantic variables only. Use `astro check`
independently and a focused TypeScript no-emit tooling check for Node scripts.

**Rationale**: WIP content changes only on deployment and requires no runtime. Build and dev
transpile TypeScript without guaranteeing type correctness. Tailwind's current Astro setup
uses its Vite plugin. A small CSS seam supports later Penpot tokens without a premature design
system. Proposed layout values require owner approval before implementation.

**Alternatives considered**: SSR adds runtime/cost without user value; legacy
`@astrojs/tailwind` follows the older Tailwind integration; a full token/component library or
client framework goes beyond this foundation. Container/component testing is unnecessary for
one static page; test the built application instead.

**Sources**: [Astro TypeScript](https://docs.astro.build/en/guides/typescript/),
[Tailwind Astro integration](https://tailwindcss.com/docs/installation/framework-guides/astro),
[Astro testing](https://docs.astro.build/en/guides/testing/).

## Lint, format and spelling responsibilities

**Decision**: ESM ESLint flat config with recommended JS, TypeScript and Astro rules, scoped
globals and separate semantic checks. Prettier with Astro plugin owns formatting; CSpell
checks owned human-readable content with a reviewed project dictionary.

**Rationale**: Preserve the Astro parser when layering TypeScript rules. The current Astro
plugin guide requires ESLint 10 and Node at least 24.16.0 on the Node 24 line; the proposed
runtime satisfies that floor. Verify the final peer graph instead of copying obsolete flat
preset names. Start with inexpensive recommended linting rather than typed lint on each commit.
The current preset is `configs.recommended`; the old `flat/recommended` examples may be stale.

**Alternatives considered**: Oxlint/Biome duplicate selected responsibilities; automatic hook
formatting risks staging unrelated changes. Non-mutating staged checks plus explicit format
commands are simpler. Exclude unchanged vendor-generated Spec Kit tooling from bulk rewrites,
but include owned constitution/specification prose in spelling checks.

**Sources**: [Astro ESLint guide](https://ota-meshi.github.io/eslint-plugin-astro/user-guide/),
[typescript-eslint](https://typescript-eslint.io/getting-started/),
[Prettier Astro plugin](https://github.com/withastro/prettier-plugin-astro),
[CSpell custom dictionaries](https://cspell.org/docs/getting-started).

## Meaningful testing and local feedback

**Decision**: Vitest Node environment plus matching V8 coverage; Playwright against existing
built output with an automatically started Astro preview server. Branch/runtime validation
provide real unit targets; Git/CLI behavior provides integration targets. Use disposable
repositories for gate tests, not the active repository.

**Rationale**: No artificial utility or meaningless constant test is needed. Preview tests
exercise generated HTML/CSS. Keeping build separate allows future CI to reuse the same `dist/`
artifact. Browser installation must be explicit, including documented Linux OS dependencies.

**Alternatives considered**: jsdom/component mocks do not prove the actual site loads;
launching the dev server hides production differences; rebuilding inside every E2E job wastes
work and breaks artifact identity. No arbitrary coverage percentage is proposed.

**Sources**: [Vitest coverage](https://vitest.dev/guide/coverage.html),
[Playwright web server](https://playwright.dev/docs/test-webserver).

## Hooks, branches and commits

**Decision**: Lefthook invokes shared project commands. Stage-specific fast hooks follow the
new Constitution VI v2.0.0, following the owner-approved specification alignment C-01. Node owns branch
validation; Commitlint owns message rules and explicit PR ranges.

**Rationale**: Lefthook supports staged-file selection and hook arguments. The proposal uses
an argument-safe Node dispatcher rather than arbitrary shell filename interpolation. Partial
staging is explicitly rejected for overlapping files, rather than silently checking content
different from the index. The owner explicitly approved this contributor tradeoff during plan review.

**Alternatives considered**: Third-party branch-lint packages add no necessary capability;
last-commit-only linting misses invalid earlier PR commits; hooks alone are bypassable and
cannot enforce protected branch policy. Full pre-commit browser tests violate the new rule's
fast-feedback intent; the owner has approved aligning the spec with the new constitution.

**Sources**: [Lefthook run and file templates](https://lefthook.dev/configuration/run/),
[Commitlint CI setup](https://commitlint.js.org/guides/ci-setup).

## Future Cloudflare and delivery architecture

**Decision**: Recommend assets-only Cloudflare Workers Static Assets for future deployment,
without Worker code or the Astro server adapter. GitHub Actions will orchestrate validation,
artifact storage, staging and promotion; nothing is provisioned in this feature.

**Rationale**: Current Cloudflare guidance supports Astro SSG assets without a Worker entry
point. Static requests and storage have no separate charge under the documented static-asset
model; dynamic invocations have separate pricing. Keep the account on an explicitly approved
free-tier setup and recheck limits before the future feature.

**Alternatives considered**: Pages is a possible static host, but assets-only Workers follows
the current Astro guide and leaves a later dynamic path without adding runtime now. Git-linked
provider rebuilds complicate explicit orchestration and same-artifact promotion. A global SSR
migration, paid upgrade or production Quick Tunnel has no requirement here.

**Sources**: [Cloudflare Astro](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/),
[Static asset billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/).

## Research outcome

No unresolved choice of framework, package manager, styling system or quality tool remains:
the owner supplied them. Implementation must verify exact dependency releases and lock their
compatible graph. Outstanding decisions are listed explicitly as D-01–05 in the plan; research
cannot supply human approval. C-01 is resolved by explicit owner-approved constitution/specification changes. The future
platform choice is a recommendation, not authorized infrastructure or spending.

## LinkedIn and structured identity — owner-confirmed extension

**Decision**: Add one accessible, locally rendered LinkedIn icon link and static JSON-LD
with a WebSite and Person author. The owner confirmed option B: site name and URL, public
name Antonio Camacho Mira, and the provided LinkedIn profile. The public link preserves the
profile path without its self-profile query parameter. No profile scraping is needed.

**Rationale**: WebSite identifies the site; Person identifies its owner, with `sameAs` linking
the confirmed profile. Keep metadata grounded in the page's actual identity/purpose; it does
not guarantee search appearance or ranking. Non-executable JSON-LD needs no client runtime.
A small typed graph builder and script-safe serializer give Vitest a meaningful SEO target.

**Alternatives considered**: Site-only metadata was offered but the owner selected site and
person identity. A complete resume schema, employment data, ProfilePage claims, remote social
widgets and a full icon library exceed the requested scope. Locally bundled SVG provenance
and exact icon styling remain subject to review; no third-party assets were downloaded now.

**Sources**: [WebSite](https://schema.org/WebSite), [Person](https://schema.org/Person),
[sameAs](https://schema.org/sameAs),
[Google structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

## C1 resolution: minimal measurable performance budget

**Decision**: The owner accepted the recommended 100 KiB (102,400-byte) uncompressed initial
page/resource budget and zero external resource requests before LinkedIn activation. Encode
this as FR-012/SC-008 and verify it with the existing built-site Playwright suite; introduce
no paid service or additional performance toolchain.

**Rationale**: This gives the minimal WIP page a reproducible quantity-based acceptance limit
without claiming deployment latency from localhost. The precise threshold is an explicit
project decision, not an industry-standard requirement. Count unique decoded response bodies,
including HTML and its required resources; embedded metadata/icons are not double-counted.

**Alternatives considered**: A stricter 50 KiB budget was offered; the owner chose the
recommended 100 KiB option. A time-based public-page SLO needs hosting/network conditions,
which are outside this feature. Controlled oversized/external-resource fixtures verify that
the budget checks can actually reject violations.

**Source**: [web.dev performance budgets](https://web.dev/articles/performance-budgets-101).
