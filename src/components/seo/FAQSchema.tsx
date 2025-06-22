
import { useEffect } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
  pageType?: string;
}

const FAQSchema: React.FC<FAQSchemaProps> = ({ faqs, pageType = 'general' }) => {
  useEffect(() => {
    if (faqs.length === 0) return;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    let script = document.querySelector(`script[data-schema="faq-${pageType}"]`) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', `faq-${pageType}`);
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

    return () => {
      const schemaScript = document.querySelector(`script[data-schema="faq-${pageType}"]`);
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [faqs, pageType]);

  return null;
};

export default FAQSchema;
