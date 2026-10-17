# Feature Specification: Project Foundations and WIP Page

**Feature Branch**: `feat/project-foundations-wip`

**Created**: 2026-10-17

**Status**: Ready for planning — LinkedIn and public identity scope clarified

**Input**: User description: "Build the foundations of our project on a new feature branch,
including a black and white page with WIP in the middle of the screen and We are working
on it. below it."

## Clarifications

### Session 2026-10-17

- Q: What is the full URL of your LinkedIn profile? → A: The owner supplied
  `https://www.linkedin.com/in/antonio-camacho-mira/?isSelfProfile=true`.
  The public profile destination is `https://www.linkedin.com/in/antonio-camacho-mira/`,
  preserving the supplied profile path without the self-profile query parameter.

- Q: Which public facts should the page include as structured information? → A: Option B:
  website name `antoniocamacho.dev`, website URL `https://antoniocamacho.dev/`, public owner
  name `Antonio Camacho Mira`, and the confirmed LinkedIn profile URL.

- Q: Which performance budget should the initial WIP page enforce? → A: Recommended
  option A: at most 100 KiB (102,400 bytes) for the initial page and all resources needed to
  display it, measured uncompressed with an empty cache; zero external resource requests
  before the visitor activates LinkedIn.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Understand the Site Is Being Built (Priority: P1)

As a visitor to antoniocamacho.dev, I want to see a clear work-in-progress message so that I
understand the portfolio is being prepared.

**Why this priority**: This is the requested visitor-facing outcome and the first usable page.

**Independent Test**: Open the page and compare its content and layout with Design Baseline
v2 below, including at mobile and desktop screen sizes.

**Acceptance Scenarios**:

1. **Given** a visitor opens the page, **When** its content is displayed, **Then** the visitor
   sees exactly "WIP" with exactly "We are working on it." below it.
2. **Given** the page is displayed, **When** its appearance is reviewed, **Then** the background
   is black, the text is white, the content group is centered horizontally and vertically, and
   the LinkedIn icon appears below the explanatory message with no unrelated visible content.
3. **Given** the page is displayed at mobile or desktop sizes, **When** the screen dimensions
   or orientation change, **Then** both messages remain readable, in order, and centered
   without clipping or horizontal scrolling.
4. **Given** a visitor wants to find the owner's professional profile, **When** they activate
   the LinkedIn icon below "We are working on it.", **Then** they reach the owner-confirmed
   profile at `https://www.linkedin.com/in/antonio-camacho-mira/`. The link is keyboard-operable
   and has an accessible name identifying LinkedIn.
5. **Given** a search service inspects the page, **When** it reads the structured information,
   **Then** it identifies `antoniocamacho.dev` at `https://antoniocamacho.dev/`, its owner
   `Antonio Camacho Mira`, and the same confirmed LinkedIn profile used by the visible link,
   with no invented personal or professional claims.

6. **Given** the production page is opened with an empty cache, **When** its initial document
   and required resources have loaded before any LinkedIn activation, **Then** their combined
   uncompressed size is at most 102,400 bytes and zero resource requests go to external sites.

### User Story 2 - Start and Understand Local Development (Priority: P2)

As the project owner or a contributor, I want documented local setup and development so that
I can reproduce the WIP page and understand how to maintain the project.

**Why this priority**: A reproducible, documented foundation enables later portfolio features.

**Independent Test**: Starting from a clean checkout, follow only the repository's documented
instructions to prepare the project, view the WIP page locally, and run its validation.

**Acceptance Scenarios**:

1. **Given** a clean checkout and the documented prerequisites, **When** a contributor follows
   the setup and local development instructions, **Then** the WIP page can be viewed locally
   without undocumented setup steps.
2. **Given** the configured local environment, **When** the contributor follows the documented
   production-build procedure, **Then** the project builds successfully.
3. **Given** the repository documentation, **When** a contributor reviews it, **Then** they can
   identify the project's purpose, local setup, validation procedures, test-first workflow,
   and responsibilities of the introduced code and configuration.

### User Story 3 - Validate Changes Before Committing or Pushing (Priority: P2)

As a contributor, I want a test-first workflow and local commit/push checks so that incomplete
or invalid changes are caught before they are recorded or shared.

**Why this priority**: Validation is part of the requested foundation and a constitutional
requirement for subsequent feature work.

**Independent Test**: In a disposable local copy, demonstrate a failing test before its
corresponding implementation, then demonstrate passing validation and blocked commit/push
attempts when required checks fail. No public deployment or real remote update is needed.

**Acceptance Scenarios**:

1. **Given** an unimplemented acceptance behavior, **When** its test is written and run,
   **Then** it fails because the behavior is missing; after implementation, the same test
   passes and the before/after evidence is recorded.
