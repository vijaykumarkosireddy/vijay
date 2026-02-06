"use client"

interface FAQItem {
  question: string
  answer: string
}

interface FAQSchemaProps {
  faqs: FAQItem[]
}

export default function FAQSchema({ faqs }: FAQSchemaProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Accordion component for FAQ display
export function FAQAccordion({ faqs }: FAQSchemaProps) {
  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <details
          key={index}
          className="glass rounded-2xl p-6 group hover:border-gold/30 transition-all"
        >
          <summary className="font-bold text-white cursor-pointer list-none flex items-center justify-between">
            <span>{faq.question}</span>
            <svg
              className="w-5 h-5 text-gold transition-transform group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>
          <p className="mt-4 text-foreground/70 leading-relaxed">{faq.answer}</p>
        </details>
      ))}
    </div>
  )
}
