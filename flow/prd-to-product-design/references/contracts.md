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
2. Selected Design Direction
3. Composition And Visual Decision Axes
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
14. Responsive Visual Behavior
15. Accessibility Contract
16. Representative PRD Applications
17. Design Rule Traceability
18. Do And Do Not

## layout.md

Use generated product-specific title text. The body section order is:

1. Product Layout Thesis
2. Evidence Scope And Boundaries
3. Selected Direction Composition Anchors
4. Global App Shell
5. Navigation And Wayfinding
6. Screen Inventory And Route Relationships
7. Page Template System
8. Region And Grid Contracts
9. Visual Center And Progressive Disclosure
10. Content Density And Data Presentation
11. Action Placement
12. State, Feedback, And Recovery Placement
13. Overlays, Inspectors, Drawers, And Modals
14. Responsive Layout System
15. Accessibility And Focus Flow
16. Layout Tokens
17. Representative PRD Screen Contracts
18. Layout Rule Traceability
19. Constraints And Anti-Patterns

For each screen family include desktop, tablet, mobile, entry, exit, primary action, state placement, and evidence IDs. Do not add empty page-template categories merely to make the document look complete.

## Preview Quality Contract

- Product previews open directly on one real, high-fidelity product scene. Additional screens/states use real navigation or scene controls and remain hidden until selected.
- Internal IDs, evidence, traceability, coverage, QA status, file paths, JSON/YAML, and design-document prose are never visible product UI.
- Mobile first viewport contains product context, the primary task object/decision, and the next action; filters or secondary chrome may not consume the complete first viewport.
- Technical rendering QA and visual quality review are separate. Visual approval requires a screenshot-based weighted score of at least 88/100, no hard blockers, hierarchy/composition/task focus/mobile each at least 8/10, and all other dimensions at least 7/10.
