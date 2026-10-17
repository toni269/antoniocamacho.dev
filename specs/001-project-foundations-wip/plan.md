# Implementation Plan: Project Foundations and WIP Page

**Branch**: `feat/project-foundations-wip` | **Date**: 2026-10-17 | **Spec**: [spec.md](spec.md)

**Input**: `specs/001-project-foundations-wip/spec.md` and the owner's technical planning brief.

**Status**: APPROVED FOR IMPLEMENTATION. The owner explicitly confirmed the remaining
WIP values on 2026-10-17: system sans-serif; bold heading matching the message width; 1.5rem regular message;
0.5rem heading/message gap; 1rem message/profile gap; 1.5rem minimum page padding; 24×24px blue (`#0A66C2`) LinkedIn icon; 2px foreground-colored keyboard-focus
outline with 4px offset; profile navigation in the same tab. D-03 is resolved. Hosting and
pipeline implementation remain deferred.

## Summary

Create a minimal Astro static site with strict TypeScript and Tailwind CSS 4. The only visible
page is the approved browser-themed WIP screen with a LinkedIn icon link below
the explanatory message and minimal structured website/owner identity data. Establish reproducible Node/npm
setup, documented commands, meaningful tests, and local quality tooling. Preserve the public
MIT repository and forkability. Keep hosting, GitHub Actions, DNS, and deployments outside this
feature; describe their future boundaries in [delivery-architecture.md](delivery-architecture.md).

The owner-selected stack is fixed input. Research evaluates integration methods and simpler
alternatives within those constraints; it does not replace them. Proposed details below still
require owner approval under Constitution I. [research.md](research.md) records supporting
sources, alternatives, costs, and compatibility findings.

## Technical Context

**Language/Version**: TypeScript strict for application/tests; ESM JavaScript with JSDoc for
small Node scripts/configuration. Owner-approved exact runtime: Node 24.22.0 LTS, managed by `mise`.
Use its bundled npm, recording the actual version in package metadata and the README when
creating the lockfile. Never use an unbounded `node@lts` configuration.

**Primary Dependencies**: Astro; Tailwind 4 and `@tailwindcss/vite`; TypeScript and
`@astrojs/check`; ESLint with Astro/TypeScript presets; Prettier with Astro plugin; CSpell;
Vitest with matching V8 coverage package; Playwright; Lefthook; Commitlint conventional preset.
The complete dependency inventory and reasons are below.

**Storage**: Static source files and generated `dist/` only; no database, authentication,
private CV data, content collection schemas, or runtime state.

**Testing**: Vitest Node-based unit/integration tests for real tooling behavior; Playwright
against the built site; controlled Git-operation tests in disposable local repositories.

**Target Platform**: Owner-approved Linux/macOS and Windows through WSL2, with Linux as the
future CI baseline. Native Windows support is not claimed by this foundation.

**Project Type**: Single static website with repository-owned development tooling.

**Performance Goals**: Owner-approved FR-012/SC-008 cap the cold-load production document
and all initially required resources at 100 KiB (102,400 bytes), uncompressed, with zero
external resource requests before LinkedIn activation. Count unique response bodies once;
embedded SVG/JSON-LD counts within HTML, not again as separate resources. Use built-site
Playwright checks, fresh browser contexts and decoded response-body sizes; record resource
URLs/sizes, total bytes and external requests before triggering the intercepted profile link.
Exercise controlled oversized/external-resource fixtures to prove rejection. Only the owner-approved local LinkedIn interaction module uses application client JavaScript.
No external fonts, trackers or runtime network dependencies are introduced.
This budget does not claim a measured public latency SLO or require deployment/Lighthouse tooling.

**Constraints**: No SSR, SPA, framework islands, APIs, feature flags, paid infrastructure,
automated pipeline installation, or final portfolio design. Detailed visual values were approved at implementation entry; no unapproved design identity is introduced.

**Scale/Scope**: One public route, one layout, two visible strings, one profile icon link,
minimal structured identity data, local toolchain, and tests.
Future content must be replaceable independently of application layout.

### Requirement mapping

