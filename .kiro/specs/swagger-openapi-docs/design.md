# Design Document

## Feature: swagger-openapi-docs

### Overview

This design adds interactive Swagger/OpenAPI 3.0 documentation to the Quran Academy Next.js 15 App Router project. The feature consists of four coordinated pieces:

1. **`lib/openapi-spec.ts`** — a static TypeScript object describing all 24 API operations
2. **`components/SwaggerUIWrapper.tsx`** — a `'use client'` component that dynamically imports `swagger-ui-react` to satisfy its browser-only DOM requirements
3. **`app/docs/page.tsx`** — a Next.js Server Component that guards access via `qa_token` JWT cookie verification, then renders `SwaggerUIWrapper`
4. **`middleware.ts`** — verified to already exclude `/docs` from its matcher; no changes needed

---

## Architecture

```
Browser
  │
  ▼
GET /docs
  │
  ▼
Next.js Server Component  ◄── cookies() from next/headers
app/docs/page.tsx
  │
  ├── qa_token absent or invalid ──► redirect('/dashboard/login')
  │
  └── qa_token valid
        │
        ▼
      Render <SwaggerUIWrapper spec={openapiSpec} />
        │  (passed as a serializable prop)
        ▼
      components/SwaggerUIWrapper.tsx  ('use client')
        │  dynamic import swagger-ui-react (ssr: false)
        │
        ▼
      <SwaggerUI spec={...} />    (browser-only, no SSR)
        │
        └── reads from lib/openapi-spec.ts (imported at page level)
```

The middleware matcher `/dashboard/((?!login).*)` only matches paths that start with `/dashboard/`, so `/docs` is never intercepted by `middleware.ts`. The page handles its own auth entirely on the server before any client payload is sent.

---

## Components

### 1. `lib/openapi-spec.ts`

A plain TypeScript module exporting a single constant `openapiSpec`. It has no runtime dependencies and can be statically analyzed. The type comes from the `openapi-types` package (already pulled in transitively by many toolchains; if not present, types are declared inline as `Record<string, unknown>` and asserted).

Key sections:

| Section | Contents |
|---|---|
| `openapi` | `"3.0.3"` |
| `info` | `title: "Quran Academy API"`, `version: "1.0.0"` |
| `servers` | `[{ url: "/api" }]` |
| `components.securitySchemes` | `cookieAuth` — apiKey in cookie `qa_token` |
| `components.schemas` | `Teacher`, `Program`, `Gallery`, `News`, `Contact`, `Message`, `Setting`, `ErrorResponse` |
| `paths` | 24 operations across 14 route groups |

**Path groups and operations:**

| Path | Methods |
|---|---|
| `/login` | POST (public) |
| `/logout` | POST (public) |
| `/contact` | POST (public) |
| `/contacts` | GET (public), PUT (protected) |
| `/teachers` | GET (public), POST (protected) |
| `/teachers/{id}` | PUT (protected), DELETE (protected) |
| `/programs` | GET (public), POST (protected) |
| `/programs/{id}` | PUT (protected), DELETE (protected) |
| `/gallery` | GET (public), POST (protected) |
| `/gallery/{id}` | PUT (protected), DELETE (protected) |
| `/news` | GET (public), POST (protected) |
| `/news/{id}` | PUT (protected), DELETE (protected) |
| `/settings` | GET (protected), PUT (protected) |
| `/upload` | POST (protected) |

**Protected operations** carry `security: [{ cookieAuth: [] }]` and include a `401` response. Every mutating operation (POST, PUT, DELETE) includes a `400` response.

### 2. `components/SwaggerUIWrapper.tsx`

```typescript
'use client';

import dynamic from 'next/dynamic';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => <p>Loading API documentation...</p>,
});

interface SwaggerUIWrapperProps {
  spec: Record<string, unknown>;
}

export default function SwaggerUIWrapper({ spec }: SwaggerUIWrapperProps) {
  // CSS import happens inside the dynamic module; alternatively imported here:
  // import 'swagger-ui-react/swagger-ui.css';
  return (
    <div>
      <SwaggerUI spec={spec} />
    </div>
  );
}
```

