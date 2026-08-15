# Requirements Document

## Introduction

This feature adds interactive Swagger/OpenAPI 3.0 documentation to the Quran Academy Next.js 15 App Router project. The documentation is served as a client-rendered page at `/docs`, protected by the existing `qa_token` JWT cookie (the same guard used across the admin dashboard), and backed by a static TypeScript OpenAPI spec that describes all 14 REST API route handlers currently in the codebase. The UI is rendered by `swagger-ui-react`. No JSDoc annotation of existing source files is required.

## Glossary

- **DocsPage**: The Next.js App Router page component at `app/docs/page.tsx` that renders the Swagger UI.
- **OpenAPISpec**: The static TypeScript object exported from `lib/openapi-spec.ts` that describes every API endpoint in OpenAPI 3.0 format.
- **SwaggerUI**: The `swagger-ui-react` React component that renders interactive API documentation from an OpenAPI spec object.
- **qa_token**: The `httpOnly` JWT cookie set by `POST /api/login` and verified by `requireAdmin` in `lib/auth.ts`. It encodes the admin's `id` and `email`, is signed with HS256, and expires after 7 days.
- **AdminGuard**: The server-side authentication check performed at page render time inside `DocsPage` that inspects the `qa_token` cookie.
- **CookieStore**: The Next.js `cookies()` helper from `next/headers` used to read `httpOnly` cookies in Server Components.
- **AuthError**: The condition where `qa_token` is absent or fails `jwtVerify` verification using the `JWT_SECRET` environment variable.
- **OpenAPI 3.0**: The OpenAPI Specification version 3.0.x format used to define the API surface.
- **swagger-ui-react**: The npm package that provides the React component for rendering Swagger UI.
- **SwaggerUIWrapper**: A `'use client'` wrapper component (`components/SwaggerUIWrapper.tsx`) that dynamically imports `swagger-ui-react` to avoid SSR issues.

---

## Requirements

### Requirement 1 — Package Installation

**User Story:** As a developer, I want the required npm packages installed, so that the Swagger UI component and its type declarations are available at build time.

#### Acceptance Criteria

1. THE System SHALL list `swagger-ui-react` as a production dependency in `package.json`.
2. THE System SHALL list `@types/swagger-ui-react` as a dev dependency in `package.json`.
3. WHEN `npm install` is run after changes to `package.json`, THE System SHALL install both packages without peer-dependency conflicts with React 19 and Next.js 15.

---

### Requirement 2 — Static OpenAPI Specification

**User Story:** As a developer, I want a single TypeScript file that contains the complete OpenAPI 3.0 spec, so that the spec is type-safe, version-controlled, and easy to update without touching route files.

#### Acceptance Criteria

1. THE System SHALL export a constant named `openapiSpec` from `lib/openapi-spec.ts` typed as an `OpenAPIV3.Document` (from `openapi-types` or typed inline).
2. THE OpenAPISpec SHALL declare `openapi: "3.0.3"`, an `info` object with `title: "Quran Academy API"` and `version: "1.0.0"`, and a `servers` array with a single entry `{ url: "/api" }`.
3. THE OpenAPISpec SHALL define a `securitySchemes` component entry named `cookieAuth` with `type: "apiKey"`, `in: "cookie"`, and `name: "qa_token"`.
4. THE OpenAPISpec SHALL document each of the following 14 API operations, grouped under the appropriate path and HTTP method:
   - `POST /login` — public, accepts `{ email, password }`, sets `qa_token` cookie on success.
   - `POST /logout` — public, clears `qa_token` cookie.
   - `POST /contact` — public, accepts `{ name, email?, phone, message }`, creates a `Message` record.
   - `GET /contacts` — public, returns the single `Contact` record.
   - `PUT /contacts` — protected by `cookieAuth`, upserts the `Contact` record.
   - `GET /teachers` — public, returns an array of active `Teacher` records ordered by `order`.
   - `POST /teachers` — protected by `cookieAuth`, creates a `Teacher` record.
   - `PUT /teachers/{id}` — protected by `cookieAuth`, updates a `Teacher` record.
   - `DELETE /teachers/{id}` — protected by `cookieAuth`, deletes a `Teacher` record.
   - `GET /programs` — public, returns an array of active `Program` records ordered by `order`.
   - `POST /programs` — protected by `cookieAuth`, creates a `Program` record.
   - `PUT /programs/{id}` — protected by `cookieAuth`, updates a `Program` record.
   - `DELETE /programs/{id}` — protected by `cookieAuth`, deletes a `Program` record.
   - `GET /gallery` — public, returns an array of `Gallery` records ordered by `order`.
   - `POST /gallery` — protected by `cookieAuth`, creates a `Gallery` record.
   - `PUT /gallery/{id}` — protected by `cookieAuth`, updates a `Gallery` record.
   - `DELETE /gallery/{id}` — protected by `cookieAuth`, deletes a `Gallery` record.
   - `GET /news` — public, returns an array of published `News` records ordered by `publishedAt` descending.
   - `POST /news` — protected by `cookieAuth`, creates a `News` record.
   - `PUT /news/{id}` — protected by `cookieAuth`, updates a `News` record.
   - `DELETE /news/{id}` — protected by `cookieAuth`, deletes a `News` record.
   - `GET /settings` — protected by `cookieAuth`, returns all `Setting` key-value pairs.
   - `PUT /settings` — protected by `cookieAuth`, upserts a `Setting` record by key.
   - `POST /upload` — protected by `cookieAuth`, accepts `multipart/form-data` with a `file` field (≤8 MB, JPEG/PNG/WebP/AVIF), returns `{ url }`.
