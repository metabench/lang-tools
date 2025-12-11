# Product Requirements

## MVP Features
- **Reactive Data Primitives**: `Data_Value`, `Data_Object`, and `Collection` classes that emit change events.
- **Type Safety**: Integration with `lang-mini`'s `Functional_Data_Type` for runtime validation.
- **Vector Math**: Utilities for 2D vector operations (`v_add`, `v_subtract`, etc.).
- **Batch Operations**: `collective` proxy for efficient array manipulation.
- **Legacy Support**: Backward compatibility with `old/` Data_Model implementations until migration is complete.
- **Documentation Browser**: An internal Express-based tool to view the Vibe Bible documentation as a single-page ebook.

## Non-Goals
- **UI Components**: This library provides data structures, not visual components (handled by `jsgui`).
- **Database ORM**: While it handles data models, it is not a full ORM for SQL/NoSQL databases.
- **Browser Polyfills**: Assumes a reasonably modern JS environment (Node.js >= 12).

## Constraints
- **Dependency Minimalist**: Must rely only on `lang-mini` and `fnl`.
- **Performance**: Vector math and batch operations must be optimized for high-frequency usage (e.g., animation loops).
- **Isomorphic**: Must run in both Node.js and browser environments.
