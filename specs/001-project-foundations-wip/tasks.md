---
description: "Dependency-ordered implementation tasks for project foundations and the WIP page"
---

# Tasks: Project Foundations and WIP Page

**Input**: Design documents from `specs/001-project-foundations-wip/`.

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md),
[data-model.md](data-model.md), [page contract](contracts/page.md),
[quality contract](contracts/quality.md), [quickstart.md](quickstart.md).
Constitution v2.0.0 is authoritative.

**Tests**: Required by FR-006 and Constitution II. Write behavior tests before corresponding
implementation; capture meaningful red and green runs. Missing imports, missing browsers,
missing dependencies and invalid setup alone are not acceptable red evidence. Minimal inert
interfaces or an empty built document may be added only to make the written assertions run;
implement the requested behavior after observing those assertions fail.

**Organization**: Three story increments in specification priority order. Execution progress is recorded in the task checkboxes. The plan has an explicit visual
approval gate; T001 resolved it before dependent work. The command to generate tasks is not approval of
unanswered design choices or permission to deploy.

## Format: `[ID] [P?] [Story] Description`

- Every task has an unchecked checkbox, sequential ID and explicit file paths.
- `[P]` means file-disjoint work within the named parallel batch, after its prerequisites.
- `[US1]`, `[US2]`, `[US3]` correspond to the specification's three user stories.
- Setup/foundational/final tasks have no story label. Dependencies below take precedence
  over any proposed concurrency. Documentation and evidence updates are sequential.

## Path Conventions

One npm package at repository root. Application: `src/`; tooling: `scripts/`;
unit/integration/E2E: `tests/`; contributor documentation: `README.md`, `CONTRIBUTING.md`,
`docs/`. Planning documents stay under `specs/001-project-foundations-wip/`.
Use disposable directories/local remotes for Git-operation tests, never this real repository.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the human decisions and establish only the declared runtime and test
harness. No portfolio content, server adapter, provider setup, workflows or deployment.

- [X] T001 Record explicit owner review of the plan and unresolved D-03 in specs/001-project-foundations-wip/plan.md and specs/001-project-foundations-wip/contracts/page.md: confirm or replace proposed system sans-serif, 4rem bold heading, 1.125rem regular paragraph, 1rem gap and 1.5rem minimum padding; obtain the LinkedIn icon size, focus treatment and target-tab decision without inferring answers. Retain Design Baseline v2 and the approved runtime/test/staged-file decisions; stop dependent work until confirmed.
- [X] T002 Pin approved Node 24.22.0 in mise.toml and initialize package.json, package-lock.json and .npmrc with npm, private package/MIT metadata, exact compatible direct dependencies from plan.md, Node 24 engine constraints and documented script names; verify peers, keep Vitest/V8 versions matched and record bundled npm. Do not activate preinstall/prepare hooks before their implementations exist.
- [X] T003 [P] Extend .gitignore only for introduced generated output and local overrides: node_modules/, dist/, .astro/, coverage/, playwright-report/, test-results/, caches, mise local config and lefthook-local.yml; retain environment-file safety and .specify/.gitignore behavior without ignoring committed locks or public source.
- [X] T004 [P] Configure vitest.config.ts for Node unit/integration suites with matching V8 coverage, meaningful owned-code inclusion and exclusion of tests/e2e/ and generated artifacts; use the test, test:watch and test:coverage commands predeclared by T002 without editing package.json in this parallel task, fabricated tests or pass-with-no-tests success.
- [X] T005 [P] Configure playwright.config.ts to test existing dist/ through an automatically started npm run preview at http://127.0.0.1:4321, strict port and no server reuse; use approved Chromium/viewports, explicit browser installation and failure diagnostics, keeping build separate from test:e2e.

**Checkpoint**: Runtime/dependencies and test harness are usable; no nonexistent check is
reported as passing. T003–T005 may run concurrently after T002.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared static configuration and meaningful tooling checks before story
implementation. Setup/configuration is not a substitute for feature behavior or its tests.

