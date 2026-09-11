import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders a post's Markdown body inside the house prose styling. Raw HTML is
 * deliberately NOT enabled (no rehype-raw), so nothing a writer types can
 * inject markup or script — react-markdown escapes it. Used by both the public
 * post page and the editor's live preview, so the two always agree.
 */
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-house">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
