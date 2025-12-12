# Form Builder Modular Architecture Design Document

## 1. Overview
The goal of this architectural refactor is to decouple the monolithic `Canvas.tsx` into a modular, scalable system where each form component (Input, Text, Container, etc.) lives in its own self-contained file.
The system will rely on a **Generic Component Wrapper** to handle all common concerns:
- Positioning (Margins, Flex, Grid)
- Sizing (Width, Height, Padding)
- Styling (Colors, Borders, Fonts)
- Interactions (Drag & Drop, Selection, Resizing)

The individual components will **only** be responsible for rendering their specific HTML/UI content.

## 2. Core Philosophy
1.  **Separation of Concerns**: Canvas logic != Component logic.
2.  **Uniformity**: All components use the same props for layout/spacing.
3.  **Configurability**: Global default settings drive the initial look; components override only what they must.
4.  **Extensibility**: Adding a new component should involve creating *one* file and registering it.

## 3. Project Structure
The refactor will introduce the following structure:

```
src/
├── components/
│   ├── builder/               # Core Builder Components
│   │   ├── Canvas.tsx         # Main entry point (simplified)
│   │   ├── SortableElement.tsx# Dnd-kit wrapper (uses ComponentWrapper)
│   │   └── ComponentWrapper.tsx # GENERIC WRAPPER (The "Brain")
│   │
│   ├── form-elements/         # Individual Element Implementations
│   │   ├── index.ts           # Registry of all components
│   │   ├── common/            # Shared interfaces
│   │   │   └── types.ts
│   │   ├── Wrapper.tsx        # (Optional) specific sub-wrappers
│   │   │
│   │   ├── simple/
│   │   │   ├── Input.tsx
│   │   │   ├── TextArea.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Radio.tsx
│   │   │   ├── Button.tsx
│   │   │   └── Hidden.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Container.tsx
│   │   │   ├── Columns.tsx
│   │   │   ├── Rows.tsx
│   │   │   └── Grid.tsx
│   │   │
│   │   └── content/
│   │       ├── TextBlock.tsx
│   │       ├── Heading.tsx
│   │       ├── RichText.tsx
│   │       ├── Image.tsx
│   │       └── Menu.tsx
│   │
│   └── templates/
│       └── HelloWorld.tsx     # Reference Template
│
├── settings/
│   └── defaultSettings.ts     # Global defaults (Margins, Paddings)
```

## 4. Generic Component Wrapper (`ComponentWrapper`)
This is the heart of the new system. Every component in `form-elements` will be wrapped by this.

**Responsibilities:**
**Responsibilities:**
- **Settings Hierarchy** (Partial Merge Strategy):
  The final settings object is constructed by merging layers. Keys not specified in a higher layer retain the value from the lower layer.
  1.  `Global Defaults` (Base Layer)
  2.  `Component Overrides` (Merges on top, only overrides specified keys)
  3.  `Instance Properties` (Top Layer, from element props)
  
  *Example*: If Global defines `margin: 0` and Component defines `padding: 8px`, the result is `margin: 0, padding: 8px`.
- Applying Tailwind classes/styles for:
    - Background Colors
    - Borders (Selection state, Hover state)
    - Spacing (Margin/Padding)
    - Flex/Grid positioning (if parent is a container)
- Handling `onClick` (Selection).
- Handling `RichTextEditor` mode switching (if applicable).

**Interface:**
```typescript
interface ComponentWrapperProps {
  element: FormElement;
  children: React.ReactNode; 
  componentSettings?: Partial<ComponentSettings>; // Component-level overrides
  className?: string;
}
```

## 5. Global Settings & Defaults
We will create a centralized settings registry (`src/settings/defaultSettings.ts`) that defines the baseline styling rules requested by the user.

**Default Rules:**
- **Global**: margins: 0, paddings: 0.
- **Canvas**: Full height of device.
- **Specific Types** (Global Defaults):
    - `text-block`, `heading`, `checkbox`, `radio`, `menu`: Top Margin 4px, Padding 4px.
    - `dropdown`: Top Margin 4px, Padding 8px.
    - `button`: Margin 0, Padding 8px.

**Component Overrides (Example):**
A specific component file can export its own defaults that supersede the global ones.
```typescript
// Button.tsx
export const defaultSettings = { padding: '8px' };
```

## 6. Component Implementation Guide (Registry + Directory Pattern)
We use a **Programmatic Registry** for flexibility, organized via a strict **Directory Structure** for maintainability.

### 1. Recommended Directory Structure
`src/components/form-elements/[category]/[Name]/`
- `index.ts`: Entry point. Imports parts and calls `registry.register()`.
- `Component.tsx`: The View (Rendering Logic).
- `Properties.tsx`: The Editor (Properties Panel Logic).
- `config.ts`: Configuration & Default Settings.

### 2. Registration ("Hello World" Example)
You can define this anywhere, but typically in `index.ts`:

```typescript
// src/components/form-elements/custom/HelloWorld/index.ts
import { registry } from '../../components/registry';
import { Component } from './Component';
import { Properties } from './Properties';
import { config, defaultSettings } from './config';

registry.register('hello-world', {
    Component,
    Properties,
    config,
    defaultSettings
});
```