- [X] T006 Write runtime predicate tests in tests/unit/runtime.test.ts and real CLI setup/error tests in tests/integration/setup.test.ts before implementing scripts/check-runtime.mjs; cover approved exact runtime, mismatched runtime metadata, missing config and actionable nonzero failures using temporary project fixtures, then observe meaningful assertion failures through inert interfaces.
- [X] T007 Implement documented import-safe runtime validation in scripts/check-runtime.mjs and wire check:runtime/preinstall in package.json; consume the project runtime authority without machine paths, report remediation and make T006 pass before recording any successful bootstrap validation.
- [X] T008 Write configuration validation scenarios in tests/integration/configuration.test.ts before configuring the gates: exercise seeded JS/TS/Astro lint violations, formatting defects, misspelled owned prose, invalid static types and ignored generated content in isolated fixtures; distinguish meaningful tool rejection from unavailable-tool/setup errors.
- [X] T009 Configure eslint.config.mjs and the lint script in package.json using compatible modern flat JS, TypeScript and Astro presets, scoped Node/browser globals and eslint-config-prettier; preserve the Astro parser and cover owned source, tests, scripts and configs, making the ESLint scenarios from T008 pass.
- [X] T010 Configure prettier.config.mjs, .prettierignore and separate format/format:check scripts in package.json with prettier-plugin-astro; verify T008 catches invalid formatting while the check leaves bytes unchanged and unchanged upstream Spec Kit artifacts are not rewritten.
- [X] T011 Configure cspell.config.json, cspell-project-words.txt and spellcheck in package.json for owned source/docs/specs/constitution and human-readable config; review legitimate Astro, Cloudflare, Playwright, Vitest, Spec Kit, antoniocamacho, mise and Lefthook entries, exclude generated/vendor output and make T008 reject a seeded real typo.
- [X] T012 Configure static output and Tailwind 4 through @tailwindcss/vite in astro.config.mjs, extend Astro strict in tsconfig.json, add focused no-emit JSDoc tooling validation in tsconfig.tooling.json and wire independent check:types, dev, build and preview scripts in package.json; add no SSR adapter, SPA framework or legacy Tailwind integration.
- [X] T013 Execute T006/T008 fixtures and shared checks, verify source/script/static-type coverage and non-mutating behavior, and create docs/testing.md with actual bootstrap red/green evidence, command versions and meaningful-failure explanations; keep generated reports ignored and do not claim absent application/browser tests pass.

**Checkpoint**: Shared gates and test harness are ready. Run any build/type fixture that needs
source in a disposable fixture, not by inventing final application content. Expensive built
application checks must not be part of the default Vitest suite later invoked by pre-push;
T008's type/lint fixtures may invoke their respective tools but must not build the site.

---

## Phase 3: User Story 1 — Understand the Site Is Being Built (Priority: P1) — MVP

**Goal**: Serve the approved centered WIP page with the accessible LinkedIn link and minimal
confirmed website/owner structured identity.

**Independent Test**: Build once, run Playwright against preview, and verify exact text,
black/white layout, group centering/readability, LinkedIn keyboard/focus behavior and parsed
identity data. Run meaningful schema unit/integration tests separately through Vitest.

### Tests for User Story 1 — write before behavior

- [X] T014 [P] [US1] Write tests/unit/structured-data.test.ts for the real WebSite/Person graph and script-safe serialization, including IDs, author relationship, shared LinkedIn identity and fork-provided text containing script terminators; require parseable output and no injected executable markup, not merely constant-equality tests.
- [X] T015 [P] [US1] Write tests/e2e/wip.spec.ts for HTTP success, exact WIP/paragraph text, black/white appearance, the complete centered content group, approved viewports/200% text enlargement/4 CSS-pixel tolerance, readable overflow, accessible LinkedIn name/focus/keyboard activation and built structured identity. Add FR-012/SC-008 cold-cache checks for at most 102,400 uncompressed bytes across unique initial document/resource bodies and zero external requests before interaction; record URLs/sizes/totals, count embedded content only within its container, and prove oversized/external-resource fixtures are rejected. Intercept profile activation instead of contacting LinkedIn.
- [X] T016 [P] [US1] Write tests/integration/identity.test.ts to pass the real replaceable src/content/site.ts data through the graph builder/serializer and parse it back, proving author linkage, shared profile destination and script-safe handling of changed fork content without requiring a production build inside Vitest.

