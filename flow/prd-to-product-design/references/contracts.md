# Product Design Artifact Contracts

## design-context.md

Use this exact section order:

1. Document Scope And Sources
2. Product Definition And Outcomes
3. Evidence Ledger
4. Roles And Permission Boundaries
5. Domain Objects And Relationships
6. Capability And Acceptance Coverage
7. Critical Task Flows
8. Domain State Model
9. Content And Data Priority
10. Product Information Architecture
11. Screen Inventory And Families
12. Cross-Screen Relationships
13. Product Archetype And Design Consequences
14. Trust, Accessibility, And Responsive Constraints
15. Non-Goals And Forbidden Inventions
16. Assumptions, Unknowns, And Conflicts
17. Downstream Design Contract

The Evidence Ledger columns are `Evidence ID`, `Status`, `Source`, `Source locator`, `Statement`, and `Design impact`.

The capability coverage columns are `Capability ID`, `PRD/AC evidence`, `Role`, `Domain object`, `Task flow`, `Required screens`, `Required states`, and `Coverage status`.

## DESIGN.md

Use generated product-specific title text and retain YAML front matter. The body section order is:

1. Product Evidence And Experience Principles
2. Selected Visual Direction
3. Visual Decision Axes
4. External Reference Translation
5. Semantic Color System
6. Typography Roles
7. Density, Spacing, And Rhythm
8. Surface, Elevation, And Shape
9. Iconography, Media, And Product Motifs
10. Core Component System
11. Domain Component System
12. Domain State Language
13. Interaction And Motion
14. Global App Shell
15. Navigation And Wayfinding
16. Screen, Route, And Scene Matrix
17. Page Template And Region System
18. Canonical Viewport Geometry
19. Visual Center And Progressive Disclosure
20. Scroll, Sticky, Overflow, And Overlay Ownership
21. Responsive Recomposition
22. Accessibility And Focus Flow
23. Representative PRD Screen Contracts
24. Agent Implementation Directives
25. Design Acceptance Tests
26. Design Rule Traceability
27. Do And Do Not

For each screen family include desktop, tablet, mobile, entry, exit, exact geometry, first-viewport budget, visual center, primary action, state placement, scroll/sticky owner, overlays, focus return, and evidence IDs. Canonical decisions cannot remain as unresolved ranges or alternatives. Do not create a separate `layout.md`; this consolidated `DESIGN.md` is the single frontend design authority.

## Preview Quality Contract

- Product previews open directly on one real, high-fidelity product scene. Additional screens/states use real navigation or scene controls and remain hidden until selected.
- Option previews, when explicitly requested, compare complete directions against the same product evidence and required task/state coverage.
- Internal IDs, evidence, traceability, coverage, QA status, file paths, JSON/YAML, and design-document prose are never visible product UI.
- Mobile first viewport contains product context, the primary task object/decision, and the next action; filters or secondary chrome may not consume the complete first viewport.
- Technical rendering QA and visual quality review are separate. Visual approval requires a screenshot-based weighted score of at least 88/100, no hard blockers, hierarchy/composition/task focus/mobile each at least 8/10, and all other dimensions at least 7/10.
