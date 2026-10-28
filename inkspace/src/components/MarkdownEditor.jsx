import { useRef, useState } from "react";
import { Bold, Code, Heading2, Italic, Link2, List, Quote } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

const TOOLS = [
  { label: "Bold", icon: Bold, before: "**", after: "**", placeholder: "bold text" },
  { label: "Italic", icon: Italic, before: "*", after: "*", placeholder: "italic text" },
  { label: "Heading", icon: Heading2, before: "## ", after: "", placeholder: "Heading", block: true },
  { label: "Link", icon: Link2, before: "[", after: "](https://)", placeholder: "link text" },
  { label: "List", icon: List, before: "- ", after: "", placeholder: "List item", block: true },
  { label: "Quote", icon: Quote, before: "> ", after: "", placeholder: "Quote", block: true },
  { label: "Code", icon: Code, before: "`", after: "`", placeholder: "code" },
];

export default function MarkdownEditor({ value, onChange, hasError }) {
  const ref = useRef(null);
  const [mode, setMode] = useState("edit"); // used on mobile only

  const apply = (tool) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || tool.placeholder;
    const lead = tool.block && start > 0 && value[start - 1] !== "\n" ? "\n" : "";
    const inserted = lead + tool.before + selected + tool.after;

    onChange(value.slice(0, start) + inserted + value.slice(end));

    const selStart = start + lead.length + tool.before.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(selStart, selStart + selected.length);
    });
  };

  return (
    <div className="md-editor">
      <div className="editor-tabs" role="tablist" aria-label="Editor mode">
        <button
          type="button"
          className={`chip ${mode === "edit" ? "active" : ""}`}
          onClick={() => setMode("edit")}
          aria-pressed={mode === "edit"}
        >
          Edit
        </button>
        <button
          type="button"
          className={`chip ${mode === "preview" ? "active" : ""}`}
          onClick={() => setMode("preview")}
          aria-pressed={mode === "preview"}
        >
          Preview
        </button>
      </div>

      <div className="editor-layout">
        <div className={`editor-pane ${mode === "edit" ? "show" : ""}`}>
          <div className="toolbar-md" role="toolbar" aria-label="Formatting">
            {TOOLS.map(({ label, icon: Icon, ...tool }) => (
              <button
                key={label}
                type="button"
                className="icon-btn small"
                title={label}
                aria-label={label}
                onClick={() => apply({ label, ...tool })}
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
          <textarea
            ref={ref}
            id="content"
            className={`md-textarea ${hasError ? "invalid" : ""}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your story in Markdown..."
            aria-label="Markdown content"
            aria-invalid={hasError}
            spellCheck
          />
        </div>

        <div className={`editor-pane preview-pane ${mode === "preview" ? "show" : ""}`}>
          <div className="pane-label muted">Live preview</div>
          <div className="preview-scroll">
            {value.trim() ? (
              <MarkdownRenderer content={value} />
            ) : (
              <p className="muted">Nothing to preview yet. Start writing!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}