# API and Integration

## Public Exports (`lang.js`)

### Data Structures
- `lang.Collection`
- `lang.Data_Value`
- `lang.Data_Object`
- `lang.B_Plus_Tree`

### Utilities
- `lang.collective(arr)`: Batch operations proxy.
- `lang.util.v_add(a, b)`: Vector addition.
- `lang.util.npx(str)`: Pixel string to number.

## Integration Patterns
- **With jsgui**: `lang-tools` provides the data layer; `jsgui` binds these models to DOM elements.
- **Standalone**: Use `Data_Value` for state management in any Node/Browser app.
