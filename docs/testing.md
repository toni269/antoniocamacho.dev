# Testing and implementation evidence

The feature uses Node 24.22.0, npm 11.19.1, Vitest 5.0.5 and Playwright 1.64.1.
Generated reports remain ignored; the following is a reviewable record of observed behavior.

## Shared foundation (T006–T013)

- Before runtime implementation, the exact-version assertion failed (`false` instead of
  `true`) and the CLI mismatch assertion failed (invalid runtime returned success). These
  were behavior failures through inert interfaces, not missing-module evidence.
- After implementation, `npm test -- tests/unit/runtime.test.ts
tests/integration/setup.test.ts` passed both tests. Integration subprocesses require normal
  process-execution permissions; an intermediate sandbox EPERM was diagnosed separately
  and is not counted as TDD evidence.
- Before lint configuration, installed ESLint with an inert rules baseline accepted
  `missingName()`. `tests/integration/configuration.test.ts -t "lint rejects"` failed because
  it expected rejection and observed success.
- After configuration, the runtime/setup/configuration suite passed 6 tests. Isolated
  fixtures prove valid input succeeds, undefined names and generated exclusions behave
  correctly, formatting checks preserve file bytes, spelling rejects seeded mistakes,
  and strict tooling types reject an incompatible assignment.
- `npm run check:types` passed with 0 diagnostics. Before page implementation Astro correctly
  reported that no pages directory existed; this was not called an application build/test pass.

## Test boundaries

Vitest covers unit/integration behavior without building the site or launching browsers.
Playwright runs separately against `dist/` served by Astro preview. Later hook tests use
fixture repositories/local remotes and scoped child commands to avoid recursion.

## WIP page (T014–T025)

Before implementing the graph, unit and real-identity integration assertions failed through
inert functions with “not implemented”. Before page implementation, the built empty document
returned HTTP 200 but the browser assertion failed because the WIP heading was absent.
Astro's agent auto-background preview behavior was diagnosed independently; `--ignore-lock`
keeps the Playwright-owned preview in the foreground, with strict port configuration.
After implementation, all four identity unit/integration tests and all nine Chromium E2E
cases passed. The three approved viewports include 200% text, keyboard focus/activation,
centering, zero external resources, and negative oversized/external resource fixtures.
The mobile screenshot was visually reviewed against approved black/white Design Baseline v2.
Metadata is JSON-parsed and checked against the narrow approved Schema.org graph contract:
WebSite has a Person author, matching IDs, HTTPS URLs and the shared sameAs destination.
This is contract/schema-shape validation, not a claim of improved search ranking.

## Documentation walkthrough (T026–T030)

The initial README contained only a description, so runtime, dependency, browser, command and
hook prerequisites were missing. The new README and guides supply that entry path. Runtime
and setup integration scenarios already cover valid/invalid/missing pins; final clean-checkout
and hook validation will be recorded after US3 so unimplemented commands are not claimed.

## Git gates (T031–T046)

Before implementation, the inert branch predicate rejected valid names, partial staging and
invalid outgoing messages incorrectly succeeded, and real pre-commit accepted a lint defect.
These are recorded assertion failures, not missing-module failures. Fixtures then passed
with the implemented scripts. A later real-hook test exposed Lefthook hiding unstaged edits:
the partial-staging rejection assertion failed. The project runner disables that default
mechanism with `--no-stage-fixed`; all three real hook acceptance scenarios then passed.

Temporary repositories exercise invalid branch, lint, formatting, spelling, partial staging,
missing tools and invalid commit messages. Local bare remotes exercise failed static/types,
failed scoped tests, valid push, first push without upstream, multiple updates, deletion,
unavailable advertised history and an invalid earlier message followed by a valid final one.
Child Vitest uses one scoped fixture test, never recursively this integration suite.
All fixture writes/commits/pushes stay in disposable repositories; no real remote is contacted.
Command traces prove `quality` excludes builds/browsers, `quality:full` runs ordered checks
then one build and E2E, and a lint failure prevents all subsequent commands.

The dictionary contains reviewed technical words; intentional spelling defects use local
CSpell annotations rather than globally allowing misspellings. Root checks preserve upstream
Spec Kit templates and the reviewer-owned checklist. Hook installation is local feedback;
independent CI and branch protection are still required in the future pipeline feature.

## Clean-clone walkthrough and coverage (T030, T045–T050)

