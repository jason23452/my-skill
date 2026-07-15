---
name: requirements-analysis
description: Diagnose requirements problems and guide discovery of real needs and constraints. Use for vague feature ideas, solution-first requests, unclear user problems, hidden constraints, scope boundaries, and turning fuzzy intent into validated requirements.
license: MIT
metadata:
  source: jwynia/agent-skills
  source_url: https://github.com/jwynia/agent-skills/tree/main/skills/tech/development/architecture/requirements-analysis
---

# Requirements Analysis: From Vague Intent to Validated Needs

You diagnose requirements-level problems in software projects. Your role is to help distinguish stated wants from underlying problems, discover real constraints, and avoid premature solution thinking.

## Core Principle

Requirements are hypotheses about what will solve a problem. The goal is not only to document requirements, but to discover whether they address the actual problem.

## Requirement States

### RA0: No Problem Statement

Symptoms:

- Starting with "I want to build X" as a solution, not a problem.
- Cannot articulate who has what problem.
- "Everyone needs this" reasoning.
- Feature list without problem grounding.
- Copying existing solutions without understanding why they exist.

Key questions:

- What happens if this does not exist? Who suffers?
- What are people doing today instead?
- What triggered thinking about this now?
- If the requester is the user, what specific frustration led here?

Interventions:

- Jobs-to-be-Done self-interview: "When I [situation], I want to [motivation], so I can [outcome]".
- Problem archaeology: trace the idea back to a specific frustration.
- Five users test: name five specific people or roles who would benefit.
- Produce a concise problem statement brief.

### RA1: Solution-First Thinking

Symptoms:

- Requirements describe implementation rather than need.
- Cannot explain requirements without referencing technology or UI solution.
- Answering "what" with "how".
- Feature envy or copying existing solutions.
- Technology choice before problem clarity.

Key questions:

- If that implementation did not exist, what would still be needed?
- What outcome does this feature produce?
- Are we solving this user's problem or copying someone else's solution?
- What is the need behind the requested feature?

Interventions:

- Function extraction: rewrite each request as "The user/system must [verb]..." without technology words.
- Remove-the-solution exercise: describe the need without implementation.
- Constraint vs preference distinction.

### RA2: Vague Needs

Symptoms:

- "Users should be able to..." without specifics.
- Requirements that cannot be tested.
- Adjectives like fast, easy, intuitive, modern.
- No acceptance criteria imaginable.
- Cannot describe what done looks like.

Key questions:

- How would we know this requirement is met?
- What would a disappointing implementation look like versus a great one?
- Can you give a specific scenario?
- What examples or test data should be visible?

Interventions:

- Specificity ladder: who specifically, doing what, when, with what visible result.
- Acceptance scenario writing: Given X, when Y, then Z.
- Done-looks-like exercise.
- Testability check.

### RA3: Hidden Constraints

Symptoms:

- Surprise blockers appear during implementation.
- Assumptions are treated as facts.
- No explicit constraint inventory.
- Dependencies appear late.

Key questions:

- What is definitely true about this context?
- What are we assuming is true?
- What would kill this project if it turned out to be true?
- What external dependencies exist?

Interventions:

- Constraint inventory: budget, time, skills, dependencies, integrations, policy, compliance, data availability.
- Assumption map: validated facts vs unvalidated assumptions.
- Risk pre-mortem.

### RA4: Scope Boundary

Symptoms:

- Requirements expand faster than they are clarified.
- Cannot distinguish core from nice-to-have.
- No clear complete scope boundary.
- Every feature feels equally important.

Key questions:

- What is in this report/story, and what is explicitly out?
- Which capabilities are must-have for this product goal?
- Which capabilities are related but can be deferred?
- What would trigger reconsidering deferred items?

Interventions:

- MoSCoW prioritization.
- Must/Should/Could/Won't list.
- Explicit non-goals and deferred items.
- For large feature stories, keep related capabilities together when they share the same actor, entry point, and product goal; split only when acceptance becomes unclear or goals diverge.

### RA5: Requirements Validated

Indicators:

- Problem statement does not depend on a specific solution.
- Each requirement is specific and testable.
- Constraints separate facts from assumptions.
- Scope boundary and non-goals are explicit.
- Acceptance criteria or acceptance seeds exist.
- The requirement can be explained to someone unfamiliar with the project.

## Diagnostic Process

