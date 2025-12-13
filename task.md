# Task List: Modular Component Refactor

## 1. Infrastructure Setup
- [x] Create `defaultSettings.ts`
- [x] Create `registry.ts`
- [x] Create `ComponentWrapper.tsx`
- [x] Create `src/components/form-elements/index.ts`

## 2. Component Migration
### Inputs
- [x] Migrate `Input` (Text)
- [x] Migrate `TextArea`
- [x] Migrate `Select`
- [x] Migrate `Checkbox`
- [x] Migrate `Radio`
- [x] Migrate `Number`

### Content & Layout
- [x] Migrate `Heading`
- [x] Migrate `TextBlock` (Paragraph)
- [x] Add additional button properties
    - [x] Create 'Button Actions', 'Button Options', 'Layout', 'Border', 'Rounded Border' sections
    - [x] Implement granular border and radius controls
    - [x] Move LayoutPanel options for button
    - [x] Refine Border & Rounded Border UI (Visual Box Model)
    - [x] Refine Width Toggle & Inputs (Light mode & visibility)
    - [x] Add Typography Controls (Font Family, Weight, Size) to Button Options
- [x] Migrate Button logic ('Migrate Button')
    - [x] Add clear option for button text color
    - [x] Fix button inheritance logic (text color bleeding, border defaults)
    - [x] Fix button background deletion (force transparent override)
    - [x] Implement theme-adaptive button defaults (CSS variables)
- [x] Migrate Image
    - [x] Create `Image/Component.tsx`
    - [x] Create `Image/config.ts`
    - [x] Create `Image/index.ts`
    - [x] Register in `componentHtml.tsx`
- [x] Migrate Menu
    - [x] Create `Menu/Component.tsx`
    - [x] Create `Menu/config.ts`
    - [x] Create `Menu/index.ts`
    - [x] Register in `componentHtml.tsx` (Partially: Properties only to support builder interactivity)
    - [x] Refine Menu Properties UI (Remove #/Tab clutter, simplify list)
    - [x] Fix Properties Panel Overflow (Flexbox refactor)
- [x] Migrate Social Links
    - [x] Create `Social/Component.tsx`
    - [x] Create `Social/config.ts`
    - [x] Create `Social/index.ts`
    - [x] Register in `componentHtml.tsx`
    - [x] Refactor Social Properties UI
    - [x] Remove duplicated "Style & Layout" controls <!-- id: 4 -->
    - [x] Remove duplicated dynamic rendering in PropertiesPanel <!-- id: 5 -->
    - [x] Restore specific Alignment controls <!-- id: 6 -->
    - [x] Structure "Social Media Settings" collapsible menu <!-- id: 7 -->
    - [x] Restore "Layout" section as collapsible <!-- id: 8 -->
    - [x] Restrict "Layout" to Box Model only for Social elements <!-- id: 9 -->
    - [x] Add simplified Alignment controls for Menu, Social, Columns <!-- id: 12 -->
    - [x] Move "Social Media Settings" above "Layout" <!-- id: 10 -->
    - [x] Ensure "Layout" section is open by default <!-- id: 11 --> (Layout & Theming)
- [x] Migrate Columns
- [x] Migrate Rows
- [x] Migrate Grid
- [x] Migrate Container

## 3. Properties Panel Modularization
- [x] Extract `CommonProperties.tsx`
- [x] Extract `LayoutProperties.tsx`
- [x] Extract `StyleProperties.tsx`
- [x] Extract `ActionPanel.tsx`
- [x] Extract `ExportPanel.tsx`
- [x] Refactor `PropertiesPanel.tsx` to use sub-components

## 4. Final Polish
- [ ] Verify all drag-and-drop flows
- [ ] Ensure visual parity check
