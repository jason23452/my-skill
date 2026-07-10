# EARS Syntax

EARS means Easy Approach to Requirements Syntax. Use it to make requirements clear and testable.

## Patterns

```text
The system shall <action>.
When <trigger>, the system shall <response>.
While <state>, the system shall <action>.
While <state>, when <trigger>, the system shall <response>.
Where <feature enabled>, the system shall <action>.
```

## Use Cases

- Ubiquitous: always applies.
- Event-driven: triggered by an action or event.
- State-driven: applies while a state is true.
- Conditional: state plus trigger.
- Optional: feature flag or configuration path.

## Examples

```markdown
**FR-001: Add Item**
While the user has selected a valid item, when they click Add,
the system shall add the item and update the visible count.

**FR-002: Invalid Input**
When invalid input is submitted,
the system shall block submission and show a specific error message.
```
