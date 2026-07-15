---
name: frontend-design-review
description: >
  Review and create distinctive, production-grade frontend interfaces with high design quality and design system compliance.
  Evaluates using three pillars: frictionless insight-to-action, quality craft, and trustworthy building.
  USE FOR: PR reviews, design reviews, accessibility audits, design system compliance checks, creative frontend design,
  UI code review, component reviews, responsive design checks, theme testing, and creating memorable UI.
  DO NOT USE FOR: Backend API reviews, database schema reviews, infrastructure or DevOps work, pure business logic
  without UI, or non-frontend code.
---

# Frontend Design Review

Review UI implementations against design quality standards and your design system **OR** create distinctive, production-grade frontend interfaces from scratch.

## Two Modes

### Mode 1: Design Review
Evaluate existing UI for design system compliance, three quality pillars (Frictionless, Quality Craft, Trustworthy), accessibility, and code quality.

### Mode 2: Creative Frontend Design
Create distinctive interfaces that avoid generic "AI slop" aesthetics, have clear conceptual direction, and execute with precision.

---

## Creative Frontend Design

Before coding, commit to an aesthetic direction:
- **Purpose**: What problem does this solve? Who uses it?
- **PRD Evidence Fit**: Which product archetype, user decision, information object, interaction surface, or trust/density requirement makes this direction appropriate?
- **Tone**: minimal, maximalist, retro-futuristic, organic, luxury, playful, editorial, brutalist, art deco, soft/pastel, industrial, etc.
- **Constraints**: Framework, performance, accessibility requirements.
- **Differentiation**: What makes this distinctive and context-appropriate?

### DESIGN And Layout Ownership Gate

- `DESIGN.md` owns typography, semantic color, spacing rhythm, density variants, surfaces, shape, component/state appearance, icons/media/motif, motion, and accessibility. Visual options must use one identical neutral evaluation layout.
- `layout.md` owns shell, navigation, route/scene composition, region geometry, visual-center placement, master-detail, disclosure, scroll/sticky, first-viewport budgets, and responsive recomposition. Layout options must lock the selected DESIGN system.
- Block visual options that differ through layout. Block layout options that differ through visual styling. Do not merge the two user selection gates.

### High-Fidelity Product UI Gate

Before creating or approving UI, verify the first viewport looks like a real product surface instead of a generated presentation page:

- Brand fingerprint is visible and traceable to PRD/spec evidence.
- One product-specific visual motif carries domain meaning, not decoration only.
- Primary scene has a clear visual center; secondary states are compressed into rails, inspectors, panels, strips, or insets.
- Color usage has dominant/support/accent/status roles; selected, active, focus, danger, success, warning, and error are not all the same accent.
- Typography has a deliberate posture through scale, weight, case, letter spacing, tabular numbers, and label treatment.
- Surface system has meaningful levels; cards do not all share the same radius, padding, border, and shadow.
- Mobile is recomposed for the primary task, not a scaled desktop mockup.
- Only one real product scene is visible at a time. Additional screens and states use product navigation or scene controls instead of a coverage wall.
- Internal screen/evidence/PRD/AC IDs, traceability, QA status, artifact paths, JSON/YAML, and design-document prose are absent from visible product UI.
- The mobile first viewport includes product context, the primary task object or decision, and its next action; filters and chrome do not consume the whole viewport.

Block or regenerate if the UI is mostly generic KPI cards + filter + table, equal-card grids, purple/blue glow SaaS defaults, strategy-document sections, decorative bento, fake charts without product evidence, placeholder bars, lorem ipsum, or filler copy such as `Project Alpha`, `Metric 1`, and `Sample item`.

### Screenshot Score Gate

For final approval, inspect actual desktop, tablet, and mobile screenshots. Score 0-10 for visual hierarchy, composition craft, task focus, product specificity, typography/rhythm, surface/component craft, responsive recomposition, and polish/trust/accessibility. Use weights `15/15/15/10/10/10/15/10`. Pass only at 88/100 or higher, with hierarchy/composition/task focus/responsive each at least 8, every other dimension at least 7, and no hard blocker. Technical rendering success, long specifications, or complete token files do not raise this score.

### Aesthetics Guidelines

