---
name: analyze-feature-requests
description: Analyze multiple feature requests, customer asks, or stakeholder demands into problem themes, opportunities, priorities, risks, and requirements candidates. Use when input is a backlog, spreadsheet, notes, ADO items, or mixed request list rather than one clear requirement.
---

# Analyze Feature Requests

Adapted for this SDD flow from Pawel Huryn's Product Management skill "analyze-feature-requests".
Source: https://github.com/phuryn/pm-skills/tree/main/pm-product-discovery/skills/analyze-feature-requests

## Principle

Do not let requesters design the solution. Analyze opportunities and problems first, then requirements.

## Process

1. Understand product objective.
   - What outcome should prioritization support?

2. Normalize requests.
   - Extract requester, user, situation, requested solution, underlying need, evidence, and urgency.

3. Group into themes.
   - Group by user problem or job-to-be-done, not by UI component or implementation.

4. Score each theme qualitatively.
   - Impact: user value and users affected.
   - Effort: delivery and design complexity.
   - Risk: market, policy, data, permission, integration, or technical uncertainty.
   - Strategic alignment: relationship to product goals.

5. Produce top opportunities.
   - Rationale.
   - Alternative solution directions.
   - High-risk assumptions.
   - Minimal validation needed.

## SDD Output

When used by Requirements Agent, produce:

- `opportunityThemes`
- `prioritizedRequirementCandidates`
- `deferredOrRejectedRequests`
- `assumptions`
- `openQuestions`

The final requirements.md should not become a raw request list. It should describe the selected product opportunities and explicitly name non-goals/deferred themes.