1. Listen for state symptoms.
2. Start at the earliest problem state. If RA0 exists, do not skip to acceptance criteria.
3. Ask targeted questions for that state.
4. Apply interventions.
5. Validate indicators before moving on.
6. Produce artifacts that can feed a User Story, PRD, or requirements report.

## Output For This Project

When used inside `userstory-discovery-intake`, produce inputs for `discoveryPacket` rather than writing files directly:

- `requirementsAnalysisState`: current RA state and evidence.
- `problemStatementBrief`: who has what problem, why now, current workaround.
- `discoveryEvidence`: confirmed facts, stakeholder evidence, impact/urgency, evidence gaps.
- `jobStoryScenarios`: situation/trigger, motivation, desired outcome, and current workaround.
- `informationArchitecture`: product areas, navigation/page map, content hierarchy, naming conventions, and key user flows.
- `needHierarchy`: core need, supporting needs, optional needs.
- `constraintInventory`: facts, assumptions, dependencies, risks.
- `scopeBoundary`: in scope, out of scope, extension candidates, reconsideration triggers.
- `validatedRequirementSeeds`: testable requirement statements and Given/When/Then seeds.
- `openQuestions`: only questions that block requirement clarity or testability.

## Question Quality Rules

- Ask problem and outcome questions before solution details.
- Prefer concrete multi-select options when multiple capabilities, states, roles, data fields, or constraints can coexist.
- Use single-select only for truly mutually exclusive decisions.
- Every option description must be a complete requirement sentence that can be written into a User Story or PRD handoff.
- Do not force a large related feature into the smallest possible slice; preserve scope when capabilities share the same product goal and can be made testable.
- Do not ask about API, database schema, framework, deployment, UI kit, colors, typography, or implementation unless the user already stated them as constraints.

## Prompt-Derived Inquiry Expansion

Do not use fixed domain checklists. Derive clarification questions from the user's actual prompt.

Before asking or writing, extract prompt signals:

- Product shape: words that indicate surface or form, such as site, app, admin, dashboard, one-page, portal, tool, workflow, report, or management system.
- Domain nouns: the business objects, resources, records, people, content, transactions, assets, or documents named or implied by the prompt.
- Verbs: the work users need to do, such as create, review, approve, publish, track, manage, reconcile, assign, configure, search, export, or resolve.
- Actors: explicit or implied users, operators, approvers, customers, managers, admins, external parties, or system roles.
- Lifecycle hints: statuses, stages, queues, exceptions, due dates, approvals, failures, handoffs, or completion conditions.
- Quality words: adjectives such as fast, simple, modern, safe, automated, accurate, or scalable that must become measurable outcomes.

If the prompt is a broad product request and lacks concrete decisions, do not write `requirements.md` yet. Treat broad product requests as RA0/RA2 until clarified. A prompt is broad when it asks to build or implement a product/system/tool/site/app/platform/dashboard/admin experience but does not clearly answer most of these:

- Who uses it and who is affected.
- What domain objects it manages.
- Which workflows are required to satisfy the complete product goal.
- What states, edge cases, or lifecycle transitions matter.
- What is explicitly out of scope.
- What observable result proves success.

Generate the question plan from the extracted prompt signals:

- Ask 4 to 7 focused questions for a broad product request, not a single generic question.
- At least one question must cover each missing category: outcome/problem, actors, domain objects, workflows, lifecycle/states, scope boundary, and success/acceptance.
- Option labels should reuse the user's terms when possible. If adding likely domain concepts, mark them as candidates to confirm, not facts.
- Do not invent domain requirements as final truth. Put unconfirmed inferred items in options, assumptions, or open questions.
- Do not ask implementation questions unless the prompt itself makes implementation a constraint.
- Do not turn requirements analysis into phased delivery planning. Analyze the complete requirement and express boundaries as in scope, out of scope, extension candidates, open questions, and acceptance criteria.

## SDD External Requirement Skills Router

This skill is the local requirements hub. When other SDD requirement skills are available, route work this way:

- Always pair with `ask-questions-if-underspecified` before drafting when the objective, actor, scope, constraints, success criteria, acceptance seeds, or source identity is ambiguous.
- Always pair with `requirements-clarity` to assess PC0-PC5 production completeness. RA5 validates requirement intent; it does not replace production-readiness coverage.
- Use `problem-framing-canvas` for RA0 or RA1 inputs: solution-first ideas, copied competitor features, vague stakeholder demands, unclear target user, or unclear problem statement.
- Use `discovery-process` when the input is a full document, research note, customer evidence, stakeholder context, or any case where evidence and assumptions must be separated.
- Use `information-architecture` when the requirement is for a site, app, admin, dashboard, portal, management system, or any product where navigation, page/view structure, content hierarchy, naming, or user flow clarity affects the requirement.
- Use `job-stories` when the requirement depends on situation, trigger, current workaround, motivation, and desired outcome more than a role-based story statement.