### Implementation for User Story 1

- [X] T017 [US1] Add only inert callable interfaces in src/lib/structured-data.ts and an empty buildable document shell in src/pages/index.astro; run only tests/unit/structured-data.test.ts from T014 and build/preview for tests/e2e/wip.spec.ts from T015, recording real missing-graph/text/link/metadata assertion failures. Do not run T016's identity integration test yet: its src/content/site.ts input is created by T018. Missing imports or absent dist/ are not TDD evidence.
- [X] T018 [US1] Create replaceable public sources src/content/wip.ts and src/content/site.ts with the constraints “Exact case; displayed as the single main heading” for WIP and “Exact punctuation; below heading” for We are working on it.; use exactly siteName antoniocamacho.dev, siteUrl https://antoniocamacho.dev/, ownerName Antonio Camacho Mira and linkedInUrl https://www.linkedin.com/in/antonio-camacho-mira/. Now run tests/integration/identity.test.ts from T016 against that real input and T017's inert graph interface; record meaningful missing-graph behavior before T019, not an import/setup failure.
- [X] T019 [US1] Implement the typed graph builder and safe serializer in src/lib/structured-data.ts with WebSite/Person IDs https://antoniocamacho.dev/#website and https://antoniocamacho.dev/#person, author reference and Person sameAs; escape less-than characters before embedding JSON, share approved identity inputs and make T014/T016 pass without additional personal fields or schema dependencies.
- [X] T020 [US1] Obtain and review the planned local LinkedIn SVG for src/assets/linkedin.svg, recording source, license/trademark conditions and attribution if required in docs/development.md; do not invent provenance or imply the MIT application license grants trademark rights, and resolve any incompatible asset choice with the owner before use.
- [X] T021 [P] [US1] Implement src/components/LinkedInLink.astro using the reviewed local decorative SVG and the shared confirmed profile destination; provide an accessible link name, keyboard activation and owner-approved size/focus/target behavior, with no remote widget, tracking or icon-library dependency.
- [X] T022 [P] [US1] Implement src/layouts/BaseLayout.astro with semantic document language, title/viewport metadata, global style import and script-safe non-executable JSON-LD from the real helper; preserve zero application client-side JavaScript and no unapproved public facts.
- [X] T023 [US1] Compose src/pages/index.astro from the layout, exact public WIP strings and LinkedInLink component, placing the icon below We are working on it. and keeping all three elements in one centered group with no unrelated visible content.
- [X] T024 [US1] Implement src/styles/global.css with the Tailwind 4 import, minimal semantic CSS variables and only the owner-approved WIP typography/spacing/focus values; preserve black background/white text, responsive safe centering, wrapping, vertical reachability and zero horizontal overflow without defining the final Penpot design system.
- [X] T025 [US1] Run Vitest identity tests and build once followed by built-site E2E, review Design Baseline v2, exact approved metadata values and FR-012/SC-008 resource-budget evidence including negative-fixture rejection, and record real green runs plus earlier red evidence in docs/testing.md; fix feature defects rather than weakening assertions or requiring LinkedIn availability.

**Checkpoint**: US1 is a local demonstrable MVP. It is not a deployed website or permission to
merge without the independently required future CI gates. T021/T022 are parallel only after
T017–T020 and the authored tests; they do not modify shared evidence concurrently.

---

## Phase 4: User Story 2 — Start and Understand Local Development (Priority: P2)

**Goal**: Make a fresh clone understandable and reproducible using documented prerequisites
and project npm scripts, with public content clearly replaceable for forks.

**Independent Test**: Follow only the README from a clean local checkout using the approved
runtime, view the WIP page, build it and execute documented checks. Reuse the runtime/setup
integration tests authored before their implementation; do not fabricate tests of prose.

### Validation and documentation for User Story 2

