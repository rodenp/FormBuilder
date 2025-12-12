# Implementation Plan - Modular Component Refactor


## User Review Required
> [!IMPORTANT]
> This is a massive refactor that touches almost every file in the builder.
> - **Constraint**: Do NOT modify the handling of the canvas including the setting of borders around components added to the canvas.
> - **Constraint**: Your task is only concerned with the modularisation of the components.
> - **Constraint**: Do not add any new logic to the canvas other than what is needed to refactor the code.
> - **Constraint**: Do not try to improve any of the code or change any existing function names.
> - **Risk**: Drag and drop behaviors might need re-tuning after migration.
> - **Change**: All component styling will now be driven by `src/settings/defaultSettings.ts`.
> - **Verify**: Please review the `architecture_design.md` to confirm the philosophy matches your vision.

## Proposed Changes

### 1. Infrastructure Setup
#### [NEW] [defaultSettings.ts](file:///Users/osx/Applications/AI/Form%20Builder/src/settings/defaultSettings.ts)
- Define `ComponentSettings` interface.
- Export `defaultSettings` object with user-specified margins/paddings for each type.

#### [NEW] [ComponentWrapper.tsx](file:///Users/osx/Applications/AI/Form%20Builder/src/components/builder/ComponentWrapper.tsx)
- Implements the generic logic for:
    - Reading `useStore().settings` + `defaultSettings`.
    - **Merging Strategy**: Partial merge (shallow) using spread syntax.
      ```js
      const finalSettings = { ...globalDefaults, ...componentSettings, ...instanceProps };
      ```
    - Applying margins/paddings.
    - Handling `onClick` for selection.
    - Rendering the `children`.

### 2. Component Migration
I will create a new directory `src/components/form-elements/`.
### 1. Infrastructure Setup
#### [NEW] [registry.ts](file:///Users/osx/Applications/AI/Form%20Builder/src/components/registry.ts)
- Implement `ComponentRegistry` class with `register()`, `get()`, `getAll()`.
- Export singleton instance `registry`.

#### [CREATE] [ComponentWrapper.tsx](file:///Users/osx/Applications/AI/Form%20Builder/src/components/builder/ComponentWrapper.tsx)
- Generic wrapper styling.

#### [NEW] [index.ts]
- Single entry point that imports all component files to trigger registration.

### 2. Component Migration
We will still use the directory structure for organization, but registration is decoupled.

**Crucial Styling Rule**: Components must NOT use hardcoded padding/colors (e.g., `p-4`, `bg-blue-50`). All styles must come from `element` properties, initialized by `defaultSettings`.

**Directory Structure:** `src/components/form-elements/[category]/[Name]/`
- `index.ts`: Calls `registry.register(...)`.

**Files to Create:**
- **Inputs**: `simple/Input/`, `simple/TextArea/`, etc.
- **Content**: `content/TextBlock/`, `content/Heading/`, etc.
- ...
- **Button Migration**:
    - [x] Add additional button properties
    - [ ] Migrate `Button` logic

### 3. Registry & Canvas Integration
#### [NEW] [index.ts](file:///Users/osx/Applications/AI/Form%20Builder/src/components/form-elements/index.ts)
- `export const ComponentRegistry = { ... }`

#### [MODIFY] [Sidebar.tsx](file:///Users/osx/Applications/AI/Form%20Builder/src/components/Sidebar.tsx)
- Remove hardcoded `sidebarItems`.
- Iterate `Object.entries(ComponentRegistry)` to generate draggable items using `componentConfig` + inferred ID.

### 4. Modularize Properties Panel (STRICT VISUAL PARITY)
**CRITICAL**: The visual appearance of the Properties Panel must remain **EXACTLY** the same.
- Do **NOT** redesign or "improve" the UI.
- **Extract** existing JSX into sub-components.
- Do **NOT** change class names, margins, paddings, or layout structures unless absolutely necessary for the file split.

#### Reference: Original PropertiesPanel.tsx
- Read the original file first.
- Copy-paste sections into new files.

#### Components to Create (By Extraction)
- `src/components/properties/CommonProperties.tsx` (Logic: properties common to all elements)
- `src/components/properties/LayoutProperties.tsx` (Logic: margins, padding, width, display)
- `src/components/properties/StyleProperties.tsx` (Logic: colors, typography)
- `src/components/properties/ActionPanel.tsx` (Logic: form actions)
- `src/components/properties/ExportPanel.tsx` (Logic: code export)
#### [MODIFY] [PropertiesPanel.tsx](file:///Users/osx/Applications/AI/Form%20Builder/src/components/PropertiesPanel.tsx)
- **Goal**: Decompose monolithic file.
- **Action**: Create `src/components/properties/` directory.
- **Step 1**: Extract `CommonProperties.tsx` (ID, Label, Name, Required).
- **Step 2**: Extract `LayoutProperties.tsx` (Margin, Padding, Width).
- **Step 3**: Extract `StyleProperties.tsx` (Backgrounds, Borders).
- **Step 4**: Extract `ExportPanel.tsx` (Code Generation).
- **Step 5**: Extract `ActionPanel.tsx` (Submission Actions).
- **Step 6**: Refactor `PropertiesPanel.tsx` to compose these + Registry lookup.
  ```tsx
  // PropertiesPanel.tsx Main Render
  return (
    <Tabs>
       <SettingsTab>
          <CommonProperties element={el} />
          {RegistryComponent && <RegistryComponent element={el} />}
          <LayoutProperties element={el} />
          <StyleProperties element={el} />
       </SettingsTab>
       <ActionsTab><ActionPanel /></ActionsTab>
       <CodeTab><ExportPanel /></CodeTab>
    </Tabs>
  )
  ```

#### [MODIFY] [Canvas.tsx](file:///Users/osx/Applications/AI/Form%20Builder/src/components/Canvas.tsx)
- Use `ComponentRegistry` to lookup components for rendering.
- Pass `componentDefaults` to `ComponentWrapper`.

## Verification Plan
### Automated Tests
- None currently set up.

### Manual Verification
1.  **Canvas Height**: Verify the canvas takes full device height.
2.  **Defaults**:
    - Check Input: Top margin 4px?
    - Check Button: Padding 8px, Margin 0?
    - Check Columns: Margin/Padding 0?
3.  **Refactor Integrity**:
    - Drag a generic input: Does it render?
    - Drag a layout (columns): Does it drop?
    - Drag into a layout: Does nesting work?
4.  **Settings**:
    - Change a setting in `defaultSettings.ts` -> Does it reflect on canvas immediately?