- **Typography**: Distinctive type treatment that elevates aesthetics. Pair a display font with a refined body font when assets allow; when external fonts are unavailable, use system stacks with deliberate scale, weight, case, letter spacing, tabular numbers, and label treatment. Avoid default Inter/Roboto/Arial/Space Grotesk posture unless the product evidence supports neutral utility.
- **Color & Theme**: Cohesive palette with CSS variables. Dominant colors + sharp accents > timid, evenly-distributed palettes.
- **Motion**: CSS-only preferred. One well-orchestrated page load with staggered reveals > scattered micro-interactions.
- **Spatial Composition**: Asymmetry, overlap, diagonal flow, grid-breaking elements, generous negative space OR controlled density.
- **Backgrounds**: Gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, grain overlays.

**AVOID**: Overused fonts, cliched color schemes, predictable layouts, cookie-cutter design without context-specific character. Do not reject hero, dashboard, health-check, wizard, timeline, inspector, or canvas patterns by name; reject them only when they appear without product evidence or without transformation into a product-specific composition.

Match implementation complexity to vision. Maximalist = elaborate code. Minimalist = restraint and precision.

---

## Design Review

### Design System Workflow

**Before implementing:**
1. Review component in your Storybook / component library for API and usage
2. Use Figma Dev Mode to get exact specs (spacing, tokens, properties)
3. Implement using design system components + design tokens

**During review:**
1. Compare implementation to Figma design
2. Verify design tokens are used (not hardcoded values)
3. Check all variants/states are implemented correctly
4. Flag deviations (needs design approval)

**If component doesn't exist:**
1. Check if existing component can be adapted
2. Reach out to design for new component creation
3. Document exception and rationale in code

### Review Process

1. Identify user task
2. Check design system for matching patterns
3. Evaluate aesthetic direction
4. Check PRD evidence fit: palette, layout pattern, density, and interaction model should trace back to the product task rather than a default scaffold.
5. Identify scope (component, feature, or flow)
6. Evaluate each pillar
7. Score and prioritize issues (blocking/major/minor)
8. Provide recommendations with design system examples

### Core Principles

- **Task completion**: Minimum clicks. Every screen answers "What can I do?" and "What happens next?"
- **Action hierarchy**: 1-2 primary actions per view. Progressive disclosure for secondary.
- **Onboarding**: Explain features on introduction. Smart defaults over configuration.
- **Navigation**: Clear entry/exit points. Back/cancel always available. Breadcrumbs for deep flows.

---

## Quality Pillars

### 1. Frictionless Insight to Action

**Evaluate:** Task completable in ≤3 interactions? Primary action obvious and singular?

**Red flags:** Excessive clicks, multiple competing primary buttons, buried actions, dead ends.

### 2. Quality is Craft

**Evaluate:**
- Design system compliance: matches Figma specs, uses design tokens
- Aesthetic direction: distinctive typography, cohesive colors, intentional motion
- Accessibility: Grade C minimum (WCAG 2.1 A), Grade B ideal (WCAG 2.1 AA)

**Red flags:** Generic AI aesthetics, missing brand fingerprint, decorative motif without product meaning, hardcoded values, implementation doesn't match Figma, broken reflow, missing focus indicators, palette only changes button color, uniform card radius/shadow/padding across every surface.

### 3. Trustworthy Building

**Evaluate:**
- AI transparency: disclaimer on AI-generated content
- Error transparency: actionable error messages

**Red flags:** Missing AI disclaimers, opaque errors without guidance.

---

## Review Output Format

See [references/review-output-format.md](references/review-output-format.md) for the full review template.

## Review Type Modifiers

See [references/review-type-modifiers.md](references/review-type-modifiers.md) for context-specific review focus areas (PR, Creative, Design, Accessibility).

## Quick Checklist

See [references/quick-checklist.md](references/quick-checklist.md) for the pre-approval checklist covering design system compliance, aesthetic quality, frictionless, quality craft, and trustworthy pillars.

## Pattern Examples

See [references/pattern-examples.md](references/pattern-examples.md) for good/bad examples of creative frontend and design system review work.

---

## Acknowledgments

Creative frontend principles inspired by [Anthropic's frontend-design skill](https://github.com/anthropics/skills/tree/main/skills/frontend-design). Design review principles and quality pillar framework created by [@Quirinevwm](https://github.com/Quirinevwm) for systematic UI evaluation.