- [X] T026 [US2] Run tests/unit/runtime.test.ts and tests/integration/setup.test.ts and start a clean-checkout walkthrough based on specs/001-project-foundations-wip/quickstart.md; record documentation/setup gaps in docs/testing.md before correcting documentation, without claiming a second runtime or unavailable platform was validated.
- [X] T027 [US2] Expand README.md with Git/mise prerequisites, the approved Linux/macOS/WSL2 support boundary, mise trust/install/exec instructions, exact runtime/bundled npm, npm ci, hook installation and all planned dev/lint/format/check/spelling/types/test/watch/coverage/E2E/build commands; keep Cloudflare credentials unnecessary.
- [X] T028 [US2] Write CONTRIBUTING.md for the feature-branch and Conventional Commits workflow, permanent branch exceptions, red/green evidence, staged-file policy, human-approved assumptions/design and Spec Kit lifecycle; explain local versus future authoritative CI enforcement without implementing pipelines.
- [X] T029 [US2] Complete docs/development.md with configuration/dependency rationale, strict static architecture, shell/editor hook PATH troubleshooting, browser OS prerequisites, public content/identity replacement, generated-file exclusions and a pointer to future delivery-architecture.md; retain SVG provenance and avoid private material or unnecessary environment examples.
- [X] T030 [US2] Repeat the documented clean local setup and application build from README.md, verify every currently available documented command and record the walkthrough in docs/testing.md; explicitly leave hook/aggregate acceptance for US3 instead of reporting unimplemented commands as passed.

**Checkpoint**: The WIP app and its local configuration are reproducible from the published
instructions. Documentation-only tasks use document checks and walkthrough evidence, not
artificial executable behavior. Final full-command validation follows US3 wiring.

---

## Phase 5: User Story 3 — Validate Changes Before Committing or Pushing (Priority: P2)

**Goal**: Provide fast staged pre-commit checks, commit-msg validation and appropriate pre-push
checks, plus a documented full locally runnable quality suite. No GitHub workflow is installed.

**Independent Test**: In disposable repositories/local remotes, prove each mandatory applicable
check blocks its operation when it fails and permits it when passing; prove first/multi-ref
pushes and all outgoing message ranges are validated. Run the full suite separately.

### Tests for User Story 3 — write before behavior

- [X] T031 [P] [US3] Write tests/unit/branch-name.test.ts for scripts/check-branch.mjs using exactly ^(feat|fix|docs|test|ci|refactor|chore|perf|build)/[a-z0-9-]+$ plus main/develop; cover all allowed types, invalid case/characters/slashes, empty/detached names, explicit CI input and allowed regex hyphen edge cases without silently tightening the rule.
- [X] T032 [P] [US3] Write tests/integration/tooling.test.ts for safe staged-file dispatch in scripts/check-staged.mjs: spaces/unusual filenames, NUL-delimited paths, deleted/no-applicable files, overlapping staged/unstaged edits, config-triggered full checks, tool failures and unchanged index/worktree bytes; use temporary fixture tools and a real successful-tool case.
- [X] T033 [P] [US3] Write tests/integration/push-commits.test.ts for scripts/check-push-commits.mjs and Commitlint range invocation, covering first push without upstream, multiple ref updates, invalid earlier outgoing commits, missing advertised history, deletions and nonzero propagation through disposable local remotes.
- [X] T034 [P] [US3] Write tests/integration/hooks.test.ts for actual Lefthook stages, valid/invalid Conventional Commits and aggregate command order/failure propagation; run fixture packages whose child Vitest commands target a non-recursive scoped suite so pre-push tests cannot recursively run themselves or modify this real repository, then observe meaningful missing-gate failures before implementation.

### Implementation for User Story 3

