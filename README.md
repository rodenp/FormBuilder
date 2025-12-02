# Advanced Form Builder

A powerful, drag-and-drop form builder built with React, TypeScript, and Tailwind CSS. Create complex forms with nested layouts, dynamic styling, and advanced submission handling.

## 🚀 Features

### Core Form Building
- **Drag & Drop Interface**: Intuitive sidebar with form elements that can be dragged onto the canvas
- **Real-time Preview**: Live preview with device simulation (Mobile, Tablet, Desktop)
- **Visual Form Builder**: Canvas-based editing with visual feedback
- **Form Settings**: Comprehensive settings with tabbed interface (Settings, Styling, Actions)

### Form Elements
- **Input Types**: Text, email, number, date, time, month, textarea
- **Selection Controls**: Select dropdown, radio groups, checkboxes
- **Interactive Elements**: Star rating component
- **Content Elements**: Rich text editor with link support, hidden fields
- **Layout Components**: Containers and responsive columns

### Advanced Layout System
- **Nested Containers**: Unlimited nesting depth - containers inside containers
- **Responsive Columns**: 2-12 column layouts with mobile responsiveness
- **Component Sizing**: 12-column grid system with visual resize handles
- **Width Management**: Automatic width calculation for nested elements
- **Flexible Layouts**: Components take full width inside containers

### Layout Capabilities
- ✅ **Containers in Containers**: Nest container components infinitely
- ✅ **Components in Nested Containers**: Form inputs work at any nesting level
- ✅ **Columns in Containers**: Column layouts inside container components
- ✅ **Containers in Columns**: Container components inside column layouts
- ✅ **Mixed Nesting**: Any combination of containers and columns

### Dynamic Styling System
- **Primary Color Theming**: Global color scheme with real-time preview
- **Form Background**: Customizable background colors
- **Input Styling**: Rounded, square, or pill-shaped inputs
- **Button Styling**: Matching button styles with theming
- **Label Formatting**: Size, weight, bold, italic, underline, strikethrough
- **Responsive Design**: Automatic mobile optimization

### Element Management
- **Drag to Reorder**: Visual reordering with up/down arrows
- **Resize Components**: Interactive resize handles for width adjustment
- **Duplicate Elements**: Copy button works at all nesting levels
- **Delete Elements**: Remove elements with confirmation
- **Element Selection**: Click to select and edit properties
- **Circular Nesting Prevention**: Smart validation prevents infinite loops

### Advanced Properties Panel
- **Tabbed Interface**: Organized settings, styling, and actions
- **Dynamic Properties**: Context-aware property panels
- **Label Formatting**: Icon-based formatting controls
- **Validation Rules**: Required field validation
- **Element Options**: Dynamic options for select/radio elements
- **Rich Text Editing**: WYSIWYG editor with link insertion

### Form Submission & Actions
- **Multiple Actions**: Configure multiple submission actions
- **Action Types**:
  - **Webhooks**: POST data to external endpoints with custom headers
  - **Redirects**: Navigate to URLs (same tab or new window)
  - **Messages**: Show success/info/warning/error messages
- **Conditional Actions**: Enable/disable actions based on other configurations
- **Legacy Support**: Backward compatible with simple form actions
- **Action Status**: Visual feedback on executed actions

### Export & Integration
- **JSON Export**: Export form schema as JSON
- **React Components**: Generate React component code
- **NPM Package**: Standalone package for easy integration
- **Multiple Frameworks**: Support for Next.js and Vite projects
- **Backend Integration**: Convex backend examples included

## 📦 Project Structure

```
Form Builder/
├── src/                          # Main form builder application
│   ├── components/
│   │   ├── Canvas.tsx           # Drag-drop canvas with nested support
│   │   ├── Sidebar.tsx          # Draggable element palette
│   │   ├── PropertiesPanel.tsx  # Tabbed settings panel
│   │   ├── Preview.tsx          # Device preview with recursive rendering
│   │   ├── FormBuilder.tsx      # Main orchestrator component
│   │   └── RichTextEditor.tsx   # WYSIWYG content editor
│   ├── store/
│   │   └── useStore.ts          # Zustand state management
│   ├── types.ts                 # TypeScript type definitions
│   └── main.tsx
├── lib/                         # NPM package (@form-builder/core)
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormBuilder.tsx  # Package main component
│   │   │   ├── FormRenderer.tsx # Runtime form renderer
│   │   │   └── Canvas.tsx       # Canvas with nested container support
│   │   ├── store/useStore.ts    # State management
│   │   ├── types.ts             # Type definitions
│   │   └── index.ts             # Package exports
│   ├── package.json             # Package configuration
│   └── vite.config.ts           # Library build config
└── examples/                    # Integration examples
    ├── nextjs-convex/           # Next.js + Convex example
    └── react-vite-convex/       # React + Vite + Convex example
```

