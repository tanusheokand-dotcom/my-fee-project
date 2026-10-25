import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

// react-markdown does not render raw HTML by default, and rehype-sanitize
// adds a second layer of protection against XSS.
export default function MarkdownRenderer({ content }) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
      >
        {content || ""}
      </ReactMarkdown>
    </div>
  );
}