| Spec requirement   | Planned solution                                                                     | Acceptance evidence                                                                  |
| ------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| FR-001–002, SC-001 | Static `/`, semantic heading and paragraph, exact WIP copy                           | Built-site smoke E2E and text assertions                                             |
| FR-003, SC-002     | Design Baseline v3; full-height centered group with safe overflow                    | Responsive, orientation, enlarged-text, color and position checks                    |
| FR-004, SC-003     | Exact mise runtime, npm lockfile, dev/build/preview scripts                          | Clean-clone walkthrough                                                              |
| FR-005             | README, contribution and tooling docs; code/config rationale                         | Walkthrough and documentation review                                                 |
| FR-006, SC-004     | Red/green evidence, Vitest unit/integration, built-site Playwright                   | Test-to-requirement evidence record                                                  |
| FR-007–008, SC-005 | Lefthook, shared npm commands, branch script, Commitlint                             | Controlled applicable gate failures; complete local suite; C-01 resolved             |
| FR-009             | Locked dependencies, non-mutating checks, fresh validation                           | Clean clone; changed-state and staged-content scenarios                              |
| FR-010, SC-006     | Local LinkedIn SVG in an accessible link beneath the message                         | Destination, keyboard activation and visible focus E2E checks                        |
| FR-011, SC-007     | Static WebSite/Person JSON-LD from confirmed public identity data                    | Safe-serialization unit tests; built-document identity graph assertions              |
| FR-012, SC-008     | 102,400-byte cold-load production budget; zero external resources before interaction | Built-site resource inventory, byte/request assertions and negative-fixture evidence |

### Dependency inventory

All packages are development/build-time dependencies for this SSG project; none require a
Node server in production. Resolve a mutually compatible release set under Node 24, record
exact direct versions, and commit `package-lock.json`. Keep Vitest and its coverage provider
on the same release. Do not invent patch versions before checking published peer requirements.

| Dependency                                           | Purpose and boundary                                                      |
| ---------------------------------------------------- | ------------------------------------------------------------------------- |
| `astro`                                              | Static routing, rendering, dev server, build and local artifact preview   |
| `typescript`, `@astrojs/check`                       | Strict source checking; `astro build` is not a type gate                  |
| `@types/node`                                        | Types for Node 24 tooling and tests                                       |
| `tailwindcss`, `@tailwindcss/vite`                   | Tailwind 4 through Vite; no legacy Astro Tailwind adapter                 |
| `eslint`, `@eslint/js`                               | Flat-config lint engine and JavaScript recommended rules                  |
| `typescript-eslint`                                  | Recommended TypeScript linting and parser integration                     |
| `eslint-plugin-astro`, `globals`                     | Astro parsing/rules and scoped Node/browser globals                       |
| `eslint-config-prettier`                             | Disable overlapping stylistic lint rules; Prettier owns format            |
| `prettier`, `prettier-plugin-astro`                  | Non-mutating format check and explicit manual formatter                   |
| `cspell`                                             | Spell checking with reviewed project dictionary                           |
| `vitest`, `@vitest/coverage-v8`                      | Meaningful unit/integration behavior tests and V8 coverage                |
| `@playwright/test`                                   | Browser tests against built output; browser binaries installed explicitly |
| `lefthook`                                           | Local hooks dispatching the same project commands available outside Git   |
| `@commitlint/cli`, `@commitlint/config-conventional` | Conventional commit message validation                                    |

`mise` and Git are documented prerequisites, not npm dependencies. No global Astro/npm tool
installation is required. No `@astrojs/cloudflare`, Wrangler, cloudflared, React, jsdom,
PostCSS configuration, Oxlint, Biome, feature-flag SDK, or deployment action is introduced.
Vite configuration types should use Astro's supported toolchain; add a direct Vite dependency
only if required for an explicitly imported API, respecting Astro's peer compatibility.

## Constitution Check

_Gate required before research and re-evaluated after design. A failure remains an ERROR;
research and conditional review documents do not authorize implementation._

