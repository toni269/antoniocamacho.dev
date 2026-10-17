# Public Page Contract

**Source**: spec FR-001–003, FR-010–012, SC-008 and Design Baseline v3.

The built site exposes `/` as a successfully loadable static document. It has one semantic
main region, a heading reading exactly "WIP", and a following paragraph reading exactly
"We are working on it.". Both strings are real text, not embedded in an image. The layout
includes document language, a meaningful title and viewport metadata without adding visible
content. A LinkedIn icon link follows the paragraph and targets
`https://www.linkedin.com/in/antonio-camacho-mira/`. It has an accessible name identifying
LinkedIn, keyboard activation and visible focus. Only explicitly confirmed public identity
information is published; no forms, tracking or client framework is introduced.

The browser preference controls the palette: white background/black text in light mode,
black background/white text in dark mode. Changes apply without a reload. A single content group, including the icon link, is centered
horizontally and vertically in the visible viewport whenever it fits, with no unrelated visible
content.
At small heights or enlarged text, preserve access to the content instead of clipping it;
allow vertical overflow as needed and prevent horizontal overflow. Responsive layout must
preserve text order, exact wording and readable contrast.

Owner-approved acceptance matrix: Chromium at 360×800, 800×360 and 1440×900,
plus 200% text enlargement. Owner-approved position tolerance: group center within 4 CSS pixels of
the viewport center when the group fits.

Owner-approved WIP values: system sans-serif, a bold heading sized to match the explanatory text width,
1.5rem regular paragraph, 0.5rem heading/message separation, 1rem message/profile separation
and 1.5rem minimum page padding. The blue (`#0A66C2`) LinkedIn
icon is 24×24px; its link uses a 2px foreground-colored focus outline with 4px offset and opens in the
same tab. Preserve wrapping,
readability and safe overflow under the approved enlargement test. These values apply only
to the WIP page, not the future Penpot design system or final portfolio identity.

Playwright checks the built document through Astro preview, including HTTP success, semantics,
text, computed background/text/accent colors, center position and overflow. The smoke check does not
claim a full accessibility audit or complete browser support. No deployed endpoint is promised
by this feature. SEO-specific indexing/canonical policy for public hosting belongs to the
later hosting/content requirements; staging must use the future delivery isolation policy.

The built document includes non-executable JSON-LD for a WebSite and its Person author.
Approved data: `antoniocamacho.dev`, `https://antoniocamacho.dev/`, `Antonio Camacho Mira`, and
`https://www.linkedin.com/in/antonio-camacho-mira/`. The Person profile identity link and visible
link must share the same value. Validate parseable metadata, those exact fields and the
website/person relationship; no job, employer, address or additional profile details.
Test script-safe serialization and prevent metadata from claiming content absent from the
actual WIP page. Validate links without requiring a live LinkedIn response.

Owner-approved performance contract: on each approved production-page browser/viewport case,
start with an empty cache and count the initial document plus all required unique fetched
resource bodies before LinkedIn activation. The uncompressed total must not exceed 102,400
bytes and the external-resource request count must be zero. Embedded SVG/JSON-LD counts only
inside its document; unused build files are not page-load resources. Record URLs, body sizes,
total bytes and external request count. Negative fixtures must prove over-budget resources
and attempted external resource loading are rejected. Do not use elapsed localhost time or
compressed transfer size as a substitute, and do not promise public hosting speed.

The owner refined v3: the heading must visually match the width of the paragraph at normal
text size, rather than remain fixed at 80px. On narrow screens/enlarged text, preserve readable
wrapping and reachable content. The 24px paragraph remains the reference.

## Approved interactive profile link

The owner approved six blue dots starting at random positions and gathering into a 44px
circular clickable halo around the 24px icon. The icon gently sways. Normal pointer/Enter
activation shows an aria-hidden rocket emoji for 600ms, then opens the existing destination
in the same tab. Keep the accessible name and visible keyboard focus. Repeated activation
must not schedule duplicate navigation; modified/middle clicks retain native link behavior.
Honor reduced motion: no dots or sway, including preference changes during the visit.
The native link remains functional without JavaScript. A small first-party interaction
module is now allowed; no framework, remote assets or runtime service is introduced.

The owner requested the invitation repeat with more visible dark-mode dots/halo. Pause the
decoration on keyboard focus and keep reduced-motion suppression and one-shot navigation.
Hover must keep moving and intensify the blue effect in both themes.

Light-mode hover retains the approved LinkedIn blue with a softer blue halo rather than
the previous gray/navy tint. Dark-mode visibility and continuous motion remain unchanged.
