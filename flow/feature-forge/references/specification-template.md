# Specification Template

Use this as a structure reference. The local `prd` and `breakdown-feature-prd` skills still define the final Chinese document shape.

```markdown
# Feature: [Name]

## Overview
[Feature value and target user]

## Functional Requirements

### FR-001: [Requirement Name]
While <precondition>, when <trigger>, the system shall <response>.

## Non-Functional Requirements

- Performance:
- Security:
- Privacy:
- Accessibility:
- Reliability:

## Acceptance Criteria

### AC-001: [Scenario Name]
Given [context]
When [action]
Then [expected result]

## Error Handling

| Error Condition | User-Visible Result | Recovery |
| --- | --- | --- |
| Invalid input | Specific field error | User can correct and retry |

## Out of Scope

- [Explicit non-goal]

## Open Questions

- [Blocking or non-blocking decision]
```
