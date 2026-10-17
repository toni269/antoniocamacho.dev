# Planned Fresh-Clone Validation Guide

These commands describe the intended implementation, not tools installed or tests executed by
the planning step. Use this guide after implementing approved tasks. The README must expose
this same entry path and link to detailed contribution/testing documentation.

## Prerequisites and setup

Install Git and mise through the documented official method for your supported OS. The owner
approved Linux/macOS and WSL2 as the initial support boundary.
Review the repository's `mise.toml` before trusting it. No Cloudflare account or credentials
are needed. The approved project pin is exact Node 24.22.0, with its bundled npm.

From a fresh clone, enter the repository, then:

```bash
mise trust
mise install
mise exec -- node --version
mise exec -- npm --version
mise exec -- npm ci
mise exec -- npm run check:runtime
mise exec -- npm run hooks:install
mise exec -- npm run dev
```

Expected: the pinned runtime is used, the locked dependency graph installs without undocumented
machine configuration, hooks are installed, and the development URL displays the WIP page.
Use `mise exec --` for every npm command if shell activation is not configured; editor/Git
clients must inherit mise's documented Node PATH for hooks. Document any browser OS libraries
explicitly; a missing prerequisite must not appear as a test pass.

## Everyday commands

After mise shell activation, or with `mise exec --` prepended:

| Command                                                 | Expected outcome                                                    |
| ------------------------------------------------------- | ------------------------------------------------------------------- |
| `npm run lint`                                          | JS/TS/Astro/tests/config/scripts checked without mutation           |
| `npm run format`                                        | Explicitly format owned files                                       |
| `npm run format:check`                                  | Report formatting violations without rewriting files                |
| `npm run spellcheck`                                    | Check owned prose/code; dictionary handles reviewed technical terms |
| `npm run check:types`                                   | Astro check and strict tooling check both pass                      |
| `npm test`                                              | Vitest unit and integration suites pass once                        |
| `npm run test:watch`                                    | Vitest responds to local edits                                      |
| `npm run test:coverage`                                 | Tests pass; ignored V8 coverage report is generated                 |
| `npm run lint:branch`                                   | Current feature or permitted permanent branch is accepted           |
| `npm run lint:commits -- --from BASE_SHA --to HEAD_SHA` | All messages in a real supplied range pass                          |
| `npm run quality`                                       | Important non-E2E checks pass, including non-mutating format check  |
| `npm run build`                                         | Static `dist/` exists; no server runtime generated                  |
| `npm run preview`                                       | Existing static artifact is served locally                          |

Replace BASE_SHA/HEAD_SHA with real revisions; these are CLI argument examples, not runnable
literal Git references. Branch tests must cover the specified regex and permanent exceptions.

## Built-site E2E and complete validation

Install the browser separately after dependency installation:

```bash
npm run test:e2e:install
npm run build
npm run test:e2e
npm run quality:full
```

On supported Linux hosts needing OS libraries, use
`npm run test:e2e:install -- --with-deps` and document required system permissions.
Playwright automatically starts Astro preview on `127.0.0.1:4321` with no server reuse. Build
is intentionally separate from `test:e2e`, enabling future CI artifact reuse. `quality:full`
includes its own build; running it after the individual examples is optional, not a reason for
CI to build twice. Do not substitute the dev server for the built site.

Verify exactly "WIP" and "We are working on it.", black background/white text, centered
content group including the LinkedIn icon below the message, and no unrelated visible
content. Check the profile destination, accessible name, keyboard activation and visible focus.
Parse the built structured data and confirm the approved website/owner identity and shared
LinkedIn URL; no live profile request is required. Use the approved browser/viewport and text-size
matrix from [page contract](contracts/page.md). Check wrapping, orientation and overflow.
For FR-012/SC-008, use a fresh browser context against the production build and review the
recorded resource inventory: total unique uncompressed document/resource bodies <=102,400
bytes and zero external resource requests before interaction. Confirm negative-fixture
rejection. Embedded resources are counted only inside their container; no hosting or timing
claim is made from this local acceptance check.

## Test-first and hook validation

Before each behavior is implemented, capture a meaningful failing test run, then the passing
run after implementation. Harness/installation errors alone are not red evidence. Keep
reviewable evidence with the feature's testing notes; keep generated traces/reports ignored.

Use disposable temporary repositories and a local remote for the scenarios in
[quality contract](contracts/quality.md). Prove each stage-specific mandatory failure blocks
its operation, then prove the passing state permits it. Cover partial staging, invalid branch
names/messages, missing tools, changed configs, first push and multiple outgoing refs. Do not
create test commits or push experiments in the real project repository.

## Scope of proof

A successful walkthrough proves local reproducibility, static build, quality tooling and the
built WIP page. It does not prove deployed CI, Cloudflare hosting, staging or production.
Those require the separate guided delivery feature. Never add real credentials to commands,
examples, source files or reports. No environment variables are currently required.
