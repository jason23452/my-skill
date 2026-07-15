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
14. Responsive Visual Adaptation
15. Accessibility Contract
16. Representative PRD Visual Applications
17. Design Rule Traceability
18. Do And Do Not

`DESIGN.md` must not decide app shell, navigation, route composition, columns, region placement, master-detail, disclosure, scroll/sticky ownership, first-viewport spatial budgets, or responsive region topology. Those decisions belong to `layout.md`.

## Visual Direction Options

- All visual options use the same neutral evaluation DOM, region order, geometry, responsive frame, task, content, actions, and states.
- Options differ through typography, semantic color, spacing rhythm, density variants, surfaces, shape grammar, component/state appearance, icons/media/motif, motion, and accessibility treatment.
- A visual option is invalid if it changes shell, navigation, region placement, master-detail, disclosure, scroll/sticky, or responsive composition.
- Final `DESIGN.md` contains only the selected visual system and explicitly defers layout decisions.

## Layout Direction Options

- All layout options lock the selected `DESIGN.md` visual system and the same product/task/content/action/state invariants.
- Options differ materially in shell/navigation, scene composition, region grouping, visual-center placement, master-detail, progressive disclosure, density/action anchoring, scroll ownership, and responsive recomposition.
- Each option provides exact desktop/tablet/mobile geometry and a real high-fidelity preview using the selected DESIGN system.
- Final `layout.md` contains only the selected layout direction; unselected alternatives remain session preview artifacts only.

## layout.md

Use generated product-specific title text. The body section order is:

1. Product Layout Thesis
2. Evidence Scope And Boundaries
3. Selected Layout Direction
4. Global App Shell
5. Navigation And Wayfinding
6. Screen, Route, And Scene Matrix
7. Page Template System
8. Canonical Viewport Geometry
9. Region And Grid Contracts
10. First Viewport Budgets
11. Visual Center And Progressive Disclosure
12. Scroll, Sticky, And Overflow Ownership
13. Content Density And Data Presentation
14. Action Placement
15. State, Feedback, And Recovery Placement
16. Overlays, Inspectors, Drawers, And Modals
17. Responsive Layout System
18. Accessibility And Focus Flow
19. Layout Tokens
20. Representative PRD Screen Contracts
21. Layout Acceptance Tests
22. Layout Rule Traceability
23. Constraints And Anti-Patterns

For each screen family include desktop, tablet, mobile, entry, exit, exact geometry, ASCII spatial frames, first-viewport budget, visual center, primary action, state placement, scroll/sticky owner, and evidence IDs. Canonical decisions cannot remain as unresolved ranges or alternatives. Do not add empty page-template categories merely to make the document look complete.

## Preview Quality Contract

- Product previews open directly on one real, high-fidelity product scene. Additional screens/states use real navigation or scene controls and remain hidden until selected.
- Visual-options previews compare visual systems on one fixed neutral evaluation frame. Layout-options previews lock the selected visual system and compare spatial systems.
- Internal IDs, evidence, traceability, coverage, QA status, file paths, JSON/YAML, and design-document prose are never visible product UI.
- Mobile first viewport contains product context, the primary task object/decision, and the next action; filters or secondary chrome may not consume the complete first viewport.
- Technical rendering QA and visual quality review are separate. Visual approval requires a screenshot-based weighted score of at least 88/100, no hard blockers, hierarchy/composition/task focus/mobile each at least 8/10, and all other dimensions at least 7/10.
