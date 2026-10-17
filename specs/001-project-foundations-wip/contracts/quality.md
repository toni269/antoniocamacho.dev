# Local Quality and Git Interface Contracts

**Status**: proposed interface under Constitution VI v2.0.0 and the explicitly aligned spec.
Hook placement follows owner-approved C-01 resolution; detailed implementation awaits plan review.

## CLI behavior

All check scripts return zero on success and nonzero for a violation, missing prerequisite,
or execution failure. Report the failed check and a remediation command without revealing
secrets. Checks never rewrite files; only explicit `format` mutates content. No commands
require globally installed npm tools. `mise exec -- npm run SCRIPT` is the shell-independent
entry point after the documented mise/Git installation.

`lint:branch` accepts `--branch NAME` or resolves the current symbolic branch. Accepted names
are exactly `main`, `develop`, and matches of
`^(feat|fix|docs|test|ci|refactor|chore|perf|build)/[a-z0-9-]+$`. Empty/detached input fails unless
an explicit branch is supplied. CI must pass the PR head name, not its synthetic checkout ref.
Accepting permanent names does not authorize direct pushes to permanent branches.

`lint:commits` exposes Commitlint's `--edit MESSAGE_FILE` and `--from BASE_SHA --to HEAD_SHA`
inputs. The conventional configuration supports feat, fix, docs, test, ci, refactor, chore,
perf and build. CI must fetch enough history to validate the whole range. Merge-generated
messages require an explicit documented policy in the future workflow, not blanket skipping
of contributor messages. `check:push-commits` consumes all pre-push ref updates and validates
all outgoing commit messages, including new branches without tracking configuration.

`check:staged` reads NUL-delimited Git filenames, filters supported existing staged files,
uses process argument arrays, and treats no applicable files as a documented no-op. Tool
failure is never a no-op. Reject files with overlapping staged and unstaged edits rather
than validate different bytes. Config changes trigger the affected full lint/format/spelling
check. No automatic formatting, `git add`, stash mutation, commit, or push is performed.

## Gate placement proposed under Constitution 2.0.0

| Boundary                         | Required proposed checks                                                                           |
| -------------------------------- | -------------------------------------------------------------------------------------------------- |
| pre-commit                       | Runtime, branch; staged ESLint, Prettier check and practical CSpell                                |
| commit-msg                       | Commitlint on supplied message file                                                                |
| pre-push                         | Branch, Astro/tooling static types, Vitest unit/integration, outgoing commit messages              |
| `quality`                        | Runtime, branch, full lint/format/spelling/types/Vitest; excludes E2E/build                        |
| `quality:full`                   | `quality`, production build, E2E against the built artifact                                        |
| Future CI before protected merge | Independent branch/range checks, full lint/format/spelling/types, Vitest with coverage, build, E2E |

Full validation remains manually executable without forcing it into each commit/push.
Future CI may use separate steps to reuse artifacts instead of literally invoking the
aggregate command. Every mandatory check still has to run for the validated revision.

## Test and artifact commands

`test` runs Vitest once; `test:watch` watches; `test:coverage` adds matching V8 coverage.
`build` produces `dist/`; `preview` serves only existing built output on loopback port 4321.
`test:e2e` auto-starts that preview through Playwright; it does not rebuild or use `astro dev`.
`test:e2e:install` installs Chromium, with optional `--with-deps` for supported Linux hosts.
A missing build or browser fails with a documented prerequisite message.

Git-operation acceptance tests run only in temporary repositories and local remotes. Cover
passing state and each applicable gate failure, missing tool, changed state, partial staging,
invalid branch/message, multiple refs and first push. Do not manipulate this repository to
prove rejection. Keep generated coverage, reports and traces ignored.