| Rule                                                                    | Initial review                                    | Post-design review                                                                                      |
| ----------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| I: spec says what; plan researches how; human validates assumptions     | PASS for artifact separation                      | PASS: technical decisions and remaining visual values approved                                          |
| II: tests precede code, integration/E2E cover behavior                  | PASS                                              | PASS: test-first slices and evidence planned                                                            |
| III: approved design is component truth                                 | PASS: Spec Design Baseline v3                     | PASS: exact typography, spacing, icon and interaction values approved                                   |
| IV: full maintained documentation                                       | PASS                                              | PASS: explicit docs and clean-clone validation                                                          |
| V: feature branch/coherent commits                                      | PASS: actual Git branch matches supplied regex    | PASS: no unrelated implementation                                                                       |
| VI: fast local gates, independent full CI, runnable full local suite    | FAIL against v1.1.0 initially                     | PASS: owner amended constitution and aligned spec (C-01)                                                |
| VII: measurable SEO/performance/reproducibility and affordable learning | Performance criterion missing at initial analysis | PASS: FR-012/SC-008 now owner-approved; identity/reproducibility criteria retained; no services created |
| VIII: owner manually builds pipelines with guided steps                 | PASS: pipelines deferred                          | PASS: architecture only, no workflow/config activation                                                  |
| Spec scope: defer hosting/deployment/pipelines                          | PASS if future-only                               | PASS: current delivery proves static artifact locally, not deployment                                   |

### Conflicts and required resolution

**C-01 — Local check placement (resolved by explicit owner decisions).** The initial
brief contradicted Constitution VI v1.1.0 and spec FR-007–008, User Story 3 and SC-005.
The owner supplied a replacement Principle VI, now constitution v2.0.0, and then explicitly
approved alignment of those specification sections. The adopted model is fast pre-commit
checks, commit-msg validation, appropriate static/types and unit/integration at pre-push,
full independently enforced pre-merge CI, and a documented full local suite. No silent
exception was used. The revised spec keeps actual CI installation deferred; local validation
alone does not make a revision eligible for a protected merge without the later CI gates.

**C-02 — Deployment proof versus deferred scope.** The brief mentions proving the deployment
toolchain; the spec explicitly excludes hosting, DNS, deployment and pipelines. This feature
can prove production artifact generation and local built-site serving only. Actual Cloudflare
deployment, GitHub workflows, rulesets and staging evidence require a later specification,
with owner-built pipeline guidance. Do not claim successful deployment from a local build.

**C-03 — Future CI versus present enforcement.** No CI is installed in this feature, as the
owner previously confirmed. Local hooks therefore are not yet independently enforced remotely.
The future design adds CI parity and required checks before production; document this current
limitation rather than claiming branch protection or CI exists. No public delivery is part
of this foundation feature.

### Open decisions and approval boundaries

| ID   | Decision                              | Proposed reviewable direction                                                                                                                                                                                                 | When required                               |
| ---- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| D-01 | Resolve C-01                          | RESOLVED: owner amended constitution and approved spec alignment                                                                                                                                                              | Completed during planning                   |
| D-02 | Runtime and local platform baseline   | APPROVED: Linux/macOS/WSL2 and exact Node 24.22.0; selected packages locked after peer verification                                                                                                                           | Approved during plan review                 |
| D-03 | Detailed WIP design                   | APPROVED: system sans-serif; bold heading matching the message width, 1.5rem paragraph, 0.5rem heading/message gap and 1rem profile gap, 1.5rem padding; 24px blue icon, 2px theme-foreground focus/4px offset, same-tab link | Approved during implementation entry review |
| D-04 | Browser/viewport acceptance matrix    | APPROVED: Chromium at 360×800, 800×360, 1440×900; 200% text enlargement; 4 CSS-pixel center tolerance when content fits                                                                                                       | Approved during plan review                 |
| D-05 | Future release/security/cost policies | Separate staging/production static deployments, verified same artifact; no paid upgrade                                                                                                                                       | Later delivery feature                      |
| D-06 | Staged-file policy                    | APPROVED: reject files with both staged and unstaged edits; contributor stages complete file or separates the change                                                                                                          | Approved during plan review                 |

D-02, D-04 and D-06 were explicitly approved during plan review. D-03 was explicitly approved at implementation entry; the supplied stack choices are not being reopened. Package peer verification is a bounded
implementation check, not an invitation to choose another framework. Existing unconfirmed
constitution ratification date is preserved, not inferred here.

## Project Structure

### Documentation (this feature)

```text
specs/001-project-foundations-wip/
├── spec.md                         # Functional source; owner-approved quality-gate alignment
├── checklists/requirements.md      # Existing specification quality checklist
├── plan.md                         # This technical plan
├── research.md                     # Decisions, alternatives, primary sources
├── data-model.md                   # Static content/config boundaries, no database
├── quickstart.md                   # Planned validation guide; not executed now
├── delivery-architecture.md        # Future CI/CD and Cloudflare boundaries only
└── contracts/
    ├── page.md                    # Built page and visual acceptance contract
    └── quality.md                 # CLI, Git gate and failure contracts
```

