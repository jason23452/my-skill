#!/usr/bin/env python3
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET


def normalize_text(value):
    if value is None:
        return ""
    if isinstance(value, str):
        return re.sub(r"\s+", " ", value).strip()
    if isinstance(value, (int, float, bool)):
        return str(value)
    if isinstance(value, dict):
        for key in ("plain", "text", "content", "title"):
            text = normalize_text(value.get(key))
            if text:
                return text
    return ""


def natural_sort_key(name):
    return [int(part) if part.isdigit() else part for part in re.split(r"(\d+)", name)]


def sorted_names(names):
    return sorted(names, key=natural_sort_key)


def topic_title(topic):
    if not isinstance(topic, dict):
        return ""
    return normalize_text(topic.get("title") or topic.get("text") or topic.get("name"))


def topic_note(topic):
    if not isinstance(topic, dict):
        return ""
    notes = topic.get("notes") or topic.get("note") or topic.get("notesPlain")
    if isinstance(notes, dict):
        for key in ("plain", "text", "content"):
            text = normalize_text(notes.get(key))
            if text:
                return text
    return normalize_text(notes)


def topic_labels(topic):
    labels = topic.get("labels") if isinstance(topic, dict) else None
    if not isinstance(labels, list):
        return []
    return [normalize_text(item) for item in labels if normalize_text(item)]


def as_topics(value):
    if isinstance(value, list):
        return [item for item in value if isinstance(item, dict)]
    if isinstance(value, dict):
        if isinstance(value.get("topics"), list):
            return as_topics(value.get("topics"))
        if isinstance(value.get("topic"), dict):
            return as_topics(value.get("topic"))
        if topic_title(value) or value.get("children"):
            return [value]
    return []


def iter_json_children(topic):
    children = topic.get("children") if isinstance(topic, dict) else None
    if isinstance(children, list):
        for child in as_topics(children):
            yield child
    elif isinstance(children, dict):
        for key in ("attached", "detached", "summary", "boundaries", "relationships", "floating"):
            for child in as_topics(children.get(key)):
                yield child
        for child in as_topics(children.get("topics") or children.get("topic")):
            yield child
    for key in ("topics", "childrenTopics", "subTopics"):
        for child in as_topics(topic.get(key) if isinstance(topic, dict) else None):
            yield child


def render_json_topic(topic, output, depth=0):
    title = topic_title(topic) or normalize_text(topic.get("id") if isinstance(topic, dict) else "") or "Untitled topic"
    indent = "  " * depth
    output.append(f"{indent}- {title}")
    note = topic_note(topic)
    if note:
        output.append(f"{indent}  Note: {note}")
    labels = topic_labels(topic)
    if labels:
        output.append(f"{indent}  Labels: {', '.join(labels)}")
    for child in iter_json_children(topic):
        render_json_topic(child, output, depth + 1)


def extract_json_content(zf, name, output):
    data = json.loads(zf.read(name).decode("utf-8", "replace"))
    sheets = data if isinstance(data, list) else data.get("sheets") or data.get("root") or [data]
    if not isinstance(sheets, list):
        sheets = [sheets]
    for index, sheet in enumerate([item for item in sheets if isinstance(item, dict)], 1):
        title = normalize_text(sheet.get("title") or sheet.get("name")) or f"Sheet {index}"
        output.append(f"\n## Sheet {index}: {title}")
        root = sheet.get("rootTopic") or sheet.get("root_topic") or sheet.get("topic") or sheet.get("root")
        if isinstance(root, dict):
            render_json_topic(root, output)
        for topic in as_topics(sheet.get("floatingTopics") or sheet.get("floating_topics")):
            output.append("\n### Floating Topic")
            render_json_topic(topic, output)


def xml_local_name(tag):
    return str(tag).split("}")[-1].lower()


def xml_direct_text(node, names):
    for child in list(node):
        if xml_local_name(child.tag) in names:
            text = "".join(child.itertext())
            text = normalize_text(text)
            if text:
                return text
    return ""


def render_xml_topic(topic, output, depth=0):
    indent = "  " * depth
    title = xml_direct_text(topic, {"title"}) or normalize_text(topic.get("title")) or normalize_text(topic.get("id")) or "Untitled topic"
    output.append(f"{indent}- {title}")
    note = xml_direct_text(topic, {"notes", "plain"})
    if note and note != title:
        output.append(f"{indent}  Note: {note}")
    for child in list(topic):
        if xml_local_name(child.tag) == "children":
            for topics in list(child):
                if xml_local_name(topics.tag) == "topics":
                    for nested in list(topics):
                        if xml_local_name(nested.tag) == "topic":
                            render_xml_topic(nested, output, depth + 1)


def extract_xml_content(zf, name, output):
    root = ET.fromstring(zf.read(name))
    sheets = [node for node in root.iter() if xml_local_name(node.tag) == "sheet"]
    if not sheets:
        sheets = [root]
    for index, sheet in enumerate(sheets, 1):
        title = xml_direct_text(sheet, {"title"}) or normalize_text(sheet.get("title")) or f"Sheet {index}"
        output.append(f"\n## Sheet {index}: {title}")
        for topic in list(sheet):
            if xml_local_name(topic.tag) == "topic":
                render_xml_topic(topic, output)


def extract_xmind(path):
    output = []
    with zipfile.ZipFile(path) as zf:
        names = zf.namelist()
        json_candidates = [name for name in names if name.endswith("content.json") or name.endswith("/content.json")]
        xml_candidates = [name for name in names if name.endswith("content.xml") or name.endswith("/content.xml")]
        if json_candidates:
            extract_json_content(zf, sorted_names(json_candidates)[0], output)
        elif xml_candidates:
            extract_xml_content(zf, sorted_names(xml_candidates)[0], output)
        else:
            raise ValueError("No content.json or content.xml found in XMind package")
    return "\n".join(output).strip()


def main():
    if len(sys.argv) < 2:
        print("Usage: extract_xmind.py <file.xmind> [max_chars]", file=sys.stderr)
        return 2
    max_chars = int(sys.argv[2]) if len(sys.argv) > 2 and str(sys.argv[2]).isdigit() else 120000
    text = extract_xmind(sys.argv[1])
    if len(text) > max_chars:
        text = text[:max_chars] + "\n[truncated]"
    print(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
