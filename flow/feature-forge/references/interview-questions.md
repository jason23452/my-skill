# Interview Questions

## PM Hat Questions

Focus on user value and business goals.

| Area | Questions |
| --- | --- |
| Problem | What problem does this solve? Who experiences it? How often? |
| Users | Who are the target users? What are their goals and context? |
| Value | How will users benefit? What business result changes? |
| Scope | What is in scope? What is explicitly out of scope? MVP vs later? |
| Success | How will success be measured or demonstrated? |
| Priority | Is this must-have, should-have, or nice-to-have? |

## Dev Hat Questions

Focus on feasibility, constraints, and edge cases without turning discovery into implementation design.

| Area | Questions |
| --- | --- |
| Integration | What existing systems, workflows, data sources, or dependencies are affected? |
| Security | Who can access this? Any sensitive data, PII, privacy, or audit concerns? |
| Performance | What volume, latency, or concurrency expectations matter to acceptance? |
| Edge Cases | What happens for empty states, invalid input, duplicates, conflicts, dependency failures, or limits? |
| Data | What user-visible data is created, updated, retained, hidden, or deleted? |
| Recovery | How should users understand and recover from failure? |

## QuestionPlan Usage

Use structured options when answers are finite:

- Priority: must-have, should-have, nice-to-have.
- Scope: MVP, full version, phased.
- Format or channel choices.
- Permission and visibility behavior.
- Error handling behavior.
- Empty, invalid, duplicate, conflict, or unavailable states.

Use open-ended questions only for unbounded answers:

- Describe the user journey.
- What problem does this solve?
- What current workflow is being replaced?

## Interview Flow

1. Discovery: problem, users, value.
2. Details: journey, scope, constraints.
3. Edge cases: failures, limits, security, permissions.
4. Validation: confirm AC and trade-offs.

Each question must map to a specific field such as `actor`, `entryPoint`, `visibleOutcome`, `FR-01.Trigger`, `FR-01.Failure / Boundary`, `AC-02.Test Data`, `Non-Goals`, or `Risks`.