Because `swagger-ui-react` uses browser globals (`window`, `document`) at module initialization, it must never execute on the server. `dynamic(..., { ssr: false })` defers the import entirely to the browser bundle. The CSS is imported within the component file so it bundles correctly with the client chunk.

A try/catch at the dynamic import level (via the `loading` and error boundary pattern) renders `"Unable to load API documentation."` if the chunk fails to load.

### 3. `app/docs/page.tsx`

A Server Component — no `'use client'` directive. Execution flow:

```
1. await cookies()                       // next/headers, requires dynamic rendering
2. read token = cookieStore.get('qa_token')?.value
3. if (!token) → redirect('/dashboard/login')
4. try { await jwtVerify(token, key) }
   catch { → redirect('/dashboard/login') }
5. return <SwaggerUIWrapper spec={openapiSpec as Record<string,unknown>} />
```

`export const metadata` provides the `<title>` without a layout change. The `openapiSpec` object is imported from `lib/openapi-spec.ts` and passed as a prop — it is a plain serializable object, so no client boundary issues arise.

**Important:** `export const dynamic = 'force-static'` must NOT be used; `cookies()` requires dynamic rendering (this is Next.js 15's default for Server Components that call `cookies()`).

### 4. `middleware.ts` (no change)

The existing matcher `/dashboard/((?!login).*)` uses a prefix anchored to `/dashboard/`. The string `/docs` does not begin with `/dashboard/`, so it is never matched. No modification is needed; the file is left untouched.

---

## Data Models

### Schema definitions (components/schemas)

Derived directly from `prisma/schema.prisma`:

**Teacher**
```json
{
  "type": "object",
  "required": ["id", "name", "position", "order", "active", "createdAt"],
  "properties": {
    "id":        { "type": "string" },
    "name":      { "type": "string" },
    "position":  { "type": "string" },
    "bio":       { "type": "string" },
    "image":     { "type": "string" },
    "order":     { "type": "integer" },
    "active":    { "type": "boolean" },
    "createdAt": { "type": "string", "format": "date-time" }
  }
}
```

**Program**
```json
{
  "type": "object",
  "required": ["id", "title", "description", "icon", "topics", "order", "active"],
  "properties": {
    "id":          { "type": "string" },
    "title":       { "type": "string" },
    "description": { "type": "string" },
    "icon":        { "type": "string" },
    "topics":      { "type": "array", "items": { "type": "string" } },
    "order":       { "type": "integer" },
    "active":      { "type": "boolean" }
  }
}
```

**Gallery**
```json
{
  "type": "object",
  "required": ["id", "image", "order", "createdAt"],
  "properties": {
    "id":        { "type": "string" },
    "image":     { "type": "string" },
    "caption":   { "type": "string" },
    "alt":       { "type": "string" },
    "order":     { "type": "integer" },
    "createdAt": { "type": "string", "format": "date-time" }
  }
}
```

**News**
```json
{
  "type": "object",
  "required": ["id", "title", "slug", "excerpt", "content", "published", "createdAt"],
  "properties": {
    "id":          { "type": "string" },
    "title":       { "type": "string" },
    "slug":        { "type": "string" },
    "excerpt":     { "type": "string" },
    "content":     { "type": "string" },
    "image":       { "type": "string" },
    "published":   { "type": "boolean" },
    "publishedAt": { "type": "string", "format": "date-time" },
    "createdAt":   { "type": "string", "format": "date-time" }
  }
}
```

**Contact**
```json
{
  "type": "object",
  "required": ["id", "address", "phone", "instagram", "updatedAt"],
  "properties": {
    "id":        { "type": "string" },
    "address":   { "type": "string" },
    "phone":     { "type": "string" },
    "instagram": { "type": "string" },
    "mapUrl":    { "type": "string" },
    "updatedAt": { "type": "string", "format": "date-time" }
  }
}
```

**Message**
```json
{
  "type": "object",
  "required": ["id", "name", "phone", "message", "read", "createdAt"],
  "properties": {
    "id":        { "type": "string" },
    "name":      { "type": "string" },
    "email":     { "type": "string" },
    "phone":     { "type": "string" },
    "message":   { "type": "string" },
    "read":      { "type": "boolean" },
    "createdAt": { "type": "string", "format": "date-time" }
  }
}
```

**Setting**
```json
{
  "type": "object",
  "required": ["id", "key", "value", "updatedAt"],
  "properties": {
    "id":        { "type": "string" },
    "key":       { "type": "string" },
    "value":     { "type": "string" },
    "updatedAt": { "type": "string", "format": "date-time" }
  }
}
```

**ErrorResponse**
```json
{
  "type": "object",
  "required": ["error"],
  "properties": {
    "error": { "type": "string" }
  }
}
```

---

## Interfaces

### `SwaggerUIWrapperProps`

```typescript
interface SwaggerUIWrapperProps {
  spec: Record<string, unknown>;
}
```

### `openapiSpec` type

```typescript
// typed as Record<string, unknown> inline, or as OpenAPIV3.Document
// from 'openapi-types' if that package is available
export const openapiSpec: Record<string, unknown> = { ... };
```

---

## Error Handling

| Scenario | Behavior |
|---|---|
| `qa_token` cookie absent | Server redirect to `/dashboard/login` before any HTML is rendered |
| `qa_token` present but `jwtVerify` throws (expired, wrong secret, malformed) | Server redirect to `/dashboard/login` |
| `JWT_SECRET` env var not set | Falls back to `'development-secret-change-me'` (matches `lib/auth.ts`) |
| `swagger-ui-react` chunk fails to load in browser | Renders `"Unable to load API documentation."` fallback |
| Missing operation or schema in spec | TypeScript compilation error catches shape mismatches at build time |

---

## Build & Runtime Compatibility Notes

- `swagger-ui-react` targets React ≤18 in its peer dep declaration. With React 19 the install requires `--legacy-peer-deps`. This is documented in the tasks and addressed at install time.
- The dynamic import with `ssr: false` prevents Next.js from attempting to render Swagger UI's browser-only code during SSR/SSG.
- `app/docs/page.tsx` does NOT export `dynamic = 'force-static'`; Next.js infers dynamic rendering automatically when `cookies()` is called.
- `@types/swagger-ui-react` is a devDependency so it is never included in the production bundle.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

---

### Property 1: All required API operations are documented in the spec

*For any* operation in the set of 24 required API operations (defined by path + HTTP method pairs), the `openapiSpec.paths` object SHALL contain an entry for that path with a key matching that HTTP method.

**Validates: Requirements 2.4**

---

### Property 2: Protected operations carry security annotations

*For any* operation in `openapiSpec.paths` that is designated as protected (PUT /contacts, POST/PUT/DELETE /teachers, POST/PUT/DELETE /programs, POST/PUT/DELETE /gallery, POST/PUT/DELETE /news, GET/PUT /settings, POST /upload), the operation object SHALL contain a `security` field equal to `[{ cookieAuth: [] }]`.

**Validates: Requirements 2.5**

---

### Property 3: All 8 model schemas are defined in components/schemas

*For any* model name in the set `{ Teacher, Program, Gallery, News, Contact, Message, Setting, ErrorResponse }`, the `openapiSpec.components.schemas` object SHALL have a key with that exact name and a non-null value.

**Validates: Requirements 2.6**

---

### Property 4: Optional Prisma fields are not marked required in schemas

*For any* schema in `openapiSpec.components.schemas` and *for any* field that is optional in the corresponding Prisma model (i.e., `bio`, `image`, `caption`, `alt`, `mapUrl`, `email`, `publishedAt`), that field name SHALL NOT appear in the schema's `required` array.

**Validates: Requirements 2.7**

---

### Property 5: Mutating operations include 400 and protected operations include 401

*For any* operation in `openapiSpec.paths` that uses an HTTP method in `{ POST, PUT, DELETE }`, the operation's `responses` object SHALL contain a key `"400"`. Additionally, *for any* protected operation, the `responses` object SHALL also contain a key `"401"`.

**Validates: Requirements 2.8**

---

### Property 6: Any absent or invalid JWT token redirects to login

*For any* request to `GET /docs` where the `qa_token` cookie is either absent or contains a token that fails `jwtVerify` (expired, wrong signature, malformed), the HTTP response SHALL be a redirect to `/dashboard/login` and SHALL NOT contain any OpenAPI spec content or Swagger UI markup.

**Validates: Requirements 4.3, 4.4, 4.7**

---
