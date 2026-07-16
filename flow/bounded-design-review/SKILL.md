---
name: bounded-design-review
description: Enforce deterministic, hash-bound, non-looping review for Product Design visual options, layout options, and rendered scene matrices. Use whenever Project Flow generates, repairs, reviews, resumes, or validates DESIGN/layout/HTML preview artifacts.
---

# Bounded Design Review

Use this skill with the Project Flow review tools. Quality criteria come from the owning product-design, responsive, accessibility, and review skills; this skill owns orchestration integrity.

## Non-Negotiable Model

1. Initialize one review cycle per Project Flow session and frontend product.
2. Read persisted cycle state before dispatching a writer, repair, or reviewer.
3. Bind every matrix and report to the exact source artifact SHA-256.
4. Use `run-design-review-matrix` as the only browser owner.
5. Use one complete matrix per artifact revision. Writers and reviewers consume the same manifest and screenshots.
6. Use the fixed transition `initial review -> one repair batch at most -> post-batch review -> passed or terminal_blocked`.
7. A terminal block requires an explicit new Project Flow session. Never silently start another repair.

Do not implement these limits only in prose. `manage-design-review-cycle` is authoritative for state, idempotency, repair count, selection readiness, and resume behavior.

## Writer Contract

- Generate or repair the complete artifact once.
- Include stable `data-review-*` controls and regions in option previews; rendered previews use `data-design-scene`, `data-design-scene-target`, and `data-review-region` on major composition regions.
- Call the shared matrix tool once after persistence.
- Do not create ad hoc Playwright scripts, inspect target-project dependencies, search alternate roots, or make internal correction passes.
- For batch repair, consume the complete persisted review JSON and cover every issue ID in one coordinated change.

## Reviewer Contract

- Verify cycle, attempt, source hashes, profile, cells, screenshots, and manifest completeness.
- Inspect every screenshot and merge deterministic findings with the owning qualitative rubric.
- Persist the complete matrix, scores, issues, repair requirements, acceptance checks, regression cells, and verdict to attempt-specific reports. Never overwrite an initial report with post-repair evidence.
- Record the review result in cycle state before responding.
- Return only compact routing metadata. Never copy the full report into the task response.

## Final Product Review

For `screen-preview.html`, generate one scene x desktop/tablet/mobile matrix. Technical QA, visual quality, and contract review share it. Merge all three reports before any repair. Run every affected owner once in dependency order, regenerate downstream artifacts once, then perform one post-batch review set. A second failure is terminal.

## Interruption And Resume

- When state says `review_running`, first inspect the attempt-specific Markdown/JSON reports. If both are complete and match the matrix hash, call `complete-review` directly from their persisted verdict; do not dispatch the reviewer again.
- If either report is absent or incomplete, call `resume-review` once and re-dispatch the same direction reviewer, or the same final review set and aggregate, with the same attempt, matrix, and output paths. Do not call `begin-review` again.
- `resume-review` permits one interrupted-task recovery per attempt. If that resumed task or final review set is interrupted too, stop with `DESIGN_REVIEW_INTERRUPTED`; never start another reviewer or repair.
- If a report and completed state exist, resume from state even when the previous task response was interrupted.
- Never reuse screenshots or manifests from another cycle, attempt, profile, or artifact hash.
- Missing platform Playwright is an infrastructure block and does not trigger product artifact repair.
