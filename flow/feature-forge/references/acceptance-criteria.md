# Acceptance Criteria

## Given / When / Then Format

```markdown
### AC-001: [Scenario Name]
Given [context/precondition]
When [action taken]
Then [expected result]
```

## Scenario Types

- Happy path: valid state, valid action, success result.
- Error: invalid state or input, action, specific error or recovery result.
- Edge case: boundary condition, action, graceful handling.
- Authorization: user role, protected action, appropriate access result.
- Empty state: no data or unavailable content, action, useful fallback.
- Conflict: duplicate, stale state, concurrent change, resolution behavior.

## Quality Rules

- AC must be independently testable.
- AC must be objective pass/fail, not vague quality language.
- Success and failure should not be mixed in one AC.
- Test data is required when outcome depends on inputs, state, thresholds, permissions, or counts.
- Each AC should trace back to a User Story or PRD FR.

## Examples

```markdown
### AC-001: Successful Submission
Given an authenticated user has completed all required fields
When they submit the form
Then the system saves the record and shows a success confirmation

### AC-002: Missing Required Field
Given an authenticated user leaves a required field blank
When they submit the form
Then the system blocks submission and shows the field-level error message
```
