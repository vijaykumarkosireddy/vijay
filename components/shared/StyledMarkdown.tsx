"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface StyledMarkdownProps {
  content: string
  className?: string
}

export default function StyledMarkdown({ content, className = "" }: StyledMarkdownProps) {
  return (
    <div className={`styled-markdown ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-4xl font-black mb-6 mt-8 title-reveal">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-bold mb-5 mt-7 text-gold">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-bold mb-4 mt-6 text-white/90">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xl font-bold mb-3 mt-5 text-white/80">{children}</h4>
          ),
          p: ({ children }) => <p className="mb-4 text-white/70 leading-relaxed">{children}</p>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:text-primary/80 underline decoration-primary/30 hover:decoration-primary transition-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="mb-4 ml-6 space-y-2 list-disc text-white/70">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 ml-6 space-y-2 list-decimal text-white/70">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent/40 pl-6 py-2 my-6 italic text-white/60 bg-accent/5 rounded-r-lg">
              {children}
            </blockquote>
          ),
          code: ({ className, children }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code className="bg-black/40 text-primary px-2 py-1 rounded text-sm font-mono border border-primary/20">
                  {children}
                </code>
              )
            }
            return (
              <code className="block bg-black/60 text-white/80 p-4 rounded-xl my-4 overflow-x-auto font-mono text-sm border border-white/10">
                {children}
              </code>
            )
          },
          pre: ({ children }) => <pre className="my-4">{children}</pre>,
          hr: () => <hr className="my-8 border-t border-border/20" />,
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ""}
              className="w-full rounded-2xl my-6 border border-white/10"
            />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse border border-white/10 rounded-lg">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-white/10 px-4 py-2 bg-white/5 font-bold text-gold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-white/10 px-4 py-2 text-white/70">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
