# Future delivery direction

Delivery is deferred to a separate, owner-built and guided feature. Nothing here provisions
Cloudflare, changes DNS, enables GitHub Actions or creates a billing commitment.

The approved direction is GitHub Actions orchestration with Astro SSG → immutable static
artifact → Cloudflare static edge assets. Workers runtime execution needs a concrete future
SSR/API requirement. Prefer free-tier limits and explicit budget review; never auto-upgrade.
Environments will be local, disposable PR previews, persistent non-indexed staging associated
with `develop`, and production associated with `main` at antoniocamacho.dev. Quick Tunnels are
optional temporary development tools, not production infrastructure. Cloudflare Access may
later protect staging.

Prefer building once, testing the deployed staging artifact and promoting those same bytes.
The delivery feature must verify the then-current Cloudflare mechanism and document any
promotion limitation, keeping source revision, lockfile and runtime identical. Production
must follow staging validation. Plan aggressive static-asset caching, reusable CI artifacts,
branch protections requiring successful independent checks and force-push/deletion protection.
The owner must configure and verify each pipeline stage with guided explanations. No current
local command claims any of those remote guarantees.