5. WHEN an endpoint requires authentication, THE OpenAPISpec SHALL include `security: [{ cookieAuth: [] }]` on that operation.
6. THE OpenAPISpec SHALL define reusable `components/schemas` for `Teacher`, `Program`, `Gallery`, `News`, `Contact`, `Message`, `Setting`, and `ErrorResponse`, with fields matching the Prisma models in `prisma/schema.prisma`.
7. WHEN a schema field is optional in the Prisma model (e.g., `bio`, `image`, `email`, `mapUrl`, `publishedAt`), THE OpenAPISpec SHALL mark that field as not required in the corresponding JSON Schema object.
8. THE OpenAPISpec SHALL specify a `400` response for every mutating operation and a `401` response for every protected operation.

---

### Requirement 3 — Client-Side Swagger UI Wrapper

**User Story:** As a developer, I want a client component that renders `swagger-ui-react`, so that the library's browser-only DOM requirements are satisfied without causing SSR errors.

#### Acceptance Criteria

1. THE System SHALL create a file at `components/SwaggerUIWrapper.tsx` with a `'use client'` directive at the top.
2. THE SwaggerUIWrapper SHALL accept a single prop `spec` typed as `Record<string, unknown>` (or a compatible OpenAPI object type) and pass it directly to `SwaggerUI` via the `spec` prop.
3. WHEN `SwaggerUIWrapper` is rendered on the server, THE System SHALL not attempt to render `swagger-ui-react`, preventing hydration errors. (Dynamic import with `ssr: false` or equivalent is acceptable.)
4. THE SwaggerUIWrapper SHALL import `swagger-ui-react/swagger-ui.css` so that Swagger UI styles are applied without requiring additional global CSS changes.
5. IF `swagger-ui-react` fails to load (e.g., dynamic import error), THEN THE SwaggerUIWrapper SHALL render a fallback message: `"Unable to load API documentation."`.

---

### Requirement 4 — Protected Docs Page

**User Story:** As an admin, I want the `/docs` page to be accessible only when I am authenticated, so that the API documentation is not exposed to anonymous visitors.

#### Acceptance Criteria

1. THE System SHALL create `app/docs/page.tsx` as a Next.js Server Component (no `'use client'` directive at the file level).
2. WHEN the `DocsPage` renders, THE AdminGuard SHALL read the `qa_token` value from the `CookieStore` using `cookies()` from `next/headers`.
3. WHEN the `qa_token` cookie is absent, THE DocsPage SHALL call `redirect('/dashboard/login')` from `next/navigation` before rendering any UI.
4. WHEN the `qa_token` cookie is present but `jwtVerify` throws an error (expired or invalid signature), THE DocsPage SHALL call `redirect('/dashboard/login')`.
5. WHEN `qa_token` is valid, THE DocsPage SHALL render the `SwaggerUIWrapper` component, passing the `openapiSpec` constant as the `spec` prop.
6. THE DocsPage SHALL set the HTML `<title>` to `"API Docs | Quran Academy"` using Next.js `export const metadata`.
7. WHEN an unauthenticated user is redirected from `/docs` to `/dashboard/login`, THE System SHALL not expose any portion of the OpenAPI spec or Swagger UI markup in the HTTP response.

---

### Requirement 5 — Middleware Exclusion

**User Story:** As a developer, I want the existing middleware to leave `/docs` unaffected, so that the page's own server-side auth guard handles access control without double-redirecting.

#### Acceptance Criteria

1. THE System SHALL verify that the `matcher` pattern in `middleware.ts` (`/dashboard/((?!login).*)`) does not match the path `/docs`.
2. IF the middleware matcher would match `/docs`, THEN THE System SHALL update the matcher to exclude `/docs` from its scope.
3. WHILE the middleware matcher does not include `/docs`, THE System SHALL leave `middleware.ts` unchanged.

---

### Requirement 6 — Build and Runtime Compatibility

**User Story:** As a developer, I want the docs feature to build and run without errors, so that CI/CD pipelines and production deployments are unaffected.

#### Acceptance Criteria

1. WHEN `next build` is executed, THE System SHALL complete without TypeScript compilation errors related to the new files.
2. WHEN `next build` is executed, THE System SHALL complete without missing-module errors for `swagger-ui-react` or `@types/swagger-ui-react`.
3. THE DocsPage SHALL NOT use `export const dynamic = 'force-static'`, because `cookies()` requires dynamic rendering.
4. WHEN `swagger-ui-react` is imported inside a `'use client'` component, THE System SHALL not trigger the Next.js `"You're importing a component that needs...` server/client boundary error.
5. IF the `JWT_SECRET` environment variable is not set, THEN THE AdminGuard SHALL fall back to the same default key string (`'development-secret-change-me'`) used in `lib/auth.ts`.