2. **Given** a proposed commit or push, **When** a mandatory check applicable to that
   operation fails or cannot run, **Then** the operation is blocked and its failure is reported.
3. **Given** a valid change, **When** the local checks applicable to that operation pass,
   **Then** local validation permits the operation. A push check is verified against a
   disposable local destination.
4. **Given** a contributor wants to reproduce full validation locally, **When** they follow
   the documented complete-suite command, **Then** code, formatting, spelling, static/type,
   unit/integration, production-build and browser end-to-end validation can all run locally.
5. **Given** an invalid branch name or commit message, **When** the corresponding local
   validation runs, **Then** it rejects the name or message according to owner-approved
   conventions; push validation covers all outgoing commit messages.

### Edge Cases

- At narrow screen widths, in landscape orientation, or with enlarged text, both messages
  remain readable; wrapping preserves their wording and order. If the content exceeds the
  available height, it remains reachable rather than clipped.
- If LinkedIn is unavailable, the WIP page and its messages remain usable; the page does
  not depend on loading external LinkedIn content to render the icon or text.
- The icon-only link has an accessible name and a visible keyboard focus state.
- Structured information must not contain guessed credentials, employment, private details,
  or claims unrelated to the page's actual identity and purpose.
- A missing prerequisite or unavailable validation command produces an actionable failure;
  it must not be reported as a passing check.
- A change made after validation requires fresh validation of the state being committed
  or pushed; earlier results cannot approve changed content.
- A contributor starting from a clean checkout must receive all documented setup steps,
  including any needed to activate local validation.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The feature MUST provide a visitor-facing work-in-progress page for the portfolio.
- **FR-002**: The page MUST show exactly "WIP" as its primary message and exactly
  "We are working on it." as its explanatory message below it.
- **FR-003**: The page MUST conform to Design Baseline v3 and remain readable across mobile
  and desktop screen sizes, including after orientation changes and text enlargement.
- **FR-004**: Contributors MUST be able to prepare a clean checkout, view the page locally,
  and produce a successful production build by following documented instructions.
- **FR-005**: Documentation MUST cover prerequisites, setup, local development, production
  build, validation, test-first contribution, and the purpose and behavior of introduced
  code and configuration. It MUST change with the behavior it describes.
- **FR-006**: The feature MUST have feature-specific, integration, and end-to-end tests linked
  to its acceptance criteria, written and observed failing before corresponding implementation
  and passing afterward. The evidence MUST distinguish missing behavior from setup failures.
- **FR-007**: The foundation MUST provide automated local quality gates with fast
  pre-commit checks for branch names, linting, formatting validation and spelling where
  applicable; commit-message validation at commit time; and appropriate static/type
  validation plus unit/integration tests before push. Outgoing commit messages MUST also be
  validated. The complete validation suite, including production build and browser end-to-end
  tests, MUST be executable locally through a documented command. Before protected-branch
  merges, CI MUST independently enforce all mandatory quality gates under Constitution VI;
  implementing that CI is deferred to the later pipeline feature.
- **FR-008**: Failed, missing, or unavailable mandatory checks applicable to a local operation
  MUST block it and identify the failed check. A passing applicable state MUST permit the
  operation without bypassing validation. Local hooks MUST NOT be treated as authoritative
  merge enforcement; full independent CI validation remains required for protected merges.
- **FR-009**: Local setup and validation MUST be reproducible from a clean checkout; changes
  after a successful validation MUST be validated again before commit or push.
- **FR-010**: The page MUST include a LinkedIn icon link below "We are working on it.",
  pointing to `https://www.linkedin.com/in/antonio-camacho-mira/`. The link MUST have an
  accessible name, keyboard activation and a visible focus state.
- **FR-011**: The page MUST provide machine-readable structured identity information for
  website name `antoniocamacho.dev`, website URL `https://antoniocamacho.dev/`, owner public
  name `Antonio Camacho Mira`, and profile URL
  `https://www.linkedin.com/in/antonio-camacho-mira/`. The structured information MUST identify
  the relationship between the website and its owner, and MUST use the same LinkedIn
  destination as the visible link. No other personal or professional facts are included.

- **FR-012**: The production WIP page MUST require at most 100 KiB (102,400 bytes) of
  uncompressed initial document and resource bodies on an empty-cache load, and MUST make
  zero external resource requests before LinkedIn activation. Count each unique fetched
  resource once, including the page document and any required styles, images, fonts or
  scripts. Embedded content counts within its containing resource; do not double-count it.
  This is a page-size and dependency budget, not a promise about public hosting latency.

### Design Baseline v3

The owner explicitly approved trying larger white text and a blue LinkedIn icon after reviewing
the proposed revision. The revised baseline is:

- Follow the browser color preference: white background and black text in light mode,
  black background and white text in dark mode. React to preference changes automatically.
