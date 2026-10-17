# antoniocamacho.dev Constitution

## Core Principles

### I. Specification and Human-Approved Decisions

Every feature MUST begin with a written specification and an explicit implementation plan.
The person authoring the specification MUST define the intended behavior, scope, acceptance
criteria, product constraints, and requirement clarifications. The specification MUST describe
what to build and why, remain technology-agnostic, and record open requirement questions and
their human-validated answers. It MUST NOT select technologies, architecture, libraries,
providers, or implementation techniques.

The plan MUST define how to build the specified feature. Technical decisions and their
clarifications MUST belong in the plan, including technology choices, architecture, affected
components, test strategy and cases, dependencies, validation commands, costs, and delivery
steps. The plan MUST be explicit enough for another person to implement it and MUST exist
before implementation begins. Unplanned implementation is prohibited.

Planning MUST research possible solutions and explore new approaches relevant to the
specified requirements before proposing a technical direction. The plan MUST document the
alternatives considered, supporting evidence or references, tradeoffs, costs, complexity,
maintenance implications, and learning value. It MUST explain why the recommended approach
fits the requirements and why other approaches were rejected. Novelty alone MUST NOT justify
a choice; proposals MUST remain affordable and subject to human validation. If only one
viable approach is found, the plan MUST record the search and explain that constraint.

Every assumption MUST be recorded and validated with the project owner before dependent work
proceeds. Silence MUST NOT count as approval. Unresolved decisions MUST remain explicit open
items; contributors MUST NOT silently select tools, providers, budgets, or product behavior.
Changes to approved scope or design MUST receive human approval and update the specification
and plan where affected before implementation continues. Technical-only changes MUST update
the plan; they MUST NOT introduce implementation details into the specification. This makes
implementation deliberate and reviewable.

### II. Test-First Delivery

Every feature MUST include feature-specific tests, integration tests, and end-to-end tests
linked to its acceptance criteria. Tests MUST be written and run before the corresponding
implementation. Contributors MUST observe and record a meaningful failure caused by missing
behavior, implement the minimum required behavior, and refactor only while tests pass.

Integration tests MUST exercise the affected boundaries; end-to-end tests MUST exercise the
feature's user-visible or operational outcome. Tests MUST verify behavior rather than merely
repeat implementation details. Test evidence MUST identify the failing and passing runs.
Documentation-only changes MUST pass the applicable documentation validation; they MUST NOT
introduce artificial executable behavior solely to create tests.

### III. Design as the Component Source of Truth

The human-approved design MUST be the source of truth for component appearance, layout,
states, responsive behavior, and interaction. The specification and plan MUST identify the
design reference and its version before component implementation starts. Contributors MUST
resolve missing or conflicting design details with the owner before implementing them.
Component acceptance MUST include comparison with that reference and tests for the defined
states and interactions. Visual changes MUST update the approved design before implementation.

### IV. Complete and Maintained Documentation

All code MUST be documented sufficiently for the owner or a new contributor to understand,
run, test, maintain, and change it. Modules, components, functions, interfaces, and configuration
MUST document their purpose, inputs, outputs, constraints, and failure behavior where applicable.
Non-obvious logic MUST explain its rationale. Documentation MUST cover setup, architecture,
local commands, testing, SEO, deployment, hosting, domains, and operational recovery as each
area is introduced. Code and documentation MUST change together; undocumented behavior MUST
NOT be considered complete.

### V. Feature Branches and Reviewable Commits

Each feature MUST have its own branch linked to its specification, plan, and tasks. Every
commit on that branch MUST represent a coherent part of that feature; unrelated work MUST
use a separate feature branch. Commit messages and branch names MUST follow human-approved,
machine-validated conventions. Each commit MUST pass the applicable local validation gates.
Feature completion MUST include traceability from acceptance criteria to commits and test evidence.

Features containing distinct logical changes MUST be delivered through multiple focused
commits as the work progresses. Each commit MUST have one explainable purpose and be
reviewable on its own. Independently reviewable changes MUST NOT be bundled into one final
feature commit. Related implementation, tests and documentation MAY share a commit when
they form one validated change. Small changes MUST NOT be split artificially to meet a quota.

Every commit MUST use a descriptive Conventional Commits subject with a meaningful type
and scope where applicable. Its body MUST explain what changed, why it was needed, and
which validation was performed and its result. Relevant specification requirements or
task IDs MUST be referenced when applicable. Documentation-only commits MUST record the
applicable documentation checks rather than claim application tests were run. Generic
messages that do not identify the change are insufficient.

Merge-request summaries MUST identify the distinct areas changed and relate them to the
corresponding commits and specification tasks where applicable. Commit types, scopes and
descriptions MUST provide enough detail to propose relevant merge-request labels during
review. Labels MUST reflect the actual changes and MUST NOT replace the descriptive summary
or commit history. Repository label names and any automation require owner approval before
use; this principle does not establish a label taxonomy or require Git tags.

### VI. Automated Quality Gates

The project MUST enforce automated quality gates both locally and in CI.

Local Git hooks MUST provide fast feedback and prevent common quality violations without
imposing the full validation cost on every commit.

Pre-commit hooks SHOULD run fast checks such as branch-name validation, linting, formatting
validation, and spelling checks. This keeps feedback fast while CI independently enforces
complete merge validation.

Commit-message validation MUST run through a commit-msg hook.

Pre-push hooks MUST run appropriate static/type validation and unit/integration tests.

