Status: WIP
Last-Updated: 2025-12-12
Owner: @unassigned

# MVVM Patterns — Research Notes (for lang-tools)

This is a research-oriented document: it collects MVVM patterns, trade-offs, and how they *might* map onto lang-tools (`Data_Object`, `Data_Value`, `Collection`). Nothing here should be treated as final API direction.

## Goals (what MVVM needs)

- **Stable binding targets**: bindings shouldn’t break because the model “shape flips” (primitive → wrapper → object) over time.
- **Predictable change signals**: view-model logic needs consistent events (what changed, old/new, and the “node” that changed).
- **Composable derived state**: computed values and projections should be easy and efficient.
- **Transactional updates**: multiple edits should be batchable to avoid intermediate inconsistent states.

## Key MVVM ideas (general)

### 1) Stable identity for observable nodes

MVVM works best when a binding points to a stable “node” object.

- Bad for bindings: the thing you bind to gets replaced with a new object.
- Good for bindings: the node remains the same instance and its internal state changes.

Implication for lang-tools:
- Prefer patterns where `Data_Value` objects are created once and then updated, rather than swapping in/out different wrappers.

### 2) Separate “node” vs “raw value”

MVVM typically separates:
- the **observable node** (for subscriptions, metadata, validation), and
- the **raw value** (for display / serialization / computation).

Implication for lang-tools:
- Having both `event.data_value` (node) and `event.raw_value` (JS primitive/object) is MVVM-friendly.
- Treat `event.value` as legacy/mixed for backward compatibility.

### 3) Null vs undefined semantics

Common MVVM conventions:
- `undefined` often means “missing/unset / not provided”.
- `null` often means “explicitly empty”.

Implication for lang-tools:
- Treat `null` as a legitimate value that can be held inside a stable `Data_Value` node.
- Consider having explicit “unset/delete” APIs rather than overloading `undefined`.

### 4) Unidirectional vs bidirectional binding

Two common families:

- **Unidirectional**: model → view, and user actions dispatch commands to update model.
  - Pros: easier reasoning, fewer loops.
  - Cons: more plumbing.

- **Bidirectional**: view edits push into model directly.
  - Pros: straightforward for forms.
  - Cons: needs loop prevention, careful equals checks.

Implication for lang-tools:
- `Data_Value.sync(a, b)` is effectively bidirectional; it must remain loop-safe and “equals”-guarded.

### 5) Computed / derived values

MVVM usually needs computed properties, e.g. `fullName = first + ' ' + last`.

Implementation options (research):
- **Push-based**: computed subscribes to dependencies and updates itself.
- **Pull-based**: computed calculates on read and caches until dependencies change.

Implication for lang-tools:
- Candidate abstraction: a `Computed_Data_Value` (not proposed as immediate work) that depends on one or more `Data_Value` nodes.

### 6) Validation as first-class state

MVVM works well when validation status is observable:
- valid / invalid
- error messages
- “touched/dirty” flags

Implication for lang-tools:
- `Data_Value` already has typed validation pathways; exposing validation results via consistent events/state would help.

### 7) Batching / transactions

Avoid emitting dozens of intermediate events while applying a patch.

Common patterns:
- `beginBatch()` / `endBatch()` around multiple updates.
- Defer computed updates until the end.

Implication for lang-tools:
- Not implemented in this document; but likely needed for “high-level MVVM”.

## Glossary (quick reference)

- **Model**: the domain state (business objects, values, collections).
- **View**: rendering layer (DOM, UI controls, templates).
- **ViewModel**: adapts model state for the view; exposes observable state and commands.
- **Observable node**: a stable object you can subscribe to (e.g., a `Data_Value` instance).
- **Raw value**: the underlying JS value inside a node (e.g., `dv.value`).
- **Computed/derived value**: a value produced from other values (e.g., `fullName`).
- **Binding**: connecting view state to observable nodes (one-way or two-way).
- **Two-way binding**: view changes write back to the model.
- **Command**: a view-triggered action that mutates state (submit, save, increment).
- **Transaction/batch**: applying multiple updates while deferring events until the end.
- **Identity (stable id)**: a stable identifier for items/nodes used for diffing and reuse.
- **Shape-flip**: changing a field from primitive → node → object (or vice versa) in a way that breaks bindings.

