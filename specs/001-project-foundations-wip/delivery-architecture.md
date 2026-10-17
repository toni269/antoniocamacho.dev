# Future Delivery Architecture — Not Foundation Implementation

**Status**: direction for a separately specified, owner-built pipeline feature. No workflow,
Cloudflare configuration, credentials, resources, routes, domains or rulesets are created now.
Reconfirm provider capabilities, pricing and exact CLI versions when that feature begins.

## Orchestration and trust boundaries

GitHub Actions is the intended explicit orchestrator. Working branches open PRs into `develop`;
independent validation precedes merge. The resulting integration candidate is validated on
staging before a PR from `develop` into `main` can promote it to production. A passing PR check
is not equivalent to validating a changed integration/merge result. No direct permanent-branch
push is part of the workflow.

Propose future required checks for branch naming, the PR commit range, ESLint, non-mutating
Prettier, CSpell, Astro/tooling types, Vitest with V8 coverage, production build and built-site
Playwright. Run unit tests once with coverage rather than again in a separate identical job.
Build once per source candidate; upload `dist/` and provenance, then download it for E2E and
deployments instead of rebuilding. All checks apply to the same candidate; if a merge changes
its source tree, create and validate a new candidate.

Run untrusted fork PR code using `pull_request`, read-only permissions and no deployment
credentials. Do not execute fork-controlled dependencies/build/test code under privileged
`pull_request_target`. A trusted deployment job must use trusted deploy configuration and
verified artifact paths, not arbitrary deployment scripts from a PR artifact. Browser previews
have separate origins and must never gain production bindings or secrets. Required PR history
must be fetched; use the real PR head branch name and base/head SHA range for validation.
These security boundaries follow [GitHub's secure-use guidance](https://docs.github.com/en/actions/reference/security/secure-use)
and [Commitlint's range validation guide](https://commitlint.js.org/guides/ci-setup).

Propose rulesets for both `develop` and `main`: require PRs and successful stable-named checks,
block unsafe force pushes and deletion, and explicitly review any administrator bypass.
Decide approval requirements with the owner, accounting for a solo-maintainer workflow; do not
invent mandatory reviewers or paid plans. Activation is later guided work. See
[GitHub ruleset rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets).

## Four environments

| Level      | Intended behavior                                             | Isolation and acceptance                                     |
| ---------- | ------------------------------------------------------------- | ------------------------------------------------------------ |
| Local      | Astro dev; production preview for tests                       | Loopback by default; no Cloudflare account required          |
| PR preview | Disposable static preview per working PR                      | Separate origin, no production mutation, cleanup on closure  |
| Staging    | Persistent candidate environment associated with `develop`    | Stable staging hostname, noindex, smoke/E2E before promotion |
| Production | `antoniocamacho.dev`, associated with approved `main` release | Promote only the staged/validated artifact                   |

A Cloudflare Quick Tunnel may later expose local dev temporarily for mobile/external testing.
It is an optional manually installed development aid, not production or staging. It has a
random temporary endpoint and service limitations; no account/token is needed for the basic
Quick Tunnel path. Do not expose private development data. See
[Cloudflare Quick Tunnels](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/).

For PRs, prefer the current dedicated Wrangler Preview workflow after compatibility testing
with assets-only builds. It is designed to isolate preview resources; version URLs must not
be assumed equivalent. Current docs describe `wrangler preview` and deletion on completion;
select/pin the CLI in the future feature. No preview dependency is installed now. See
[Cloudflare Previews](https://developers.cloudflare.com/workers/previews/) and
[workflow comparison](https://developers.cloudflare.com/workers/previews/compare-workflows/).

## Static-first Cloudflare deployment

Recommend Astro SSG → `dist/` → Workers Static Assets, with `assets.directory` pointing to the
artifact and no Worker `main` entry point. This uses the Workers deployment platform without
Worker runtime execution. Do not install the Astro Cloudflare server adapter, provision KV,
or switch Astro to server output for this page. Pages remains an alternative to assess in the
future feature if organizational constraints favor it. The recommendation follows the
[current Cloudflare Astro guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/).

Domain registration and DNS are already managed by Cloudflare per the owner; this plan does
not change them. Separate staging and production static deployments are proposed, with future
bindings for `staging.antoniocamacho.dev` and `antoniocamacho.dev`. Provider account identifiers,
credentials, access policies and routes are not required for foundation development.

Static asset requests/storage follow Cloudflare's documented free asset model; runtime
invocations and optional services have separate limits/pricing. No subscription upgrade,
`run_worker_first`, dynamic handler or paid binding is authorized. Recheck limits and fail
closed on unsupported account configuration. Review total free-tier fit, including artifact
storage/retention and preview count, before activation. No estimate here is a spending approval.
[Cloudflare static asset billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/).

## Build once and promote tested bytes

Proposed future release sequence:

1. A trusted workflow builds a candidate from an exact source revision, committed lockfile,
   pinned runtime/npm and reviewed build inputs; there are no secrets baked into assets.
2. Store immutable `dist/` together with source SHA/tree, lockfile hash, runtime/npm identity,
   and a per-file digest manifest. Record the workflow/artifact identity and retention.
3. Download and independently verify the manifest with failure on mismatch; test the artifact
   locally through preview and deploy those same bytes to staging.
4. Run smoke/E2E against the deployed staging candidate, and associate evidence with its
   artifact digest and Cloudflare deployment ID. Disable premature promotion while it fails.
5. On approved `develop` → `main` promotion, verify the release identifies the tested source
   tree and artifact. Download the retained artifact, verify it again, and deploy unchanged
   asset bytes to production. Do not rerun `astro build` for production.
6. Record production deployment identity and retain an approved rollback artifact. A changed
   tree, expired/missing artifact or invalid evidence requires a newly built/staged candidate,
   not an undocumented rebuild presented as the original tested artifact.

GitHub artifact storage supports immutable uploads; downloading alone must not be treated
as an enforced checksum gate because an integrity mismatch can be reported as a warning.
Explicitly reject mismatch and unsafe extraction paths. See
[GitHub artifact storage and sharing](https://docs.github.com/en/actions/tutorials/store-and-share-data).

**Limitation**: Cloudflare version IDs belong to a particular Worker. Separate staging and
production targets cannot literally share a version ID. Re-uploading the exact verified static
bytes from one immutable artifact is the practical proposal; configuration and routes differ
by environment and require their own validation. Within a target, version activation/rollback
is separate from creating versions. See
[Cloudflare versions](https://developers.cloudflare.com/workers/versions-and-deployments/).

**Source identity nuance**: a Git merge can create a new commit SHA with an identical tree.
This is an inference from Git semantics, not a guarantee of Cloudflare promotion. The future
release policy must explicitly prove the relationship between main's revision and the staged
source tree, or use a promotion strategy preserving the validated revision. If files/build
inputs change, retest a new candidate. The merge strategy and provenance approval remain
open until that delivery feature; no false claim of literal cross-target promotion is made.

## Indexing and caching without environment rebuilds

Staging must return `X-Robots-Tag: noindex` and may additionally use Cloudflare Access.
A shared asset `_headers` file can express hostname-specific staging rules without changing
production bytes. Verify headers on the actual staging/custom-domain/preview hosts; do not
assume a default workers.dev behavior also protects custom hostnames. Production must not
accidentally match staging noindex rules. Do not bake unconditional staging noindex into a
separate rebuilt HTML artifact. `robots.txt` alone is not an indexing prevention guarantee.

Use long immutable caching for fingerprinted assets only; HTML must remain revalidatable
so later releases become visible. Default asset ETags/revalidation and host-specific headers
must be checked on deployment. Avoid blanket year-long immutable caching for HTML/unhashed
files. Future SSR/API caching requires a concrete correctness analysis, not an experiment.
These recommendations use [Cloudflare's static header capabilities](https://developers.cloudflare.com/workers/static-assets/headers/).

## Guided implementation later

The owner performs each configuration step manually: explain purpose and permissions, prepare
one stage, show expected output and failure diagnosis, let the owner run it, then verify before
advancing. A later specification must bound preview cleanup, release/merge policy, staging
access, account costs, rollback and secret management. Runtime feature flags are excluded;
local/preview/staging provide the intended unfinished-work validation path.