- [X] T035 [US3] Implement import-safe predicate/CLI behavior in scripts/check-branch.mjs and lint:branch in package.json to satisfy T031: resolve a symbolic branch locally, accept --branch for CI, reject missing input and apply exactly the supplied regex/main/develop exceptions; branch-name exceptions do not permit direct permanent-branch pushes.
- [X] T036 [US3] Configure commitlint.config.mjs and lint:commits in package.json with @commitlint/config-conventional supporting at least feat/fix/docs/test/ci/refactor/chore/perf/build, quoted --edit paths and explicit --from/--to ranges; make the message/range cases pass without last-commit-only shortcuts.
- [X] T037 [US3] Implement scripts/check-staged.mjs and check:staged in package.json with NUL-delimited Git reads and argument-array subprocesses, non-mutating applicable ESLint/Prettier/CSpell checks, owner-approved partial-staging rejection and affected full checks after config changes; make T032 pass with actionable errors rather than auto-staging or swallowing tool failures.
- [X] T038 [US3] Implement scripts/check-push-commits.mjs and check:push-commits in package.json to consume every pre-push ref update and validate every outgoing message with Commitlint, including first/multi-ref pushes; fail clearly on unavailable history and explicitly handle deletions, making T033 pass without requiring a configured upstream.
- [X] T039 [US3] Wire quality and quality:full in package.json according to contracts/quality.md: non-E2E shared checks for quality, then production build and existing-artifact E2E for quality:full, propagating failures and documenting contextual commit-range validation separately; prove command sequencing through T034 without duplicate builds inside Playwright.
- [X] T040 [US3] Configure lefthook.yml for runtime/branch plus fast staged pre-commit checks, Commitlint commit-msg and branch/types/Vitest/outgoing-message pre-push; wire hooks:install and prepare in package.json with explicit documented non-Git/CI handling, and do not add build or browser E2E to commit/push stages.
- [X] T041 [US3] Run the controlled local commit acceptance cases in tests/integration/hooks.test.ts, proving branch/lint/format/spelling and commit-msg failures block commits while passing staged content succeeds; verify tool absence and partial staging fail clearly and hooks never mutate unrelated edits.
- [X] T042 [US3] Run the local-remote push acceptance cases in tests/integration/push-commits.test.ts and tests/integration/hooks.test.ts, proving types/unit/integration/outgoing-message failures block pushes, passing candidates succeed and no hook starts a build or browser suite; keep all fixture commits and pushes isolated.
- [X] T043 [US3] Update CONTRIBUTING.md and docs/development.md with the actual stage matrix, hook installation/PATH remediation, branch and range CLI examples, partial-staging remediation and optional full-suite reproduction command; explicitly state that hooks are bypassable and protected merge enforcement awaits future CI.
- [X] T044 [US3] Extend tests/integration/hooks.test.ts command-trace checks and docs/testing.md evidence so quality:full demonstrably runs the complete local code/build/E2E sequence while quality excludes build/E2E; show that an earlier failed command prevents later commands without hiding contextual commit-range prerequisites.
- [X] T045 [US3] Run actual lint, non-mutating format check, CSpell, Astro/tooling types, Vitest and V8 coverage through package.json scripts; review the project dictionary and owned-file scope, fixing real defects and preserving unchanged upstream Spec Kit artifacts rather than broadening ignores to mask failures.
- [X] T046 [US3] Record applicable failing/passing hook cases, outgoing commit coverage, missing-tool handling, current command versions and the final local gate matrix in docs/testing.md; confirm no test uses real repository writes, no default Vitest task builds the site and no remote CI/deployment claim is made.

**Checkpoint**: Stage-appropriate local enforcement and independently runnable commands are
proved. Full CI remains a separately guided feature and still governs protected-branch merge
eligibility under Constitution VI.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the completed feature, its public/fork boundaries and documentation;
record evidence without adding unrelated services, site features or delivery configuration.

