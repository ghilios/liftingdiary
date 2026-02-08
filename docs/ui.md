# UI Coding Standards

## Component Library

This project uses **shadcn/ui** exclusively for all UI components.

### Rules

1. **Only use shadcn/ui components** - Do not create custom components
2. **Install components as needed** - Use `npx shadcn@latest add <component>` to add new components
3. **No custom styling of base elements** - Use shadcn/ui primitives (Button, Card, Input, etc.) instead of styling raw HTML elements

### Available Components

Components are installed to `components/ui/`. To add a new component:

```bash
npx shadcn@latest add <component-name>
```

See the full list at: https://ui.shadcn.com/docs/components

## Date Formatting

All date formatting must use **date-fns**.

### Standard Date Format

Dates should be displayed in the following format:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

Use the date-fns format string `do MMM yyyy`:

```typescript
import { format } from "date-fns";

const formatted = format(date, "do MMM yyyy");
// Output: "1st Sep 2025"
```

### Format Tokens Reference

| Token | Example | Description |
|-------|---------|-------------|
| `do` | 1st, 2nd, 3rd | Day of month with ordinal |
| `MMM` | Jan, Feb, Sep | Abbreviated month name |
| `yyyy` | 2025 | Full year |
