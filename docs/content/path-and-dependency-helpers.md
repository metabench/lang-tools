Status: Completed
Last-Updated: 2026-01-05
Owner: @unassigned

# Path and Dependency Helpers

## Overview
These utilities provide small, data-only helpers for reading and updating nested values, tracking computed dependencies, and cleaning up watcher subscriptions. They are intentionally UI-agnostic so they can be reused by MVVM layers such as jsgui3-html without Control or DOM dependencies.

## Modules and Exports
All helpers are exposed via `util` in `lang.js`:

- `normalize_path(path)`
- `path_get(target, path, default_value)`
- `path_set(target, path, value, options)`
- `create_dependency_graph()`
- `create_watch_list()`

## normalize_path(path)

- Accepts an array of path parts or a string like `"a.b[0].c"`.
- Returns an array of keys/indexes (numeric indexes become numbers).
- If a path part is quoted (`['key']` or `["key"]`), the quotes are stripped.

Example:

```js
const { util } = require('lang-tools');

util.normalize_path('a[0].b["c"]');
// -> ['a', 0, 'b', 'c']
```

## path_get(target, path, default_value)

- Traverses the target using the normalized path.
- Returns `default_value` if any segment is missing or if the result is `undefined`.

Example:

```js
const { util } = require('lang-tools');

const data = { user: { profile: { name: 'Ada' } } };
util.path_get(data, 'user.profile.name');
// -> 'Ada'

util.path_get(data, 'user.profile.email', 'unknown');
// -> 'unknown'
```

## path_set(target, path, value, options)

- Writes `value` into the target at the path.
- Creates missing objects/arrays by default.
- Pass `{ create: false }` to avoid creating missing intermediates.
- Returns `{ updated, old_value, value, target }`.

Example:

```js
const { util } = require('lang-tools');

const data = {};
util.path_set(data, 'settings.theme.name', 'ocean');
// data.settings.theme.name === 'ocean'

util.path_set(data, 'settings.layout.columns', 3, { create: false });
// -> { updated: false, ... } when intermediate path is missing
```

## create_dependency_graph()

Creates a small dependency tracker for computed values. The graph tracks both dependencies and dependents.

API:
- `add(node, deps)`
- `set_dependencies(node, deps)`
- `remove(node)`
- `get_dependencies(node)`
- `get_dependents(node)`
- `clear()`

Example:

```js
const { util } = require('lang-tools');

const graph = util.create_dependency_graph();
graph.set_dependencies('total', ['subtotal', 'tax']);

graph.get_dependencies('total');
// -> ['subtotal', 'tax']

graph.get_dependents('tax');
// -> ['total']
```

## create_watch_list()

Creates a list of cleanup callbacks (unsubscribe functions) and provides a single `clear()` to release them.

API:
- `add(unsubscribe_fn)`
- `remove(unsubscribe_fn)`
- `clear()`
- `size()`

Example:

```js
const { util } = require('lang-tools');

const watch_list = util.create_watch_list();
const unsubscribe = () => console.log('cleanup');

watch_list.add(unsubscribe);
watch_list.clear();
```

## Status

- Implemented in `util.js`.
- Covered by `test/util.test.js`.

## Pending Updates

- Evaluate whether `path_set` should support custom builders (e.g., `Map`, `Data_Object`).
- Consider exposing a strict mode that errors on missing paths.