- [X] T047 Repeat the complete README.md fresh-clone walkthrough after US3, including npm ci, prepare/hooks:install, dev, all non-mutating checks, watch/coverage smoke, browser prerequisites and production preview; record actual results and any platform limitations in docs/testing.md with zero undocumented setup.
- [X] T048 Review .gitignore, package-lock.json, LICENSE, src/content/site.ts and src/assets/linkedin.svg for reproducibility/public reuse: preserve MIT, required attribution and replaceable public identity; exclude secrets, private CV material, local environment/tool state, generated reports and dependency directories without inventing .env.example values.
- [X] T049 Validate built identity data and page acceptance via tests/unit/structured-data.test.ts, tests/integration/identity.test.ts and tests/e2e/wip.spec.ts, confirming exact approved names/URLs, zero syntax errors, author relationship, script-safe metadata, accessible LinkedIn behavior and no live profile dependency; record schema review in docs/testing.md without claiming a ranking improvement.
- [X] T050 Reconcile README.md, CONTRIBUTING.md, docs/development.md and docs/testing.md with implemented commands and the approved plan/page contract, documenting every introduced module/configuration purpose and the later CI/Cloudflare boundary; remove obsolete instructions without changing constitutional rules or the approved scope.
- [X] T051 Run the final npm run quality:full once after all changes, plus explicit lint:commits for the actual candidate range, and review V8 coverage/evidence in docs/testing.md; require passing build/built-site E2E without arbitrary coverage inflation, generated-report commits or repeated builds justified only by job duplication.
- [X] T052 Audit all FR-001–FR-012 and SC-001–SC-008 against the completed story evidence in docs/testing.md and specs/001-project-foundations-wip/tasks.md; keep incomplete tasks unchecked, review final Git scope and hand off for Spec Kit convergence without automatically committing, pushing, merging, deploying, creating Jira issues or installing future pipelines.

---

## Dependencies & Execution Order

### Phase Dependencies

1. T001 human gate → T002 runtime/dependencies → T003/T004/T005 shared setup.
2. Phase 2 requires all setup. T006 → T007. T008 precedes T009/T010/T011/T012;
   T009–T012 are sequential because they edit package.json. T013 verifies the shared baseline.
3. All story work requires T013 and the approved design decisions. Tests are authored before
   corresponding behavior; no `[P]` marker waives the red-before-implementation rule.
4. US1 → US2's real-page walkthrough; US3's isolated test authoring may overlap US1/US2,
   but shared package.json and docs edits stay sequential. US3 completion requires the built
   US1 app for real checks and aggregate verification. Polish requires all stories.

### User Story Dependencies

```text
Setup + Foundational
  ├── US1 tests → inert harness → public data → schema/link/layout/style → local WIP MVP
  │                                                         └── US2 walkthrough + docs
  └── US3 isolated tests → validators/commit rules/staged checks → hooks + aggregate wiring
                                                           └── real checks after US1
US1 + US2 + US3 → final clean-clone/full-suite/evidence review
```

US1 has no dependency on hook implementation. US2 uses existing runtime tests and the US1 app
rather than introducing fake documentation tests. US3 gate tests can operate in isolation;
its final acceptance uses the real project checks. These are explicit shared-foundation
requirements, not an assertion that a documentation walkthrough can run before a page exists.

The US1 red-run order is explicit: author T014–T016 first; T017 enables and runs T014/T015
against inert graph/page interfaces; T018 supplies the real identity input and enables T016's
meaningful failing run; T019 implements graph behavior only after both graph suites have
failed for missing behavior. Never collect T016 before its input exists merely to claim red.

### Within Each User Story

- Author tests first; add only inert interfaces if needed to observe actual assertion failure.
- Observe failure before implementing the corresponding behavior; preserve red/green evidence.
- Keep all commits coherent parts of this feature, passing applicable stage checks.
- Serialize any package.json, shared config or documentation edits; never assume `[P]` tasks
  can mutate common files concurrently.
- No actual local operation is allowed to bypass required checks; fixture tests isolate
  intentional failures. Bootstrap manual validation follows the constitution's explicit rule.

### Parallel Opportunities

- After T002: T003, T004 and T005 modify separate ignore/test-runner config files.
- After T013: T014, T015 and T016 author separate US1 test files.
- After T017–T020: T021 and T022 modify separate component/layout files.
- After foundational setup: T031, T032, T033 and T034 author separate US3 test files.
- US2 prose drafting can overlap US3 test authoring only when docs/testing.md and shared docs
  remain owned sequentially. No automated agent delegation is initiated by this task list.

---

## Parallel Example: User Story 1

```text
T014: tests/unit/structured-data.test.ts
T015: tests/e2e/wip.spec.ts
T016: tests/integration/identity.test.ts
# After their prerequisites and asset review:
T021: src/components/LinkedInLink.astro
T022: src/layouts/BaseLayout.astro
```