`tasks.md` is deliberately absent; it belongs to `$speckit-tasks` after owner review of this
plan. No feature implementation, dependencies, hooks or workflows are created now.

### Source Code (repository root)

Proposed files to create during implementation, not files created by this planning command:

```text
mise.toml                          # Exact Node 24 patch; no per-machine paths
package.json                       # private package, MIT, npm scripts, runtime metadata
package-lock.json                  # Committed dependency graph
.npmrc                             # save-exact and engine-strict; no auth tokens
astro.config.mjs                   # output: static; Tailwind Vite plugin
tsconfig.json                     # astro/tsconfigs/strict; application/test includes
tsconfig.tooling.json             # Strict no-emit JSDoc/Node script validation
eslint.config.mjs                  # ESM flat config; JS, TS, Astro, tests and tooling
prettier.config.mjs                # Explicit Astro plugin and parser
.prettierignore                    # Generated output/vendor artifacts
cspell.config.json                 # Human-readable owned file scope, exclusions
cspell-project-words.txt            # Reviewed project/technical vocabulary
vitest.config.ts                   # Node unit/integration; excludes E2E
playwright.config.ts               # Built preview webServer; Chromium baseline proposal
commitlint.config.mjs              # Conventional preset and supported types
lefthook.yml                       # Stage-specific hooks under constitution 2.0.0
src/
├── pages/index.astro              # Only public route
├── layouts/BaseLayout.astro       # Document language, title, viewport, global CSS
├── content/wip.ts                 # Public replaceable WIP copy
├── content/site.ts                # Confirmed website/owner name, canonical URL, LinkedIn
├── components/LinkedInLink.astro   # Accessible local icon link; no remote widget
├── assets/linkedin.svg            # Local SVG; provenance/license reviewed before use
├── lib/structured-data.ts         # Minimal typed graph and safe JSON-LD serialization
└── styles/global.css              # Tailwind import and minimal semantic variables
scripts/
├── check-runtime.mjs              # Explain wrong runtime/npm environment
├── check-branch.mjs               # Exact allowed regex + main/develop exceptions
├── check-staged.mjs               # Safe staged-file checks, no auto-fix/staging
└── check-push-commits.mjs          # Resolve all outgoing messages for pre-push
tests/
├── unit/branch-name.test.ts       # Actual branch validation behavior
├── unit/runtime.test.ts           # Actual documented runtime guard behavior
├── unit/structured-data.test.ts   # Confirmed graph fields, escaping and link consistency
├── integration/tooling.test.ts    # CLI exit behavior, filenames, unavailable tools
├── integration/hooks.test.ts      # Disposable local Git operation gates
└── e2e/wip.spec.ts                # Built page smoke, baseline and responsive behavior
docs/
├── development.md                # Tool/config rationale and troubleshooting
└── testing.md                    # Test boundaries and reproducible gate checks
CONTRIBUTING.md                    # Feature workflow, conventions, red/green practice
README.md                          # Fresh-clone entry point; links to focused docs
.gitignore                        # Extend only for introduced generated/local artifacts
```

**Structure Decision**: One package, no monorepo, server, component library or full content
model. Shared layout and CSS are minimal real seams for future reuse. Public WIP copy and approved identity data remain in
`src/content/wip.ts` and `src/content/site.ts`, separate from markup; future collections are candidates, not scaffolding
created now. Preserve existing LICENSE, Spec Kit files and skills. No empty directories or
placeholder `.env.example` when no environment variables are required.

### Configuration and application design

- `mise.toml` is the runtime authority; package engines require Node 24 and expose the npm
  compatibility expectation. `check-runtime.mjs` verifies the exact project runtime before
  dependency preparation. Record bundled npm identity; do not add competing version files
  unless a documented integration needs them. `npm ci` consumes the committed lockfile.
- Package `private: true` prevents accidental publishing without changing MIT fork rights.
  `prepare`/`hooks:install` install Lefthook in contributor Git checkouts; handle non-Git
  artifact contexts explicitly without claiming hooks protect CI. Document mise trust and
  a shell-independent `mise exec -- ...` path, including hook PATH troubleshooting.
