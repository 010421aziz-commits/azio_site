import type { Metadata } from 'next';
import SwaggerUIWrapper from '@/components/SwaggerUIWrapper';
import { openapiSpec } from '@/lib/openapi-spec';

export const metadata: Metadata = {
  title: 'API Docs | Quran Academy',
};

export default function DocsPage() {
  return (
    <main>
      <SwaggerUIWrapper spec={openapiSpec as Record<string, unknown>} />
    </main>
  );
}