## Parallel Example: User Story 2

```text
T027: README.md can be drafted while T028: CONTRIBUTING.md is drafted,
but only after T026; these tasks are not globally marked [P] because each relies on the
currently verified script/state information and final prose integration must be reviewed.
T029 and the evidence updates remain sequential to preserve docs/development.md provenance.
```

## Parallel Example: User Story 3

```text
T031: tests/unit/branch-name.test.ts
T032: tests/integration/tooling.test.ts
T033: tests/integration/push-commits.test.ts
T034: tests/integration/hooks.test.ts
# Actual script/package/hook wiring follows sequentially after the relevant red runs.
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Resolve T001 and complete shared runtime/tooling prerequisites.
2. Author US1 tests, observe real red behavior and implement the minimal static page.
3. Complete T025 and demonstrate the WIP page, LinkedIn link and structured identity locally.
4. Stop at the local MVP checkpoint if reviewing the increment. Do not deploy it or equate
   local checks with the independent CI needed for protected-branch merges.

### Incremental Delivery

1. Setup/foundation → shared scripts/config/harness, verified without fabricated app behavior.
2. US1 → locally demonstrable visitor outcome, exact content/design/identity acceptance.
3. US2 → reproducible contributor documentation and clean local walkthrough.
4. US3 → fast stage-appropriate hooks, message/branch validation and full local reproduction.
5. Polish → actual full-suite and public/fork safety evidence. Future hosting and owner-built
   CI/CD have their own specification; no deployment code is hidden in foundation tasks.

### Parallel Team Strategy

Use the batches above only if parallel contributors are explicitly assigned. Respect file
ownership and dependencies, particularly package.json, shared docs and evidence. This task
generation command does not launch parallel agents or execute implementation.

## Notes

- All tasks are initially unchecked; an executable next action may be human approval T001.
- A task is complete only when its requested behavior and evidence exist; a missing tool or
  unresolved design choice is not success. Tests must protect real behavior, not coverage counts.
- Follow tasks → analyze → implement → converge. Suggested immediate follow-up:
  `$speckit-analyze`; resolve its findings and T001 before dependent implementation.
- No commit, push, merge or deployment is performed by this task-generation step.

## Owner-requested visual revision

- [X] T053 Update the approved reference to Design Baseline v3, observe built-page assertions fail for the old 64px/18px/white appearance, then apply the owner-refined heading fitted to the message width, 24px message and #0A66C2 LinkedIn icon. Validate the built page at all approved viewports and 200% text enlargement, review screenshots, and record results in docs/testing.md.

- [X] T054 Bring the heading and message closer in Design Baseline v3, use separate 0.5rem and 1rem spacing boundaries, observe the old spacing fail the existing E2E geometry assertions, then implement and validate the responsive result.

- [X] T055 Follow the browser light/dark preference with inverted background/text and matching visible focus, preserve the blue LinkedIn icon, observe the light-mode browser test fail before CSS changes, then verify live switching and existing responsive acceptance.

- [X] T056 Implement the explicitly approved interactive LinkedIn link: write and observe meaningful unit/integration/E2E failures, add six randomized gathering dots and stationary 44px hit area with repeating decorative sway, stronger dark visibility and uninterrupted intensified hover in both themes, show a rocket for 600ms before a single native-destination navigation, preserve modified/no-JS/keyboard behavior and reduced motion, validate both themes and the resource budget, and document the small client module.

- [X] T057 Refine the disliked light-mode hover: retain the approved blue with a softer halo, observe the old navy color fail the existing visual assertion, then validate both themes and record screenshot review.

- [X] T058 Fix inherited pre-push environment contamination in temporary Git/hook fixtures; reproduce the partial-staging acceptance failure, add environment/foreign-repository regression cases, isolate all fixture subprocesses, and validate the real hook path without pushing to a remote.

- [X] T059 Enforce the approved exact runtime at the start of pre-push, reproduce a runtime-mismatched local push incorrectly passing before the guard, retain real hook output in clean-commit assertions, verify matching and mismatched runtime paths, and document mise recovery without changing the runtime pin or pushing to the real remote.