- Static output in `astro.config.mjs`; no adapter or runtime APIs. Tailwind 4 uses
  `@tailwindcss/vite` and a CSS import. A small semantic CSS variable layer can later map
  to Penpot typography, spacing, color, radius, responsive/theme/state tokens. No full
  token library, dark/light toggle or final branding now; keep the approved WIP black/white.
- `tsconfig.json` extends Astro strict. `check:types` runs `astro check` and a focused
  no-emit tooling TypeScript check for JSDoc scripts and Node configs outside Astro coverage.
- ESLint uses current recommended JS/TS/Astro presets and appropriate globals per file
  scope. Preserve the Astro parser; use the TS parser for embedded TypeScript as supported.
  Keep semantic type checking separate from fast linting. Current Astro lint plugin
  requirements include ESLint 10 and a sufficiently recent Node 24 patch; verify peers
  before locking. Prettier owns formatting; no duplicate formatting lint rules.
- Prettier `format` mutates only by explicit contributor command; `format:check` and all
  hooks/CI checks do not mutate. Never automatically stage unrelated edits.
- CSpell covers owned source, tests, scripts, configs, README, docs and feature specs,
  including the constitution. Exclude lockfiles, generated output and unchanged upstream
  Spec Kit templates/skills/scripts/manifests from formatting/spelling rewrites; document
  their vendor boundary. Add deliberate dictionary entries such as Astro, Cloudflare,
  Playwright, Vitest, Spec, Kit, antoniocamacho, mise and Lefthook after review, not blanket
  ignores masking real typos.
- Extend `.gitignore` for `dist/`, `.astro/`, `coverage/`, `playwright-report/`, `test-results/`,
  dependency directories, tool caches, `.wrangler/` if later needed, mise local overrides
  and `lefthook-local.yml`. Preserve `.specify/.gitignore` and its feature pointer exclusion.
  Keep `.env`/`.env.*` ignored with an explicit safe example exception for future need.
  Never commit tokens, private CV sources or personal data not approved for public release.

- Structured identity is a static JSON-LD graph with `WebSite` and `Person` nodes. Use stable
  IDs `https://antoniocamacho.dev/#website` and `https://antoniocamacho.dev/#person`; the website
  references its person author. Approved values only: website name `antoniocamacho.dev`, URL
  `https://antoniocamacho.dev/`, person name `Antonio Camacho Mira`, and Person `sameAs` pointing
  to `https://www.linkedin.com/in/antonio-camacho-mira/`. Share that profile value with the
  visible link. Do not add employment, address, telephone, credentials or profile scraping.
  JSON-LD remains non-executable metadata, separate from the approved local interaction module.
- The graph builder/serializer is real SEO behavior to unit-test: escape `<` in serialized
  JSON before embedding it so fork-provided text cannot terminate the metadata script.
  The built-document test must parse the result and check node relationships and exact
  approved values. No schema dependency or runtime API is needed. Keep metadata consistent
  with the WIP page's real purpose; do not label it a completed profile or promise rich results.
- The LinkedIn link uses a locally bundled, reviewed SVG with an accessible link name and
  visible keyboard focus. The SVG itself is decorative to assistive technology. Bundle no
  remote social widget, tracking script, third-party font or entire icon library. The icon's
  provenance/license and its detailed size/focus styling must be reviewed before use; minimal
  MIT application code does not imply ownership of LinkedIn's trademark. Add the link to the
  centered group without unrelated visible content. Leave target-tab behavior for explicit
  design review rather than inventing a new interaction requirement.

### Local command contract

These are planned npm scripts, not currently installed commands. Full details are in
[contracts/quality.md](contracts/quality.md) and [quickstart.md](quickstart.md).

| Script                    | Responsibility                                                   |
| ------------------------- | ---------------------------------------------------------------- |
| `check:runtime`           | Exact runtime check with remediation                             |
| `hooks:install`           | Explicit Lefthook installation                                   |
| `dev`                     | Astro development on loopback; no public binding by default      |
| `build`                   | Astro production static build to `dist/`; no implicit type check |
| `preview`                 | Astro preview of existing `dist/`, fixed loopback port           |
| `lint`                    | ESLint across owned JS/TS/Astro/config/tests/scripts             |
| `format` / `format:check` | Prettier write / non-mutating check                              |
| `spellcheck`              | CSpell owned human-readable files                                |
| `check:types`             | Astro check plus focused strict tooling check                    |
| `test` / `test:watch`     | Vitest run / watch                                               |
| `test:coverage`           | Vitest run with V8 coverage                                      |
| `test:e2e:install`        | Install pinned Playwright Chromium; accept `--with-deps`         |
| `test:e2e`                | Playwright against existing built output; auto-start preview     |
| `lint:branch`             | Project Node validator; optional explicit branch for CI          |
| `lint:commits`            | Commitlint explicit `--edit` or `--from`/`--to` contract         |
| `check:staged`            | Read staged names safely; dispatch non-mutating relevant checks  |
| `check:push-commits`      | Validate messages in all outgoing ref updates                    |
| `quality`                 | Runtime, branch, lint, format check, spelling, types, Vitest     |
| `quality:full`            | `quality`, production build, built-site E2E                      |