Expensive validation, including production builds and end-to-end browser tests, MUST run in
CI before changes are eligible to merge into protected branches.

Local hooks MUST NOT be considered the authoritative enforcement layer because they can be
bypassed.

CI MUST independently enforce all mandatory quality gates required for merge.

The complete validation suite MUST be executable locally through a documented command when
a developer wants to reproduce CI validation before opening or updating a Pull Request.

### VII. Portfolio Quality and Affordable Learning

antoniocamacho.dev MUST serve as Antonio Camacho's personal portfolio and as a practical
learning project for SEO, CI/CD, hosting, and domains. The existing README describes an
open-source Astro portfolio and resume intended to be fast, SEO-friendly, reproducible, and
easy to fork; changes to that stated direction MUST be validated with the owner.

Specifications MUST define measurable SEO, performance, and reproducibility acceptance
criteria wherever the feature affects those areas. Plans involving services, infrastructure,
or domains MUST identify setup and recurring costs, renewal terms, limits, and affordable
alternatives. The owner MUST explicitly approve the budget and choices before commitments
or dependent implementation. No numerical budget or provider choice is established here.

### VIII. Guided, Owner-Built Pipelines

The project owner MUST build the CI/CD pipelines manually with guided explanations when
pipeline work begins. Contributors MUST explain each stage's purpose, configuration, commands,
expected output, and failure diagnosis in ordered, manageable steps. The guidance MUST cover
local checks, CI validation, deployment, credentials, and recovery as those stages are added.

Contributors MUST let the owner perform the pipeline configuration and verify each step's
result before advancing. They MUST NOT silently generate, install, or enable a complete
pipeline on the owner's behalf. Pipeline learning and reproducible operational documentation
MUST be acceptance criteria of pipeline features.

## Project Constraints

- Tooling, test frameworks, hosting providers, domain configuration, and deployment mechanisms
  MUST be selected through a documented, human-approved plan; this constitution selects none.
- The owner MUST approve the authoritative design reference, branch and commit conventions,
  and validation commands before implementation relies on them.
- If local validation infrastructure is absent, its establishment MUST be planned and
  completed before ordinary feature commits and pushes rely on it. Manual checks MUST be
  documented and executed during bootstrap; automated enforcement MUST then be established.
  Missing infrastructure MUST NOT be treated as evidence that a check passed.
- Credentials and secrets MUST remain outside committed source and public output. Pipeline
  guidance MUST explain how the approved platform stores and provides them safely.
- Costs and resource usage MUST remain within the owner's approved budget. Changes to that
  budget or operational commitments MUST be approved before execution.

## Development Workflow and Quality Gates

1. Define what to build in a technology-agnostic feature specification: intended behavior,
   scope, acceptance criteria, product constraints, design reference, and requirement
   clarifications. Validate requirement assumptions with the owner and record the answers.
2. Research possible solutions and explore new approaches. Compare alternatives and document
   evidence, tradeoffs, costs, and the recommendation in the implementation plan. Define the
   technical decisions and clarifications, test strategy, and delivery steps; derive ordered
   tasks from that plan. Validate technical assumptions and obtain owner approval of the
   plan and its decisions before dependent implementation begins.
3. Create the dedicated feature branch using the approved naming convention. For each task,
   write the relevant tests first, observe the expected failure, implement, and verify success.
4. Update code documentation and operational instructions with each behavior change. Compare
   components against the approved design and retain acceptance evidence.
5. Split distinct logical changes into focused commits under Principle V. Write a descriptive
   Conventional Commits subject and a body covering the change, reason, validation and relevant
   task references. Before every commit, run the applicable fast local gates under Principle VI
   and validate the proposed commit message through the commit-msg hook. Commit only validated
   changes; retain enough detail to summarize the work and propose merge-request labels.
6. Before every push, run appropriate static/type validation and unit/integration tests on
   the state being pushed. Validate outgoing commit messages against the approved conventions.
   A new change invalidates earlier validation of the changed state.
7. Require independent CI validation of all mandatory merge gates, including production
   build and end-to-end browser tests, before changes merge into protected branches. Require
   passing CI checks for the exact deployment revision before publishing it to the website.
   For pipeline features, follow the guided, owner-built process in Principle VIII.
8. Review the feature against its specification, plan, tests, documentation, design, costs,
   and this constitution before declaring it complete.

## Governance

This constitution governs specifications, plans, tasks, implementation, review, and delivery.
Every specification and plan review MUST check compliance and identify unresolved decisions.
Feature completion reviews MUST include evidence for the applicable rules; unresolved
violations MUST block completion.

Amendments MUST document the proposed change, rationale, affected work, and any migration
steps. The project owner MUST approve amendments before they take effect. Conflicts or
requested exceptions MUST be resolved through an explicit amendment before affected work
proceeds; contributors MUST NOT override these rules informally.

Constitution versions MUST follow semantic versioning: MAJOR for incompatible principle
removals or redefinitions, MINOR for new principles or materially expanded guidance, and PATCH
for clarifications without a semantic change. Each amendment MUST update the version and
last-amended date and preserve the original ratification date once confirmed. The temporary
Sync Impact Report MUST be reviewed and removed before committing the constitution.

TODO(RATIFICATION_DATE): The owner must confirm the original adoption date. Version 1.0.0
records the initial rules supplied by the owner; the adoption date remains unconfirmed.

**Version**: 2.1.0 | **Ratified**: TODO(RATIFICATION_DATE) | **Last Amended**: 2026-10-17