A disposable snapshot of the uncommitted candidate was committed only in a temporary fixture,
then cloned into a new directory with no dependencies or artifacts. The documented `mise
trust`, `mise install`, version checks, `npm ci`, runtime/hook installation, browser installation
and `quality:full` succeeded. npm installed 558 packages from the lockfile with zero reported
vulnerabilities. Development returned HTTP 200 with both expected strings and was stopped;
Playwright then owned a separate production-preview process. The clone's complete suite passed
22 unit/integration tests and 9 E2E cases. This proves Linux here; macOS/WSL2 were not executed.
The environment's mise installation/cache was isolated outside the repo; no such paths are
required by contributor instructions or committed configuration.

The watch smoke exposed Vitest's automatic one-shot behavior in an agent environment. The
script now explicitly uses `--watch`; the runtime test passed, reached “Waiting for file
changes”, and exited normally with q. `npm run test:coverage` passed all 22 tests and wrote
ignored V8 reports. Structured-data code reports 100% line/branch/function coverage. Overall
line coverage is 9% because subprocess CLI executions are not included in Vitest's parent
instrumentation; their behavior is covered by the integration/real-hook assertions above.
No coverage threshold or subprocess coverage claim is fabricated.

All three clean-clone viewport inventories matched:

| Initial resource                      | Uncompressed bytes |
| ------------------------------------- | -----------------: |
| `/` (includes inline SVG and JSON-LD) |              1,579 |
| `/_astro/index.MiHxnY21.css`          |              6,755 |
| Total                                 |              8,334 |

External requests before interaction: **0**. The emitted standalone SVG is not fetched and
is not counted again. Resource attachments are retained in the ignored Playwright JSON report;
controlled oversized/external fixtures are rejected. There are no application client scripts.

The real checkout's hooks were installed without a real commit/push. Existing candidate range
`84b426e..HEAD` passed Commitlint (currently the constitution amendment commit; new feature
changes remain uncommitted). MIT and the upstream SVG attribution are preserved. Git ignore
rules exclude local environment/tool data, private/generated artifacts and reports. No secrets,
private CV content, hosting configuration or workflow files were introduced.

## Acceptance traceability

| Requirements/outcomes      | Evidence                                                                                     |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| FR-001–003, SC-001–002     | Built-page E2E text/layout/viewport/enlargement checks and screenshot review                 |
| FR-004–005, FR-009, SC-003 | README clean-clone install/dev/build/full-suite walkthrough; runtime/setup tests             |
| FR-006, SC-004             | Recorded red/green graph, page, runtime, tooling and hook assertions                         |
| FR-007–008, SC-005         | Staged/range/real-hook integration tests, aggregate ordering and explicit future CI boundary |
| FR-010, SC-006             | Accessible native profile anchor, focus and intercepted keyboard navigation at all viewports |
| FR-011, SC-007             | Structured-data unit/integration/built JSON syntax and Schema.org graph-contract validation  |
| FR-012, SC-008             | Cold-context resource inventories, byte/external limits and rejected negative fixtures       |

Final workspace validation: `npm run quality:full` passed runtime, branch, ESLint,
non-mutating formatting, spelling (53 files), Astro/tooling types (zero diagnostics),
22 unit/integration tests, one static production build and 9 Chromium E2E cases.
The final resource inventories matched the 8,334-byte/zero-external-request table above.
The clean clone also passed coverage and explicit watch-mode smoke after its full suite.
All 52 implementation tasks are complete. No extension hooks are registered.
Commit-to-spec traceability follows `feat/project-foundations-wip`, this specification
and the task/evidence record. No merge or deployment is performed.

## Owner visual revision (T053, Design Baseline v3)

The owner approved larger text and a blue LinkedIn icon, then refined the heading to match
“We are working on it.” in width. Before styles changed, the 80px assertion observed 64px.
After the width refinement, a DOM Range comparison failed with an 80.58px difference on the
fixed-size heading. Native CSS fitting then made all nine built-page Chromium cases pass
on the isolated port 4451, preserving the owner's running server on port 4321.
Tests now verify rendered text width agreement within 1px, the 24px paragraph, blue SVG fill,
24px icon dimensions, normal/enlarged responsive layout, focus and keyboard behavior.
The mobile screenshot was reviewed. Exact native fitting is tested in Chromium; unsupported
browsers retain the readable larger fallback rather than receive client JavaScript.

Revision checks also passed ESLint, non-mutating formatting and Astro/tooling types. A
Spanish approval quote was paraphrased in English to keep the existing documentation
spelling policy; the final CSpell run checks that correction. No commit or push was made.

## Closer heading/message spacing (T054)