Coverage is explicit and future CI may substitute `test:coverage` for `test` to avoid duplicate
unit runs. Commit-range validation is contextual and separate from `quality`; it must not
pretend the last commit is the complete PR. Fail fast and propagate command exit codes.

### Intended Git hook behavior — approved gate placement

| Hook              | Requested design                                                           | Current governance status                          |
| ----------------- | -------------------------------------------------------------------------- | -------------------------------------------------- |
| pre-commit        | Runtime/branch validation; staged ESLint, Prettier check, practical CSpell | Compliant with constitution 2.0.0 and aligned spec |
| commit-msg        | Commitlint `--edit` with supplied message-file path                        | Compatible by itself                               |
| pre-push          | Branch, full Astro/tooling types, Vitest and all outgoing commit messages  | Compliant with constitution 2.0.0 and aligned spec |
| CI, later feature | Full independent validation plus coverage/build/Playwright                 | Required future boundary; not installed now        |

Branch script accepts exactly `main`, `develop`, or
`^(feat|fix|docs|test|ci|refactor|chore|perf|build)/[a-z0-9-]+$`. Do not silently impose a stricter
hyphen rule than the supplied regex. Use `git symbolic-ref` locally; CI passes the actual PR
head branch explicitly, never a synthetic merge ref. Missing/detached branch without an
explicit name fails clearly. Permanent exceptions allow validation, not direct-push permission.

Conventional preset supports at least feat/fix/docs/test/ci/refactor/chore/perf/build. Validate
all PR commits over the base/head range in CI; validate every outgoing update in pre-push,
including new branches and multiple refs, without requiring an upstream to exist. For new
branches, compute outgoing commits against advertised remote history; fail with remediation
if required history is absent, and test this with a disposable local remote. Handle deletions
explicitly without claiming a nonexistent candidate was validated.

`check-staged.mjs` uses NUL-delimited Git paths and process argument arrays, not shell-built
filename strings. Skip deleted/non-applicable files; do not skip genuine tool failures.
Reject overlapping staged/unstaged edits with a clear instruction to stage the complete file
or separate the change; this avoids validating working-tree bytes different from the index.
The owner explicitly approved this staged-file tradeoff during plan review. Root tooling/config changes invalidate narrow
file selection and trigger the corresponding full check. Hooks never auto-fix, auto-add,
change the branch or bypass checks. CI checks the complete revision independently.

### Testing architecture and test-first sequence

- Unit: cover the structured identity graph and script-safe serialization, including malformed
  input cases relevant to forks and profile-link consistency. Export/import the real branch predicate and runtime comparison without running the
  CLI on import. Test accepted types, permanent branches, invalid case/characters/slashes,
  missing values and actual supplied regex semantics. No tests solely asserting constant text.
- Integration: invoke real scripts in temporary repositories; test exit codes, missing Git/
  tools, filenames containing spaces, partial staging, changed configs, first push, multiple
  outgoing refs, valid/invalid Commitlint messages and failure propagation. Controlled failing
  dependencies are acceptable for gate-path tests, followed by a real-tool successful run.
- E2E: build once separately, let Playwright `webServer` start `npm run preview` at
  `http://127.0.0.1:4321`, strict port/no server reuse. Test HTTP success, exact two visible
  strings, semantic heading/main/paragraph, black/white, center positioning with a documented
  tolerance, no overflow, orientation and text enlargement. Also verify the profile href,
  accessible name, keyboard activation and focus; intercept external navigation so tests do
  not depend on LinkedIn availability. Parse built JSON-LD and validate both identity nodes,
  their relationship and the confirmed values. Enforce FR-012/SC-008 before profile activation
  by collecting unique decoded document/resource bodies in a fresh context, asserting total
  bytes <=102,400 and zero external resource requests; prove the checks reject oversized and
  external-resource fixtures. Attach the resource inventory and diagnostics on failure;
  tests must run against `dist/`, not the dev server or isolated components.