## Mapping to lang-tools (current state)

### Observable primitives: `Data_Value`

- `Data_Value` is the natural MVVM binding node for scalar values.
- For UI binding stability, prefer updating `.value` rather than replacing the `Data_Value` instance.

Related code:
- `Data_Model/new/Data_Value.js` includes `attempt_set_value()` and `Data_Value.sync()`.

### Observable objects: `Data_Object`

Potential MVVM guidelines (subject to more research):

- If a field is going to be bound in the UI, create a stable node once:
  - Use `obj.ensure_data_value('field')` and then bind to that returned node.
- For legacy compatibility, raw primitives may still be stored for non-bound fields.

Research question:
- Should a future “strict MVVM mode” exist where *all* leaf values become `Data_Value` nodes?
  - Pros: stability everywhere.
  - Cons: could be breaking, and might change memory/perf characteristics.

### Observable collections: `Collection`

MVVM typically expects collections to:
- raise add/remove/move events
- support stable item identity
- support selection models

Research question:
- Do we want explicit item identity contracts (e.g. `_id()` stability) to support list diffing efficiently?

## Recommended non-breaking conventions (short-term)

These are conventions (not forced by API) to enable MVVM experiments without breaking existing consumers.

- **Bind to nodes**: bind to a `Data_Value` instance, not a primitive.
- **Prefer `ensure_data_value` for bound fields**: creates a stable binding target.
- **Listen to `event.data_value` / `event.raw_value`**: treat `event.value` as legacy/mixed.
- **Avoid shape-flipping manually**: don’t overwrite a `Data_Value` field with a primitive in user code.

## Compatibility constraints (explicit non-goals for now)

These constraints are here to keep MVVM exploration safe for existing users.

- **No breaking API changes**: MVVM work should be additive (new methods/classes) or bug-fix level.
- **No forced “everything is a node” migration**: do not automatically wrap *existing* primitive fields into `Data_Value` during ordinary `set()` calls.
- **Do not rely on `change` event `value` becoming strictly raw**: legacy listeners may expect mixed behavior; MVVM consumers should prefer `raw_value` / `data_value` where available.
- **Preserve old/new coexistence**: avoid changes that require downstream code to switch from legacy `Collection`/`Data_Object` patterns immediately.
- **Prefer opt-in stability**: e.g., `ensure_data_value('x')` for fields that are bound in MVVM scenarios.

## Open questions / next research

- Computed values: what is the minimal API that composes well with existing events?
- Transactions: how should batch edits surface change events?
- Serialization: how should nodes serialize to JSON without losing the ability to restore identity?
- Interop with legacy `Collection` / old data model: should MVVM-oriented APIs live only in `new/`?

## Proposed experiments (non-breaking, exploratory)

These are intentionally framed as experiments, not commitments. The goal is to de-risk MVVM features while preserving compatibility.

### Experiment A — Computed / derived values

**Goal:** Provide derived values (computed properties) that update when dependencies change.

**Hypothesis:** A small computed primitive can live as a `Data_Value`-like node and subscribe to dependency change events.

**Non-breaking prototype idea (new class, additive only):**
- `Computed_Data_Value` (or `Derived_Data_Value`) in `Data_Model/new/`.
- Constructor: `new Computed_Data_Value({ deps: [dv1, dv2], fn: (a,b) => ..., context })`
- Exposes `.value` (read-only by default).
- Emits `change` when computed output changes.

**Design questions:**
- Should it be push-based (subscribe) or pull-based (recompute on read + cache)?
- How does it avoid loops if it also can be set (two-way computed)?
- How do we represent dependency graphs (for debugging)?

