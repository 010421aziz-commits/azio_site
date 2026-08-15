# Implementation Plan: Swagger/OpenAPI Documentation

## Overview

Add interactive Swagger/OpenAPI 3.0 documentation to the Quran Academy Next.js 15 App Router project. The implementation installs `swagger-ui-react`, creates a static OpenAPI spec covering all 24 API operations, wraps the UI in a client-safe dynamic import component, and serves the docs at `/docs` behind the existing `qa_token` JWT cookie guard.

## Tasks

- [ ] 1. Install dependencies
  - Run `npm install swagger-ui-react --legacy-peer-deps` to add the production dependency (legacy flag required because `swagger-ui-react` declares a React ≤18 peer dep but the project uses React 19)
  - Run `npm install --save-dev @types/swagger-ui-react --legacy-peer-deps` to add the TypeScript type declarations as a dev dependency
  - Verify both entries appear in `package.json` under `dependencies` and `devDependencies` respectively
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 2. Create the static OpenAPI spec (`lib/openapi-spec.ts`)
  - [ ] 2.1 Scaffold the spec file with top-level metadata and security scheme
    - Create `lib/openapi-spec.ts` exporting a constant `openapiSpec` typed as `Record<string, unknown>`
    - Set `openapi: "3.0.3"`, `info: { title: "Quran Academy API", version: "1.0.0" }`, and `servers: [{ url: "/api" }]`
    - Define `components.securitySchemes.cookieAuth` as `{ type: "apiKey", in: "cookie", name: "qa_token" }`
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ] 2.2 Define all reusable component schemas
    - Add `components.schemas` entries for `Teacher`, `Program`, `Gallery`, `News`, `Contact`, `Message`, `Setting`, and `ErrorResponse`
    - Derive `required` arrays and property shapes directly from the Prisma models in `prisma/schema.prisma`
    - Mark optional Prisma fields (`bio`, `image`, `caption`, `alt`, `mapUrl`, `email`, `publishedAt`) as absent from each schema's `required` array
    - _Requirements: 2.6, 2.7_

  - [ ]* 2.3 Write property tests for schema correctness (Properties 3 & 4)
    - **Property 3: All 8 model schemas are defined in components/schemas**
    - Iterate over `["Teacher","Program","Gallery","News","Contact","Message","Setting","ErrorResponse"]` and assert each key exists and is non-null in `openapiSpec.components.schemas`
    - **Property 4: Optional Prisma fields are not marked required in schemas**
    - For each of `bio`, `image`, `caption`, `alt`, `mapUrl`, `email`, `publishedAt`, assert the field name does NOT appear in the `required` array of the schema that contains it
    - **Validates: Requirements 2.6, 2.7**

  - [ ] 2.4 Add all 24 path operations to the spec
    - Implement path groups: `/login`, `/logout`, `/contact`, `/contacts`, `/teachers`, `/teachers/{id}`, `/programs`, `/programs/{id}`, `/gallery`, `/gallery/{id}`, `/news`, `/news/{id}`, `/settings`, `/upload`
    - Add `security: [{ cookieAuth: [] }]` to every protected operation (PUT /contacts; POST/PUT/DELETE /teachers, /programs, /gallery, /news; GET/PUT /settings; POST /upload)
    - Include `"400"` responses on every POST, PUT, and DELETE operation; include `"401"` responses on every protected operation
    - Reference `components/schemas` via `$ref` in request body and response shapes
    - _Requirements: 2.4, 2.5, 2.8_

  - [ ]* 2.5 Write property tests for path coverage and annotations (Properties 1, 2 & 5)
    - **Property 1: All required API operations are documented**
    - Assert that each of the 24 required path+method pairs exists in `openapiSpec.paths`
    - **Property 2: Protected operations carry security annotations**
    - For each protected operation, assert `security` equals `[{ cookieAuth: [] }]`
    - **Property 5: Mutating operations include 400 and protected ops include 401**
    - For every POST/PUT/DELETE operation assert `responses["400"]` exists; for protected ones also assert `responses["401"]` exists
    - **Validates: Requirements 2.4, 2.5, 2.8**