- A single content group centered horizontally and vertically in the screen.
- "WIP" as the primary message, with "We are working on it." below it.
- The heading grows to the width of the explanatory text, which is the width reference.
- Keep the heading and message close together, with more space before the LinkedIn icon.
- A LinkedIn icon link below the explanatory message, using the approved blue accent.
- The icon gently invites activation while six randomly positioned blue dots gather into a
  44px circular hit area. Activating it shows a rocket emoji for about 600ms before same-tab
  profile navigation. Respect reduced-motion preferences and preserve keyboard/native link use.
- Responsive layout with no unrelated visible content.

This section is the approved design reference for this feature. Detailed visual choices
not specified here MUST be validated with the owner before component implementation.

### Scope Boundaries

Included: the WIP page, local development, documentation, test-first checks, and local
commit/push validation, one LinkedIn icon link and confirmed structured identity information.
No final portfolio sections, private resume material or other social links are included.

Hosting, domain setup, deployment, and CI/CD pipelines are deferred to later features.
Deferring pipelines does not defer local validation. Technical choices, alternative solutions,
exact commands, testing techniques, and detailed validation conventions belong in the plan
and require human approval before dependent implementation. No provider or cost commitment
is authorized by this specification.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: In every page acceptance scenario, both messages match the requested text
  character for character, with "WIP" above "We are working on it.".
- **SC-002**: Every approved mobile, desktop, orientation, and enlarged-text review passes
  Design Baseline v3, with zero clipped messages or horizontal scrolling.
- **SC-003**: A contributor completes one clean-checkout walkthrough using only the documented
  instructions, successfully viewing the WIP page, building the project, and running all
  required local checks with zero undocumented setup steps.
- **SC-004**: Every implemented acceptance behavior has linked test-first evidence, and all
  required feature, integration, and end-to-end tests pass before feature completion.
- **SC-005**: For both commit and push validation, a controlled failure of each mandatory
  check applicable to that operation blocks it in a disposable local copy; a passing
  applicable state permits it. Invalid branch names and commit messages are rejected in
  every corresponding acceptance case. One documented complete-suite command successfully
  runs all local quality, production-build and end-to-end checks. This does not claim CI
  or protected-branch enforcement has been installed by this feature.
- **SC-006**: In all approved page acceptance cases, the LinkedIn icon appears below the
  explanatory message, targets the confirmed URL, and can be reached and activated using
  the keyboard with a visible focus indication.
- **SC-007**: Structured information is readable by a structured-data validator with zero
  syntax errors, contains all owner-approved identity facts, and contains zero unconfirmed
  personal or professional claims.

- **SC-008**: Every approved browser/viewport acceptance case on the production build
  satisfies the 102,400-byte initial uncompressed resource budget and zero-external-request
  limit before interaction. The recorded evidence lists counted resource URLs and sizes,
  total bytes and external request count; controlled over-budget/external-resource fixtures
  demonstrate that the acceptance checks reject violations.

## Assumptions

No unconfirmed assumption is treated as an approved requirement. This feature depends on the
existing constitution and on human approval of the technical plan and detailed conventions.
Decisions about tools, environment versions, costs, and detailed visual choices remain for
planning and MUST be validated before dependent implementation.

### Confirmed Clarifications

- **Scope**: The owner selected "WIP page plus local development, documentation, test-first
  checks, and commit/push validation; defer hosting and pipelines."
- **Design**: The owner approved the black background, white text, centered responsive
  layout, then added a LinkedIn icon below the explanatory message. Design Baseline v3
  supersedes the earlier restriction excluding that icon.

- **Quality gate alignment**: During planning, the owner approved aligning FR-007–008,
  User Story 3 and SC-005 with Constitution VI v2.0.0: fast commit checks, commit-msg validation,
  appropriate types/unit/integration before push, and full build/E2E validation in future CI
  with a documented complete local command. Hosting and pipeline implementation remain deferred.

- **Scope extension**: The owner requested a LinkedIn profile icon below the explanatory
  message and structured identity information before resuming technical planning. The profile
  URL and the minimal website/owner identity scope were confirmed in this session. No
  employment, credentials, contact details or additional personal facts are authorized.

### Approved LinkedIn interaction

The owner approved the six-dot/44px halo and 600ms rocket proposal. Reduced motion disables
the decorative gathering and sway; the brief static rocket feedback remains. Without client
execution, the underlying profile link must still work. Modified clicks keep native behavior.

The owner subsequently requested a repeating invitation and stronger dark-theme visibility.
Keep the same halo/rocket behavior, repeat the decorative motion, make dark-mode particles
and halo more apparent, and continue honoring reduced motion.

The owner refined hover behavior: keep the invitation moving while hovered and intensify
the blue effect in both light and dark themes.
