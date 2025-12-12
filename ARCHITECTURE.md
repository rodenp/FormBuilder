# Form Builder Architecture Design

## 1. System Overview

The Form Builder is a comprehensive solution for creating, managing, and rendering complex, nested forms. It is built as a modular system consisting of a React-based frontend library (`@form-builder/core`) and a scalable backend powered by Convex (or compatible database/API).

### Key Design Goals
- **Unlimited Nesting**: Support for recursive container structures (containers within containers).
- **Dynamic Styling**: Real-time styling updates without rebuilding.
- **Extensibility**: Modular component architecture.
- **Performance**: Optimized rendering for large forms.
- **Integration**: Easy drop-in support for Next.js, Vite, and other React frameworks.

## 2. Core Components

### 2.1 Form Builder (Editor)
The `FormBuilder` component provides the visual interface for constructing forms.
- **Drag-and-Drop Interface**: Built using `@dnd-kit` for robust drag interactions.
- **Property Panels**: Context-aware sidebars for configuring selected elements.
- **Canvas**: The main work area supporting nested drop zones.
- **State Management**: Uses `zustand` for high-performance localized state updates, minimizing re-renders.

### 2.2 Form Renderer (Viewer)
The `FormRenderer` component takes a JSON schema and renders the interactive form.
- **Schema-Driven**: Renders recursively based on the `FormSchema`.
- **Validation**: Integrated `zod` validation for field constraints.
- **Submission Handling**: Manages form state (react-hook-form) and action execution.

## 3. Data Model

### 3.1 Form Schema (`FormSchema`)
The central data structure defining a form.
```typescript
interface FormSchema {
  id: string;
  settings: FormSettings;
  elements: FormElement[]; // Root level elements
}
```

### 3.2 Form Element (`FormElement`)
A recursive structure supporting unlimited depth.
```typescript
interface FormElement {
  id: string;
  type: FormElementType; // 'text', 'container', 'columns', etc.
  label?: string;
  children?: FormElement[]; // Allows for nesting
  // ... specific properties based on type
}
```

## 4. Backend Architecture (Convex)

The backend is designed to handle schematic data and submissions efficiently.

- **`forms` Table**: Stores the validation schema, versioning, and metadata.
- **`formSubmissions` Table**: Stores submission data as JSON (preserving nested structure).
- **`formActions` Table**: Tracks the execution status of post-submission actions (webhooks, emails).

### Action Processing Flow
1. **Submission**: Client submits data to `submitForm` mutation.
2. **Storage**: Data is validated and stored in `formSubmissions`.
3. **Async Actions**: `scheduler` triggers `processActions` for background processing.
4. **Resiliency**: Failed actions (e.g., Webhooks) are queued for retry with exponential backoff.

## 5. Styling System

The application uses Tailwind CSS with a dynamic variable system for runtime theming.
- **CSS Variables**: `primaryColor`, `formBackground`, etc. are injected at the root.
- **Tailwind Utility Classes**: Used for structural layout and standard spacing.
- **Dynamic Injection**: Style tags are generated for user-defined specific overrides.

## 6. Integration Boundaries

- **Package**: The core logic is bundled into an NPM package.
- **App Consumption**: Applications import `FormBuilder` and `FormRenderer`.
- **API Contract**: The backend API expects specific JSON structures, ensuring decoupling between frontend editor and backend storage.