**Suggested verification:**
- Jest tests for recompute correctness, loop prevention, and equals-guard behavior.
- Performance sanity check: repeated dependency changes should not explode event counts.

### Experiment B — Batching / transactions

**Goal:** Allow applying many changes while emitting fewer (or aggregated) events.

**Hypothesis:** A minimal batching layer around `raise_event/trigger` can defer notifications and flush once.

**Non-breaking prototype idea (additive methods):**
- `Data_Model.begin_batch()` / `Data_Model.end_batch()` (or `Data_Object.batch(fn)` helper).
- During a batch: collect a list/map of changes `{name, raw_value, data_value}`.
- At the end: emit either:
  - one aggregated event (`change:batch`) and/or
  - N normal events (but after state is fully consistent)

**Design questions:**
- Should nested batching be supported (counter-based)?
- Which event shape is best for consumers (array vs map)?
- How does this interact with bubbled changes from nested objects?

**Suggested verification:**
- Test that observers see consistent final state when events fire.
- Test that a batch does not lose intermediate changes when the same field is updated multiple times.

### Experiment C — Validation state as observable

**Goal:** Make validation status usable in MVVM forms (errors, touched/dirty).

**Hypothesis:** Validation results can be represented as a separate observable value (or event stream) without coupling validation to the view.

**Non-breaking prototype idea (additive properties/events):**
- For `Data_Value`:
  - `dv.validation` (a `Data_Value` containing a structured object: `{ valid, message, code, details }`)
  - Events: `validation-change`
- Optional flags:
  - `dv.touched` / `dv.dirty` (either booleans or a small state object)

**Design questions:**
- When should validation run? on set, on blur, explicit call?
- How to represent multiple validation failures?

**Suggested verification:**
- Tests that invalid sets update validation state without throwing where appropriate.
- Tests that validation events do not create set-loops.

### Experiment D — Patch/apply semantics for `Data_Object`

**Goal:** Apply structured patches (partial updates) safely and consistently.

**Hypothesis:** A small `apply_patch({path: value})` helper can reduce ad-hoc dotted-path logic and support future batching.

**Non-breaking prototype idea:**
- `obj.apply_patch({ 'user.profile.name': 'Bob', 'user.age': 30 })`
- Optionally supports `{ silent: true }` or runs inside a batch.

**Design questions:**
- Should patch support delete/unset? If so, how is it represented (symbol, sentinel, explicit API)?
- How do we handle missing intermediate objects (auto-create or throw)?

**Suggested verification:**
- Tests for dotted-path correctness and event emission consistency.

### Experiment E — Collection MVVM ergonomics

**Goal:** Improve list binding (add/remove/move signals, stable identity, selection).

**Hypothesis:** Explicit events for structural changes provide better UI diffing than “value replaced”.

**Non-breaking prototype idea:**
- Ensure `Collection` emits clear events like:
  - `item-added`, `item-removed`, `item-moved`
  - include `{ index, item, id }`
- Optional helper for stable ids: `item._id()` or a configurable `fn_item_id`.

**Design questions:**
- What’s the canonical identity for list items (context-based ids vs explicit field)?
- How do we represent move operations vs remove+add?

**Suggested verification:**
- Tests asserting event ordering and payload shapes.
- Basic UI-oriented scenario tests (simulate list updates and ensure events are sufficient).

## Practical examples (today)

### Stable scalar binding

```js
const Data_Object = require('../../Data_Model/new/Data_Object');

const m = new Data_Object();
const name = m.ensure_data_value('name');

name.on('change', () => {
  console.log('name changed:', name.value);
});

m.set('name', 'Bob');
m.set('name', 'Alice');
```

### Using `change` event safely

```js
m.on('change', (e) => {
  // Prefer these for MVVM.
  const node = e.data_value;
  const raw = e.raw_value;

  // `e.value` is legacy/mixed for compatibility.
});
```