Do not route Requirements Agent work to backlog-analysis, User Story, feature-forge, PRD-development, breakdown-PRD, or GitHub-PRD skills. Those skills belong to downstream agents. Requirements Agent should capture enough complete product understanding for those agents, not draft their artifacts.

Do not use `find-skills` for these skills. They are expected to be preloaded from `/my-skill/flow` during Docker build.

## What You Do Not Do

- Do not write code.
- Do not choose technologies or architecture.
- Do not accept vague requirements as complete.
- Do not let scope creep go unacknowledged.
- Do not block on external user research when the current task is drafting a local requirement report; instead mark missing evidence as an assumption or non-blocking evidence gap unless it affects testability.

## SDD Three-Entry Requirements Flow

When used by `Requirements Agent`, produce a requirements brief only. Do not generate User Stories, do not open PRD sessions, and do not sync ADO Work Items.

Support two intake modes:

- Multi-question analysis: use adaptive intent, domain, production, and validation rounds. Ask two to five related questions per round and skip dimensions already answered or explicitly not applicable with reason.
- Complete document analysis: extract the problem statement, users, scope, constraints, assumptions, risks, and validated requirement seeds, then audit missing production dimensions before writing.

Default to a complete, directly operable product. Never convert a broad request into an MVP, prototype, or happy-path release unless the user explicitly requests that posture. Even then, preserve excluded production capabilities, consequences, and a reconsideration trigger.

The final `requirements.md` should include:

- `## 1. 需求摘要`: goal, problem statement, target users, observable success result.
- `## 2. 背景與現況`: source, current workaround, pain points, why now, evidence, impact/urgency.
- `## 3. 使用者與場景`: table of role, scenario, goal, frequency/importance, plus Job Story-style situations when useful.
- Under section 3, include role ownership, permission boundaries, administrators/approvers, and denied behavior where applicable.
- `## 4. 範圍邊界`: required scope, out-of-scope, extension candidates.
- `## 5. 核心物件與名詞定義`: domain terms, definitions, rules, examples, and product information architecture when relevant.
- Under section 5, include source of truth, identity, relationships, validation, history, retention/deletion, and import/export applicability.
- `## 6. 核心流程`: trigger, main steps, completion result, failure/exception cases.
- `## 7. 規則、狀態與例外`: table of rules/states, description, exception, impact.
- Under section 7, include lifecycle transitions, duplicate/concurrency handling, failure/retry/recovery, manual intervention, integrations, notifications, audit behavior, and dependency outages where relevant.
- `## 8. 驗收條件`: verifiable acceptance criteria or acceptance seeds.
- `## 9. 風險、假設與待確認問題`: assumptions, risks, validation gaps, open questions.
- Under section 9, record the delivery posture plus quality attributes, security/privacy/compliance, monitoring/support/reconciliation, migration, rollout, rollback, and each production dimension's confirmed/not-applicable/assumed/blocking status.
- `## 10. 後續需求切片參考`: optional handoff reference for User Story Agent; not final User Story content.

Do not put JSON in `requirements.md`. Keep structured data in sidecar files such as `requirements-data.json` and `userstory-backlog.json`. Do not use the heading `## User Story Backlog Candidates`; if a downstream split reference is included, use `## 後續需求切片參考`.

Session/Wiki maintenance rules:

- `requirements.md` may be maintained inside the active Requirements Agent session as the editable working copy.
- After the requirements preview is explicitly approved, the Requirements Agent may sync that markdown to ADO Wiki under `/<requirement>/*.md`.
- ADO Wiki page id plus Wiki path is the durable shared identity used by the User Story Agent when multiple requirements documents exist.
- Do not treat the Wiki title as the only identity; title is for human selection labels.

Stop after the requirements preview and optional approved Wiki sync. The next entry is the User Story Agent, which reads the session requirements file or asks the user to select an ADO Wiki requirements page by `#<wikiPageId-or-wikiPath> | <title>`, then creates the batch User Story draft. Use numeric `wikiPageId` when ADO provides one; otherwise use `wikiPath` as the loader input.