The owner requested a closer heading/message pair. The geometry assertion first failed
with the old 16px gap instead of 8px. Independent spacing now uses 0.5rem after the heading
and 1rem before the profile link. All nine built-page E2E cases passed, including enlargement,
and the mobile screenshot was reviewed. ESLint, formatting and spelling also passed.

## Browser color preference (T055)

Before implementation, the light-mode assertion failed: body background remained black
instead of white. CSS media overrides now invert page/text tokens for light mode and keep
the existing dark colors. All 12 built-page E2E cases passed across the three viewports,
including live light/dark/light switching without reload, matching focus color and the blue
profile icon. The light-mode mobile screenshot was reviewed. ESLint, formatting, spelling
and Astro/tooling types passed. The owner development server was left running.

## Interactive LinkedIn link (T056)

The owner approved six random blue dots, a stationary 44px circular hit area and 600ms
rocket feedback, then requested repetition, stronger dark visibility and continuous,
intensified hover in both themes. These changes explicitly supersede the earlier no-client-
script goal and finite invitation. No new dependency or external resource was introduced.

Meaningful red runs: inert particle generation returned zero dots instead of six; activation
and launch-feedback assertions failed; the original built link lacked enhancement. Later
refinement assertions observed two icon iterations instead of an infinite loop and a paused
hover state instead of running. The implementation then passed those assertions.

`npm run quality` and `npm run test:coverage` passed 25 unit/integration tests. The pure
particle/click/launch module reports 100% lines, branches and functions. Browser entry code
is included in coverage scope, but executes in Playwright rather than the parent V8 report;
overall parent line coverage is 13.72%, not a claim of full browser/CLI instrumentation.
Final lint, formatting, spelling and Astro/tooling types passed with zero diagnostics.

All 27 built-site E2E cases passed at the three approved viewports. Both themes verify six
random trajectories, a fixed target, repeating animation, disappearing merged dots so the
icon stays legible, stronger hover without pausing, and rocket feedback before navigation.
Coverage also includes repeated activation, Enter, modified/middle event cancellation policy,
no-JavaScript fallback, live reduced-motion preference updates and normal theme switching.
Screenshots of gathering, halo, hover and rocket states were visually reviewed. Navigation
was intercepted locally; no real LinkedIn request or real repository push was performed.

The final cold-load inventory at the isolated preview endpoint was:

<!-- cspell:ignore Dgqml -->

| Resource                                               | Uncompressed bytes |
| ------------------------------------------------------ | -----------------: |
| `/` including the local inline module, SVG and JSON-LD |              3,241 |
| `/_astro/index.DgqmlWAW.css`                           |             10,505 |
| Total                                                  |             13,746 |

External requests before activation: **0**. This remains below the approved 102,400-byte
budget. The owner's development server was left running. All introduced source modules and
configuration changes are documented; no commit, push, merge or deployment was made.

## Light-hover palette refinement (T057)

The owner disliked the gray/navy light-mode hover. The updated assertion first observed
the old RGB(0,65,130) instead of the approved LinkedIn blue RGB(10,102,194). The light
hover now keeps that blue and uses a softer 0.20 halo instead of 0.26. Screenshot review
confirmed the cleaner blue tint; all 27 E2E cases, lint, formatting and spelling passed.
Dark-mode styling and continuous hover motion are preserved.

## Nested pre-push fixture isolation (T058)

The reported failure was reproduced by inheriting `LEFTHOOK_BIN` from a parent hook.
That selector bypassed the child repository's configured runner, allowing Lefthook to
hide unstaged edits and making the partial-staging rejection assertion fail. The
regression now injects that selector explicitly. Two additional isolation tests
failed before the fix: inherited selectors remained present, and nested Git commands
targeted a disposable parent repository instead of their own fixture.

Fixture subprocesses now receive a copied environment with Git repository-local
variables and Lefthook control variables removed. Runtime paths remain available;
the real hook environment and enforcement policy are unchanged.

After the fix, all eight focused integration tests passed. Invoking the actual
`.git/hooks/pre-push` with empty input passed branch validation, static/type checks
and all 27 unit/integration tests across 12 files. Empty input deliberately supplies
no outgoing refs: this verifies nested hook execution without contacting or pushing
to a remote. Lint also passed. Application behavior was not changed.

## Foundation commit traceability

At the owner request, `feat(foundation): add WIP page and local quality gates` groups the
complete foundation feature: FR-001–FR-012, SC-001–SC-008 and T001–T057, including the
subsequent approved visual/interaction refinements. Git history supplies the commit SHA.
The constitution remains unchanged. Generated artifacts, reports, local configuration and
dependencies are excluded. Publishing, merging and pushing are not authorized by this step.
