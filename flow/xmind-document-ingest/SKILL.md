---
name: xmind-document-ingest
description: Parse XMind .xmind mind map files into readable Markdown/text for requirements, information architecture, User Story, PRD, and planning workflows. Use whenever the user uploads, attaches, mentions, or asks to read .xmind, XMind, mind map, sitemap, IA map, or brainstorm map files, especially before requirements or product-document generation.
allowed-tools:
  - Bash(python *)
  - Bash(python3 *)
  - Bash(py *)
---

# XMind Document Ingest

Use this skill when XMind mind map content must become model-readable text. OpenCode/model file parts do not reliably support the raw `application/vnd.xmind.workbook` media type, so parse the `.xmind` zip package first and pass extracted topics as text context.

## Workflow

1. If the input is a `.xmind` file or has MIME `application/vnd.xmind.workbook` / `application/xmind`, extract it with the bundled script:

```bash
python <skill-base-dir>/scripts/extract_xmind.py <file.xmind> 120000
```

2. Use the script stdout as Markdown/text context for the task.

3. Do not forward the raw XMind file as an OpenCode `file` part unless the host application explicitly supports that media type. Prefer extracted text to avoid unsupported media errors.

## Output Shape

The script emits one section per sheet and a nested bullet list for topics:

```text
## Sheet 1: Product IA
- Root topic
  - Child topic
  - Another child
```

Notes and labels are included under the topic when available.

## Supported XMind Variants

- XMind Zen / modern `.xmind` packages with `content.json`
- Older XML-based packages with `content.xml`
- Nested `children.attached`, `children.detached`, `topics`, `topic`, and floating topics where present

The parser uses Python standard library only.
