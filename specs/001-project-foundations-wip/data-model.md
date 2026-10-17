# Data and Configuration Boundaries

This foundation has no persistent business entities, database, authentication, forms, API,
private resume source, or user data. Do not invent a content schema to fill this document.

## Public WIP content

`src/content/wip.ts` is a proposed replaceable public content module with two strings:

| Field   | Value                 | Validation                                       |
| ------- | --------------------- | ------------------------------------------------ |
| heading | WIP                   | Exact case; displayed as the single main heading |
| message | We are working on it. | Exact punctuation; below heading                 |

The route reads these values at build time. The public page contains no content editing flow
or persistent application state. Layout and styling do not own personal resume data. Future Astro Content
Collections may model public experience/projects/blog content in a separate specified feature.

## Confirmed public identity

`src/content/site.ts` is a replaceable public identity source, separate from page markup.

| Field       | Owner-confirmed value                             |
| ----------- | ------------------------------------------------- |
| siteName    | antoniocamacho.dev                                |
| siteUrl     | https://antoniocamacho.dev/                       |
| ownerName   | Antonio Camacho Mira                              |
| linkedInUrl | https://www.linkedin.com/in/antonio-camacho-mira/ |

These values feed the icon link and static structured identity graph. A `WebSite` node
references its `Person` author; the Person uses the approved LinkedIn URL as `sameAs`.
Use stable site-based IDs so references resolve within the graph. No employment, private
contact information or inferred profile fields are authorized. Validate exact approved
values and safe serialization; fork owners replace this one content source and tests.
No database, profile import, remote LinkedIn dependency or content collection is introduced.

## Tooling inputs

Branch names, proposed commit messages, Git ref update ranges, staged paths and runtime
versions are transient tooling inputs, not application records. Validation results are
process exit codes and actionable diagnostics; see [quality contract](contracts/quality.md).
Tests create temporary repositories and remove them; no test state enters application output.

## Build and release identity

The current feature produces local `dist/` output and ignored test reports only. A future
release artifact manifest will link source SHA/tree, lockfile hash, Node/npm versions and
per-file asset digests to staging evidence and production deployment. This is delivery
provenance, not a content model; it is not implemented in this foundation.

## Transient interaction state

The LinkedIn enhancement has invitation, launching and navigation states, with a one-shot
600ms timer and six randomly generated decorative particle trajectories. None are persisted,
transmitted or added to structured identity data. Browser reduced-motion preference is read
live; disabling scripts keeps the underlying native href usable.
