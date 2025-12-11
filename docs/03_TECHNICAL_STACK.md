# Technical Stack

## Core Runtime
- **Language**: JavaScript (ES6+).
- **Platform**: Node.js (>= 12.0.0) and Browser (Isomorphic).
- **Base Library**: `lang-mini` (Evented_Class, Functional_Data_Type).
- **Functional Utils**: `fnl`.

## Documentation Browser Stack
- **Server**: Express.js.
- **Rendering**: `jsgui3-html` (Server-Side Rendering).
- **Client**: `jsgui3-client`.
- **Markdown**: `markdown-it` (for rendering docs).

## Testing
- **Runner**: Jest (primary), Node.js `test` runner (legacy).
- **Assertions**: Jest matchers + custom `toBeDataValue`.

## Build & Tooling
- **Package Manager**: npm.
- **Linting**: (Implicit via repo conventions).
- **CI**: GitHub Actions (implied).

## Overrides from Vibe Bible Default
- **No Next.js**: This is a low-level library, not a web app.
- **No Convex**: Data persistence is handled by consumers, not the library.
- **No Tailwind**: No UI components.
