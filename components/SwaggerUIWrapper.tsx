'use client';

import dynamic from 'next/dynamic';
import { Component, ReactNode } from 'react';
import 'swagger-ui-react/swagger-ui.css';

// ── Error boundary to catch dynamic-import chunk failures ──────────────────
interface ErrorBoundaryState { hasError: boolean }

class SwaggerErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <p>Unable to load API documentation.</p>;
    }
    return this.props.children;
  }
}

// ── Dynamically import swagger-ui-react (browser-only) ─────────────────────
const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => <p>Loading API documentation...</p>,
});

// ── Public component ───────────────────────────────────────────────────────
export interface SwaggerUIWrapperProps {
  spec: Record<string, unknown>;
}

export default function SwaggerUIWrapper({ spec }: SwaggerUIWrapperProps) {
  return (
    <SwaggerErrorBoundary>
      <SwaggerUI spec={spec} />
    </SwaggerErrorBoundary>
  );
}