## 7. Migration Strategy
1.  **Scaffolding**: Create the directory structure and `ComponentWrapper`.
2.  **Settings**: Implement `defaultSettings.ts`.
3.  **Registry**: Create `src/components/form-elements/index.ts` map.
4.  **Incremental Rollout**:
    - **Step 1**: Move simple inputs (`Input`, `TextArea`, `Checkbox`).
    - **Step 2**: Move content (`Text`, `Heading`, `Image`).
    - **Step 3**: Move complex layouts (`Container`, `Columns`, `Rows`).
    - **Step 4**: Move `Menu` (most complex).
5.  **Canvas Refactor**: Update `Canvas.tsx` to iterate elements and render `<ComponentRegistry[element.type] />` wrapped in `<ComponentWrapper />`.

## 8. Registry Pattern ( The Wiring )
This is how the system connects the Component's local settings to the Wrapper.

**1. The Component Module**:
Each file exports the component **and** its settings:
```typescript
// form-elements/simple/Input.tsx
export const defaultSettings = { padding: '8px' };
export const Component = ({ element }) => <input ... />;
```

**2. The Registry**:
Imports the *entire module* for each type.
```typescript
// src/components/form-elements/index.ts
import * as InputModule from './simple/Input';
import * as HelloWorldModule from '../templates/HelloWorld';

export const ComponentRegistry: Record<string, any> = {
  'text': InputModule,
  'hello-world': HelloWorldModule,
};
```

**3. The Canvas Loop**:
Passes specific component settings...

**4. The Properties Panel**:
Uses the Registry to find the custom properties editor for the selected element.
```typescript
{/* src/components/PropertiesPanel.tsx */}
const registeredModule = ComponentRegistry[selectedElement.type];
const PropertiesComponent = registeredModule?.PropertiesComponent;

return (
  <div>
     <CommonProperties element={selectedElement} />
     {PropertiesComponent && (
         <PropertiesComponent 
            element={selectedElement} 
            updateElement={updateElement} 
         />
     )}
  </div>
)
```
## 9. Adding Components to the UI (Procedural Generation)
Instead of manually editing a sidebar array, the UI is generated automatically from the registered components.

**How it works:**
1.  **Export Config**: The component file exports `componentConfig` (Label, Icon, Category).
2.  **Register**: Add the component to `ComponentRegistry` in `index.ts`.
    ```typescript
    export const ComponentRegistry = {
       'my-new-type': MyNewComponentModule // 'my-new-type' becomes the ID/Type
    }
    ```
3.  **Auto-Discovery**: The `Sidebar` component iterates over `Object.entries(ComponentRegistry)`.
    - Key = `type` (e.g. 'my-new-type')
    - Value = Module (contains `componentConfig`)
    - Resulting Sidebar Item = `{ id: Key, type: Key, ...Module.componentConfig }`

**Result**: To add a new component, you simply create the file and add *one line* to `index.ts`. The UI updates automatically.

## 10. Modular Properties Architecture
The `PropertiesPanel` is refactored from a monolithic file into a composition of focused providers.

**Directory Structure**: `src/components/properties/`

**Components:**
1.  **`PropertiesPanel.tsx`**: (Main Container) Orchestrates the tabs (Settings, Actions, Code) and selects the active component.
2.  **`CommonProperties.tsx`**: Renders universal fields (ID, Label, Required, Helper Text).
3.  **`LayoutProperties.tsx`**: Renders Spacing (Margin/Padding), Width, and Alignment controls.
4.  **`StyleProperties.tsx`**: Renders Background, Borders, and Typography (if applicable).
5.  **`ExportPanel.tsx`**: Handles the "View Code" (HTML/React/JSON) tab.
6.  **`ActionPanel.tsx`**: Handles Form Submission Actions (Webhooks, Redirects).
7.  **`[Component].tsx`**: (The Modular Part) The component-specific `PropertiesComponent` is rendered *between* Common and Layout.

## 11. Styling Strategy (Data-Driven)
**Crucial Rule**: Components must NOT hardcode layout or color styles (e.g., `p-4`, `bg-blue-50`).
- **Why?** To support Dark Mode and user customization via properties.
- **How?**
    1.  Define initial look in `defaultSettings` (e.g., `{ backgroundColor: '#eff6ff' }`).
    2.  Component reads `element.backgroundColor` or `element.padding`.
    3.  User changes property -> Component updates automatically.
    
**Wrapper vs Component**:
- **Wrapper**: Handles Margins, Width, Border (Selection).
- **Component**: Handles Internal Padding, Content Color, Background Color.

**Integration Flow:**
```tsx
<div className="properties-sidebar">
   <Tabs>
      <Tab value="settings">
          <CommonProperties element={el} />
          {/* Dynamic Component Specific Properties */}
          <ComponentSpecificProperties element={el} />
          <LayoutProperties element={el} />
          <StyleProperties element={el} />
      </Tab>
      <Tab value="actions">
          <ActionPanel settings={formSettings} />
      </Tab>
      <Tab value="code">
          <ExportPanel element={el} />
      </Tab>
   </Tabs>
</div>
```
