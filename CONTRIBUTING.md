# Contributing

Begin with the [README](README.md) and the authoritative
[constitution](.specify/memory/constitution.md). Significant changes follow Spec Kit:
constitution → specify → clarify when needed → plan → tasks → analyze → implement → converge.
Specifications define behavior and reasons; plans research and define technical solutions.
Record and obtain owner approval for assumptions and design changes before dependent work.

Use one feature per branch. Branch names match
`^(feat|fix|docs|test|ci|refactor|chore|perf|build)/[a-z0-9-]+$`.
`main` and `develop` are permanent exceptions; this does not permit direct pushes to them.
Work flows through a PR into `develop`, staging validation, then a PR into `main`.
Use Conventional Commits, for example `feat(wip): add accessible profile link`.
Every commit should be a coherent, validated part of its feature.

Write tests before behavior, record a meaningful assertion failure, implement, and record
the passing run. Missing imports, missing browsers and broken setup do not prove missing
behavior. Document code and commands together. Do not fabricate tests for prose or inflate
coverage with meaningless assertions. Compare components with the approved design.

## Local checks

| Stage          | Checks                                                                     |
| -------------- | -------------------------------------------------------------------------- |
| pre-commit     | Exact runtime, branch, applicable staged ESLint/Prettier/CSpell            |
| commit-msg     | Commitlint on the proposed message file                                    |
| pre-push       | Exact runtime, branch, static/types, Vitest, every outgoing commit message |
| `quality`      | Runtime, branch, full lint/format/spelling/types/Vitest                    |
| `quality:full` | `quality`, production build, built-site Playwright                         |

Hooks never format, add, stash or rewrite your files. If a path has both staged and unstaged
edits, commit checks reject it: stage the complete intended file or separate the edits yourself,
then retry. Configuration changes trigger the corresponding full check. Deleted or unsupported
files need no file-level tool invocation. Missing tools and failed checks block the operation.
Install/repair hooks with `mise exec -- npm run hooks:install` after `npm ci`.

Independently runnable examples:

```bash
npm run lint:branch -- --branch feat/project-foundations-wip
npm run lint:commits -- --edit /path/to/message.txt
npm run lint:commits -- --from BASE_SHA --to HEAD_SHA
npm run quality:full
```

Hooks can be bypassed. They are developer feedback, not authoritative merge enforcement.
Independent GitHub Actions checks and protection for `develop`/`main` remain future work;
this feature does not establish merge eligibility or deploy anything. The owner will build
those pipelines manually with guidance. Never commit credentials, private CV source, local
configuration, dependencies, coverage or generated reports. See the development guide for
PATH recovery and future delivery boundaries.