## 🏗️ Installation & Usage

### Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd form-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

### Using as NPM Package

```bash
# In your project directory
npm install @form-builder/core
```

```tsx
import { FormBuilder, FormRenderer } from '@form-builder/core';
import '@form-builder/core/dist/style.css';

// Form Builder Component
function MyFormBuilder() {
  return <FormBuilder />;
}

// Form Renderer Component
function MyForm() {
  const formSchema = {
    settings: { title: 'My Form' },
    elements: [/* form elements */]
  };

  const handleSubmit = async (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <FormRenderer 
      schema={formSchema} 
      onSubmit={handleSubmit} 
    />
  );
}
```

## 🔧 Technical Implementation

### State Management
- **Zustand Store**: Centralized state management
- **Recursive Operations**: All operations support unlimited nesting
- **Immutable Updates**: Safe state updates with proper TypeScript typing
- **Circular Reference Prevention**: Smart validation for container nesting

### Drag & Drop System
- **@dnd-kit/core**: Modern drag and drop library
- **Sortable Elements**: Reorderable components with visual feedback
- **Nested Drop Zones**: Containers and columns as droppable areas
- **Multi-level Nesting**: Support for complex nested structures

### Styling System
- **Tailwind CSS**: Utility-first CSS framework
- **Dynamic Theming**: Runtime color scheme changes
- **Responsive Design**: Mobile-first responsive layouts
- **Component Variants**: Flexible styling options

### Form Handling
- **React Hook Form**: Performant form validation and submission
- **Dynamic Registration**: Runtime form field registration
- **Nested Field Support**: Handles complex nested form structures
- **Validation**: Built-in and custom validation rules

## 🌟 Key Features Explained

### Nested Container System
The form builder supports unlimited nesting depth:
- **Container Components**: Can contain any other elements including other containers
- **Column Components**: Create responsive grid layouts
- **Mixed Nesting**: Containers inside columns, columns inside containers
- **Width Management**: Automatic width calculation for nested elements
- **Duplicate Support**: Copy functionality works at all nesting levels

### Dynamic Styling
Real-time styling with instant preview:
- **Primary Color**: Global theming that updates all components
- **Form Background**: Customizable background colors
- **Input Borders**: Rounded, square, or pill shapes
- **Label Formatting**: Rich text formatting with icon controls

### Advanced Actions
Powerful submission handling:
- **Multiple Actions**: Configure multiple submission behaviors
- **Webhooks**: Send data to external APIs with custom headers
- **Redirects**: Navigate users after submission
- **Messages**: Display custom success/error messages
- **Conditional Logic**: Enable/disable actions based on form configuration

## 🔄 Recent Updates

### Version 2.0 Features
- ✅ **Unlimited Nesting**: Containers inside containers with full functionality
- ✅ **Recursive Operations**: All CRUD operations work at any nesting level
- ✅ **Enhanced Preview**: Recursive rendering handles complex nested structures
- ✅ **Improved Duplication**: Copy functionality works for nested elements
- ✅ **Better Width Management**: Automatic full-width for nested components
- ✅ **Circular Prevention**: Smart validation prevents infinite nesting loops

### Layout Enhancements
- ✅ **Flexbox Containers**: Changed from CSS Grid to Flexbox for better nesting
- ✅ **Responsive Columns**: Mobile-responsive column layouts
- ✅ **Visual Resize**: Interactive resize handles for component widths
- ✅ **Element Spacing**: Configurable gap between form elements

### UI/UX Improvements
- ✅ **Tabbed Settings**: Organized settings into Settings, Styling, Actions tabs
- ✅ **Icon Formatting**: Replaced dropdown with formatting icon buttons
- ✅ **Device Preview**: Mobile, tablet, desktop simulation with rotation
- ✅ **Rich Text Links**: Full link editing support in rich text components

## 🚀 Getting Started

1. **Run Development Server**: `npm run dev`
2. **Build Form**: Drag elements from sidebar to canvas
3. **Configure Properties**: Use the right panel to customize elements
4. **Add Containers**: Use container and column components for layout
5. **Style Form**: Configure colors and styling in the Styling tab
6. **Set Actions**: Configure submission behavior in the Actions tab
7. **Preview**: Use the Preview button to test your form
8. **Export**: Export as JSON or integrate using the NPM package

## 🤝 Contributing

This is an advanced form builder with comprehensive nesting support, dynamic styling, and powerful submission actions. The codebase is well-structured with TypeScript throughout and extensive documentation.

## 📄 License

MIT License - see LICENSE file for details