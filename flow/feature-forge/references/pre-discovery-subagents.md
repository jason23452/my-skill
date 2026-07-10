# Pre-Discovery With Subagents

Use only when feature discovery needs technical facts before asking stakeholder questions.

## When To Use

- Feature spans three or more layers such as auth, database, UI, integration, or file handling.
- Codebase patterns are unknown.
- Security, privacy, or operational constraints could change the requirement.

## When Not To Use

- User Story stage only needs product discovery.
- The feature is single-slice and product behavior is the main unknown.
- The current agent permissions deny task or repo exploration.

## Pattern

1. Identify affected domains.
2. Launch read-only subagents where permitted.
3. Feed factual findings into `questionPlan` as constraints or risks.
4. Ask the user for decisions, not implementation guesses.