- Owner-approved initial browser matrix is D-04; expansion to Firefox/WebKit, navigation, links,
  metadata, forms and accessibility-sensitive behavior comes with relevant features.
- Vitest includes only unit/integration suites. V8 coverage targets actual owned executable
  logic; exclude generated/config boilerplate and E2E appropriately. Publish/report measured
  coverage; no arbitrary global percentage or fabricated utility to inflate it.
- First establish harness/configuration, document tool availability, then write failing tests
  for each actual behavior before implementation. A failed import/setup is not evidence that
  the requested behavior is missing. Bootstrap tests and later behavior slices must record
  meaningful red/green runs in `docs/testing.md` or linked review evidence, without committing
  generated reports. Run bootstrap checks manually until hooks are established, as allowed
  by Project Constraints; do not bypass a required gate.
- For US1 bootstrap, author the schema unit, identity integration and page E2E tests first.
  An inert graph interface and empty built page enable the unit/E2E red runs. The identity
  integration test is collected only after the approved public source exists; its red run
  must show missing graph behavior before graph implementation, not an unresolved import.
- Use isolated temporary repositories/remotes so hook acceptance tests cannot commit or push
  to this real repository. Use process timeouts and cleanup. Meaningful checks protect
  tooling behavior; no unit test is required merely to count the WIP literals twice.

### Future CI/CD boundary

[delivery-architecture.md](delivery-architecture.md) defines GitHub Actions orchestration,
fork-safe validation, Cloudflare static assets, four environments, staged candidate provenance,
artifact promotion and caching. This feature creates no `.github/workflows/`, Wrangler config,
Cloudflare resource, credential, domain binding, Quick Tunnel or branch ruleset. The owner
will configure each pipeline stage manually in the later feature, with purpose, expected
output and failure recovery explained before moving to the next step.

### Proposed implementation order after gate resolution

1. Review the resolved governance changes and approve technical/design proposals; then generate tasks.
2. Establish pinned runtime/package lock and test harness; write meaningful script tests first.
3. Implement project scripts and quality config against failing tests; verify real tool failures.
4. Write failing identity serialization and built-page acceptance tests, then add the minimal
   static layout/content/styles, accessible LinkedIn link and structured identity metadata.
5. Add hooks following the owner-approved C-01 resolution; prove gates using disposable repositories.
6. Complete README/contribution/tool docs, clean-clone walkthrough, full local acceptance
   including E2E, evidence review, and design comparison. Do not deploy this feature.

## Complexity Tracking

No unresolved constitutional violation is authorized. C-01 was resolved through explicit
owner-approved constitution and specification updates, not an exception. C-02 and C-03 are
handled by keeping delivery infrastructure future-only and making current limitations clear.
No server, database, flags or infrastructure complexity is justified by this feature.

Post-design check: constitution/specification gates pass. D-02, D-04 and D-06 are owner-approved; D-03 is owner-approved before component implementation. D-05 belongs to the future delivery feature.

### Implementation compatibility notes

Astro 7 auto-backgrounds preview when detecting an agent. The preview script uses its
foreground `--ignore-lock` option with Vite strict port configuration so Playwright owns
the server. Lefthook 2 hides unstaged changes even without automatic fixing. A small
`scripts/run-lefthook.mjs` entry point adds `--no-stage-fixed` to hook execution, preserving
the approved reject-overlap/non-mutating policy. `scripts/git-utils.mjs` shares shell-free
process execution and CLI error reporting. npm explicitly denies Lefthook dependency
postinstall because the documented project `prepare` installs hooks deterministically.
These compatibility corrections implement approved behavior and add no product scope.

### Approved visual revision

The owner approved trying an 80px heading (5rem), 24px paragraph (1.5rem) and
`#0A66C2` LinkedIn icon. Design Baseline v3 supersedes v2 for appearance; preserve the
24px icon, white text, spacing, focus outline, same-tab navigation and responsive behavior.
Update built-page assertions first and observe the old styles fail before applying this revision.