- [ ] 3. Checkpoint — Verify spec shape
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Create the client-side Swagger UI wrapper (`components/SwaggerUIWrapper.tsx`)
  - [ ] 4.1 Implement `SwaggerUIWrapper` with dynamic import
    - Create `components/SwaggerUIWrapper.tsx` with `'use client'` directive
    - Define `SwaggerUIWrapperProps` interface with `spec: Record<string, unknown>`
    - Use `next/dynamic` to import `swagger-ui-react` with `ssr: false` and a loading fallback (`<p>Loading API documentation...</p>`)
    - Import `swagger-ui-react/swagger-ui.css` inside the component file
    - Wrap the dynamic `<SwaggerUI spec={spec} />` render in an error boundary or equivalent fallback that displays `"Unable to load API documentation."` if the chunk fails to load
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ]* 4.2 Write unit tests for SwaggerUIWrapper
    - Mock `next/dynamic` to test that the `spec` prop is passed through correctly
    - Test that the fallback message renders when the dynamic import rejects
    - _Requirements: 3.2, 3.5_

- [ ] 5. Create the protected docs page (`app/docs/page.tsx`)
  - [ ] 5.1 Implement the Server Component with JWT guard
    - Create `app/docs/page.tsx` as a Server Component (no `'use client'`)
    - Export `metadata` with `title: "API Docs | Quran Academy"`
    - Read `qa_token` from the `CookieStore` using `cookies()` from `next/headers`
    - If token is absent, call `redirect('/dashboard/login')` immediately
    - Call `jwtVerify` using the `JWT_SECRET` env var (fallback: `'development-secret-change-me'`); on any error, call `redirect('/dashboard/login')`
    - On valid token, render `<SwaggerUIWrapper spec={openapiSpec as Record<string, unknown>} />`
    - Do NOT add `export const dynamic = 'force-static'`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [ ]* 5.2 Write property tests for the auth guard (Property 6)
    - **Property 6: Any absent or invalid JWT token redirects to login**
    - Test case: absent `qa_token` cookie → assert `redirect('/dashboard/login')` is called and no spec content is returned
    - Test case: expired token → assert redirect, no spec leak
    - Test case: wrong-secret token → assert redirect, no spec leak
    - Test case: malformed (non-JWT) string → assert redirect, no spec leak
    - **Validates: Requirements 4.3, 4.4, 4.7**

- [ ] 6. Verify middleware exclusion
  - [ ] 6.1 Confirm `middleware.ts` matcher does not match `/docs`
    - Read `middleware.ts` and verify the matcher pattern (`/dashboard/((?!login).*)`) does not match the string `/docs`
    - If it already excludes `/docs`, leave the file unchanged
    - If it would match `/docs`, update the matcher to exclude it
    - _Requirements: 5.1, 5.2, 5.3_

- [ ] 7. Final checkpoint — Build verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The `--legacy-peer-deps` flag is required for Task 1 only because `swagger-ui-react` has not yet declared React 19 compatibility
- `openapiSpec` is typed as `Record<string, unknown>` — no external `openapi-types` package is needed
- The CSS import (`swagger-ui-react/swagger-ui.css`) lives inside `SwaggerUIWrapper.tsx` so it is bundled with the client chunk only
- `app/docs/page.tsx` intentionally omits `export const dynamic = 'force-static'`; Next.js 15 infers dynamic rendering automatically when `cookies()` is called
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties defined in the design document

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1"] },
    { "id": 1, "tasks": ["2.2"] },
    { "id": 2, "tasks": ["2.3", "2.4"] },
    { "id": 3, "tasks": ["2.5", "4.1", "6.1"] },
    { "id": 4, "tasks": ["4.2", "5.1"] },
    { "id": 5, "tasks": ["5.2"] }
  ]
}
```
