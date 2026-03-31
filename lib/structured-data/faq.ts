interface FAQItem {
  question: string
  answer: string
}

interface FAQStructuredData {
  "@context": string
  "@type": string
  mainEntity: Array<{
    "@type": string
    name: string
    acceptedAnswer: {
      "@type": string
      text: string
    }
  }>
}

export function generateFAQSchema(faqs: FAQItem[]): FAQStructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  }
}

export function generateFAQScript(faqs: FAQItem[]): string {
  const schema = generateFAQSchema(faqs)
  return JSON.stringify(schema, null, 2)
}