The owner subsequently replaced the fixed heading-size requirement with paragraph-relative
width. Use CSS Text Level 5 `text-fit: grow` in the approved Chromium matrix, with the
paragraph establishing an intrinsic-width group and an inline-size-contained full-width
heading. This preserves real semantic text without JavaScript for sizing. Non-supporting browsers
retain the larger readable 5rem fallback; exact fitting there is not claimed. Source:
[CSS Text Level 5](https://drafts.csswg.org/css-text-5/#text-fit-property). Browser support
is narrower than general CSS, so verify actual rendered text bounds, not element box widths.

### Closer heading/message spacing

The owner requested that the heading and explanatory message sit a little closer together.
Use 0.5rem between them, preserving 1rem before LinkedIn. Give those two boundaries
independent spacing rules and retain the width relationship, colors and safe centering.
Update the existing built-page geometry assertions before adjusting the CSS.

### Browser color preference

The owner requested automatic light/dark colors. Keep dark tokens as the fallback and
override background/foreground with `prefers-color-scheme: light`; declare matching
`color-scheme` for browser UI. The existing focus outline uses the foreground token,
so it stays visible in either mode. Preserve the blue profile accent. No toggle, saved
preference or JavaScript is needed. Test light → dark → light on the loaded page, including
text, background and focused-link colors at all approved viewports.

### Approved LinkedIn motion and activation

The owner approved six randomized blue particles, a 44px circular hit area, subtle icon sway
and 600ms rocket feedback before same-tab navigation. This is a concrete interactive need:
it supersedes the previous zero-client-JavaScript plan for this link only. Keep the static
Astro shell, local SVG, no framework/dependency and the existing 100KiB/no-external budget.

Implement pure particle/click predicates and a one-shot timed launch controller in
`src/lib/linkedin-motion.ts`; put DOM enhancement in `src/scripts/linkedin-link.ts`, imported
by the Astro component's bundled script. The controller exposes launch notification,
scheduling and navigation boundaries for meaningful unit/integration tests. The browser
entry retains native modified/middle clicks and fallback href, sets the visual launch state,
and reacts to reduced-motion preference changes. Do not store visitor data.

Use CSS transforms/opacity for six decorative particles gathering toward the center and a
low-opacity circular halo; keep all decoration pointer-inert. Bound each particle's random
radius to 36–64px and size to 6–10px, with a short stagger. The owner subsequently requested repeating motion: repeat the decorative invitation,
pausing it on keyboard focus and during launch; hover continues animating. Keep the anchor stationary;
only its decorative icon sways. Reduced motion removes particles and decorative animation.
The rocket occupies the same area and does not move surrounding content.

Tests first: unit checks for bounded randomness and native-click policy; integration checks
for real public destination/timer/single activation; built-site tests for dot count and
randomness, circle/target bounds, rocket-before-navigation, repeated/modified activation,
keyboard use, reduced-motion updates, no-JS fallback and both themes. Existing resource
inventory must include the new local script. An early inert implementation may expose these
interfaces solely to observe missing-behavior assertions before implementation.

Loop visibility refinement: retain the approved blue icon; use 0.28 halo opacity in dark
mode versus 0.14 in light, stronger dot opacity and a subtle blue dot glow on dark backgrounds.
Use CSS variables for those theme-dependent values and repeat only decorative animations.
The one-shot 600ms navigation controller remains unchanged.

Hover refinement: keep CSS loops running, raise halo opacity to 0.44 (dark) or 0.20 (light),
and intensify blue/glow. Use a brighter blue on dark (`#2992FA`) and retain the approved blue on light
(`#0A66C2`) to avoid a gray/navy cast; preserve the original blue at rest. Test both hover states.

Light-hover review: the owner disliked the muddy light-mode hover. Keep the original
LinkedIn blue and soften its halo to 0.20 opacity, preserving moving/intensified hover
and the stronger dark theme. Update the existing visual assertion before changing CSS.

### Nested pre-push test environment correction

A real pre-push exports `LEFTHOOK_BIN`, which overrides generated child hook runner commands.
Disposable test repositories must not inherit those Lefthook selectors or Git repository-local
variables. `tests/helpers/git.ts` copies the environment, removes Git local variables reported
by `git rev-parse --local-env-vars` and Lefthook control variables, and passes that copy to all
fixture Git/tool subprocesses. Preserve runtime PATH; never modify the real hook environment.
Regression tests inject the parent executable and a separate temporary parent Git context.
The existing gate policy and application behavior remain unchanged.
