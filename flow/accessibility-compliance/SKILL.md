---
name: accessibility-compliance
description: Implement WCAG 2.2 compliant interfaces with mobile accessibility, inclusive design patterns, and assistive technology support. Use when auditing accessibility, implementing ARIA patterns, building for screen readers, or ensuring inclusive user experiences.
---

# Accessibility Compliance

Master accessibility implementation to create inclusive experiences that work for everyone, including users with disabilities.

## When to Use This Skill

- Implementing WCAG 2.2 Level AA or AAA compliance
- Building screen reader accessible interfaces
- Adding keyboard navigation to interactive components
- Implementing focus management and focus trapping
- Creating accessible forms with proper labeling
- Supporting reduced motion and high contrast preferences
- Building mobile accessibility features (iOS VoiceOver, Android TalkBack)
- Conducting accessibility audits and fixing violations

## Agent Integration Rules

- For `ux-spec.md`, define accessibility and trust requirements at the task/state level: labels, error recovery, privacy, disabled/loading semantics, and non-color state meaning.
- For `wireframe-spec.md`, define structural accessibility: landmarks, reading order, keyboard path, focus movement, touch target requirements, and state announcements.
- For `visual-design-spec.md`, define visual accessibility: contrast, focus appearance, reduced motion, text sizing, and color-independent status treatment.
- For `layout.md`, define accessibility at the system layout level: template landmarks, skip/entry paths, navigation focus order, inspector/drawer/modal focus movement, keyboard path through list-detail/dashboard workspaces, state announcement placement, touch target policy, and non-color state cues.
- For HTML preview review, flag accessibility blockers as findings. Do not require running external audit tools unless the caller explicitly enables them.
- Do not introduce new UI controls only for accessibility. Adapt the controls already present in PRD/spec/UX/wireframe.

## Detailed patterns and worked examples

Detailed pattern documentation lives in `references/details.md`. Read that file when the navigation tier above is insufficient.

## Best Practices

1. **Use Semantic HTML**: Prefer native elements over ARIA when possible
2. **Test with Real Users**: Include people with disabilities in user testing
3. **Keyboard First**: Design interactions to work without a mouse
4. **Don't Disable Focus Styles**: Style them, don't remove them
5. **Provide Text Alternatives**: All non-text content needs descriptions
6. **Support Zoom**: Content should work at 200% zoom
7. **Announce Changes**: Use live regions for dynamic content
8. **Respect Preferences**: Honor prefers-reduced-motion and prefers-contrast

## Common Issues

- **Missing alt text**: Images without descriptions
- **Poor color contrast**: Text hard to read against background
- **Keyboard traps**: Focus stuck in component
- **Missing labels**: Form inputs without associated labels
- **Auto-playing media**: Content that plays without user initiation
- **Inaccessible custom controls**: Recreating native functionality poorly
- **Missing skip links**: No way to bypass repetitive content
- **Focus order issues**: Tab order doesn't match visual order

## Testing Tools

- **Automated**: axe DevTools, WAVE, Lighthouse
- **Manual**: VoiceOver (macOS/iOS), NVDA/JAWS (Windows), TalkBack (Android)
- **Simulators**: NoCoffee (vision), Silktide (various disabilities)
