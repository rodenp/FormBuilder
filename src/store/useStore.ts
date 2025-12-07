import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FormElement, FormSettings, FormElementType, Project, ProjectType, GalleryImage } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface FormStore {
    // Project management
    currentProject: Project | null;
    projects: Project[];
    projectListOpen: boolean;
    
    // Current builder state
    elements: FormElement[];
    selectedElementId: string | null;
    settings: FormSettings;
    addElement: (type: FormElementType, parentId?: string) => void;
    addElementAtStart: (type: FormElementType) => void;
    removeElement: (id: string) => void;
    duplicateElement: (id: string) => void;
    updateElement: (id: string, updates: Partial<FormElement>) => void;
    selectElement: (id: string | null) => void;
    reorderElements: (elements: FormElement[]) => void;
    moveElementToContainer: (elementId: string, containerId: string) => void;
    moveElementToColumnPosition: (elementId: string, containerId: string, columnIndex: number) => void;
    moveElementToRowPosition: (elementId: string, containerId: string, rowIndex: number) => void;
    insertElementBefore: (elementId: string, targetElementId: string, targetParentId?: string) => void;
    insertElementAfter: (elementId: string, targetElementId: string, targetParentId?: string) => void;
    addElementBefore: (type: FormElementType, targetElementId: string, targetParentId?: string) => void;
    addElementAfter: (type: FormElementType, targetElementId: string, targetParentId?: string) => void;
    addElementToColumnPosition: (type: FormElementType, containerId: string, columnIndex: number) => void;
    removeElementFromContainer: (elementId: string, containerId: string) => void;
    moveElementUp: (id: string, parentId?: string) => void;
    moveElementDown: (id: string, parentId?: string) => void;
    updateSettings: (settings: Partial<FormSettings>) => void;
    
    // Project management methods
    createProject: (name: string, type: ProjectType) => void;
    loadProject: (projectId: string) => void;
    saveCurrentProject: () => void;
    deleteProject: (projectId: string) => void;
    duplicateProject: (projectId: string) => void;
    updateProjectName: (name: string) => void;
    setProjectListOpen: (open: boolean) => void;
    clearCurrentProject: () => void;
    
    // Image gallery management
    imageGallery: GalleryImage[];
    addImageToGallery: (image: Omit<GalleryImage, 'id' | 'createdAt'>) => GalleryImage;
    removeImageFromGallery: (imageId: string) => void;
    updateGalleryImage: (imageId: string, updates: Partial<GalleryImage>) => void;
    clearImageGallery: () => void;
}

export const useStore = create<FormStore>()(
    persist(
        (set, get) => ({
            // Project management state
            currentProject: null,
            projects: [],
            projectListOpen: false,
            
            // Current builder state
            elements: [],
            selectedElementId: null,
            settings: {
                title: 'My Form',
                description: '',
                submitButtonText: 'Submit',
                submissionActions: [],
            },
            
            // Image gallery state
            imageGallery: [],

    addElement: (type, parentId) => set((state) => {
        const label = type === 'rich-text' ? '' : `New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        const name = label.toLowerCase().replace(/[^a-z0-9]/g, '_');

        const newElement: FormElement = {
            id: uuidv4(),
            type,
            label,
            name,
            placeholder: '',
            required: false,
            width: 12,
            options: type === 'select' ? [{ label: 'Option 1', value: 'option1' }] : 
                     type === 'radio' ? [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }] : undefined,
            maxStars: type === 'star-rating' ? 5 : undefined,
            children: (type === 'container' || type === 'columns' || type === 'rows' || type === 'grid' || type === 'menu') ? [] : undefined,
            columnCount: type === 'columns' ? 2 : undefined,
            rowCount: type === 'rows' ? 1 : undefined,
            gap: (type === 'container' || type === 'columns' || type === 'rows' || type === 'grid') ? 0 : undefined,
            rowGap: (type === 'rows') ? 0 : undefined,
            labelSize: type !== 'hidden' && type !== 'rich-text' ? 'sm' : undefined,
            labelWeight: type !== 'hidden' && type !== 'rich-text' ? 'medium' : undefined,
            value: type === 'hidden' ? '' : undefined,
            content: type === 'rich-text' ? '<p>Your rich text content here</p>' : 
                    type === 'text-block' ? '<p>Click to edit this text block</p>' : undefined,
            buttonText: type === 'button' ? 'Click me' : undefined,
            buttonType: type === 'button' ? 'button' : undefined,
            buttonStyle: type === 'button' ? 'primary' : undefined,
            buttonSize: type === 'button' ? 'md' : undefined,
            buttonAction: type === 'button' ? 'none' : undefined,
            buttonUrl: type === 'button' ? '' : undefined,
            buttonTarget: type === 'button' ? '_self' : undefined,
            // For Heading
            headingLevel: type === 'heading' ? 1 : undefined,
            // For Image
            imageUrl: type === 'image' ? 'https://placehold.co/400x200/e2e8f0/94a3b8?text=Image' : undefined,
            imageAlt: type === 'image' ? 'Placeholder image' : undefined,
            imageWidth: type === 'image' ? 400 : undefined,
            imageHeight: type === 'image' ? 200 : undefined,
            imageWidthPercent: type === 'image' ? 100 : undefined,
            imageAlign: type === 'image' ? 'left' : undefined,
            // For Navigation
            navItems: type === 'navigation' ? [
                { label: 'Home', href: '#home' },
                { label: 'About', href: '#about' },
                { label: 'Contact', href: '#contact' }
            ] : undefined,
            // For Menu
            menuItems: type === 'menu' ? [
                { label: 'Item 1', href: '#' },
                { label: 'Item 2', href: '#' },
                { label: 'Item 3', href: '#' }
            ] : undefined,
            // Set default layout for containers to flex
            display: (type === 'menu' || type === 'container') ? 'flex' : undefined,
            flexDirection: type === 'menu' ? 'row' : type === 'container' ? 'column' : undefined,
            // For Hero
            heroTitle: type === 'hero' ? 'Welcome to our website' : undefined,
            heroSubtitle: type === 'hero' ? 'Create amazing experiences' : undefined,
            heroButtonText: type === 'hero' ? 'Get Started' : undefined,
            heroButtonUrl: type === 'hero' ? '#' : undefined,
            // For Card
            cardTitle: type === 'card' ? 'Card Title' : undefined,
            cardDescription: type === 'card' ? 'Card description goes here' : undefined,
            cardLink: type === 'card' ? '#' : undefined,
            // Set default padding: 0 for layout containers, 8px/16px for buttons, 16px for content elements, 12px for form inputs
            paddingTop: (['columns', 'grid', 'container', 'rows'].includes(type)) ? 0 : 
                       type === 'button' ? 8 : 
                       ['text-block', 'heading', 'social'].includes(type) ? 4 :
                       ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'datetime-local', 'textarea', 'select', 'checkbox', 'radio', 'hidden', 'rich-text'].includes(type) ? 3 : undefined,
            paddingRight: (['columns', 'grid', 'container', 'rows'].includes(type)) ? 0 : 
                         type === 'button' ? 16 : 
                         ['text-block', 'heading', 'social'].includes(type) ? 4 :
                         ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'datetime-local', 'textarea', 'select', 'checkbox', 'radio', 'hidden', 'rich-text'].includes(type) ? 3 : undefined,
            paddingBottom: (['columns', 'grid', 'container', 'rows'].includes(type)) ? 0 : 
                          type === 'button' ? 8 : 
                          ['text-block', 'heading', 'social'].includes(type) ? 4 :
                          ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'datetime-local', 'textarea', 'select', 'checkbox', 'radio', 'hidden', 'rich-text'].includes(type) ? 3 : undefined,
            paddingLeft: (['columns', 'grid', 'container', 'rows'].includes(type)) ? 0 : 
                        type === 'button' ? 16 : 
                        ['text-block', 'heading', 'social'].includes(type) ? 4 :
                        ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'datetime-local', 'textarea', 'select', 'checkbox', 'radio', 'hidden', 'rich-text'].includes(type) ? 3 : undefined,
            // Add default top margin for spacing between components (except when in containers or for columns/grid)
            marginTop: !parentId && !['columns', 'grid'].includes(type) ? 
                      (type === 'text-block' ? 4 : 8) : 0,
        };
        
        // Columns start with empty cells that can contain multiple elements
        if (type === 'columns') {
            const columnCount = newElement.columnCount || 2;
            newElement.children = Array(columnCount).fill(null).map((_, index) => ({
                id: uuidv4(),
                type: 'container' as FormElementType,
                label: `Column ${index + 1}`,
                name: `column_${index + 1}`,
                placeholder: '',
                required: false,
                width: 12,
                children: [],
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                rowGap: 0,
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 8,
                paddingRight: 8,
                backgroundColor: 'transparent',
                borderRadius: 4
            }));
            // Initialize columnBackgrounds array similar to menuItems
            newElement.columnBackgrounds = Array(columnCount).fill(null);
        } else if (type === 'rows') {
            // Rows start with empty cells that can contain multiple elements
            const rowCount = newElement.rowCount || 1;
            newElement.children = Array(rowCount).fill(null).map((_, index) => ({
                id: uuidv4(),
                type: 'container' as FormElementType,
                label: `Row ${index + 1}`,
                name: `row_${index + 1}`,
                placeholder: '',
                required: false,
                width: 12,
                children: [],
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                rowGap: 0,
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 8,
                paddingRight: 8,
                backgroundColor: 'transparent',
                borderRadius: 4
            }));
            // Initialize rowBackgrounds array similar to columnBackgrounds
            newElement.rowBackgrounds = Array(rowCount).fill(null);
        } else if (type === 'grid') {
            newElement.children = [];
        } else if (type === 'menu') {
            // Add default menu items as children
            newElement.children = [
                {
                    id: uuidv4(),
                    type: 'button' as FormElementType,
                    label: '',
                    name: 'menu_item_1',
                    required: false,
                    width: 12, // Full width for flex behavior
                    buttonText: 'Item 1',
                    buttonStyle: 'link',
                    buttonSize: 'sm',
                    // Link button padding (px-2 py-1)
                    paddingTop: 4,    // py-1 = 0.25rem = 4px
                    paddingBottom: 4,
                    paddingLeft: 8,   // px-2 = 0.5rem = 8px
                    paddingRight: 8
                },
                {
                    id: uuidv4(),
                    type: 'button' as FormElementType,
                    label: '',
                    name: 'menu_item_2',
                    required: false,
                    width: 12, // Full width for flex behavior
                    buttonText: 'Item 2',
                    buttonStyle: 'link',
                    buttonSize: 'sm',
                    // Link button padding (px-2 py-1)
                    paddingTop: 4,
                    paddingBottom: 4,
                    paddingLeft: 8,
                    paddingRight: 8
                },
                {
                    id: uuidv4(),
                    type: 'button' as FormElementType,
                    label: '',
                    name: 'menu_item_3',
                    required: false,
                    width: 12, // Full width for flex behavior
                    buttonText: 'Item 3',
                    buttonStyle: 'link',
                    buttonSize: 'sm',
                    // Link button padding (px-2 py-1)
                    paddingTop: 4,
                    paddingBottom: 4,
                    paddingLeft: 8,
                    paddingRight: 8
                }
            ];
            // Also initialize menuItems property to sync with children
            newElement.menuItems = [
                { label: 'Item 1', href: '#', target: '_self' },
                { label: 'Item 2', href: '#', target: '_self' },
                { label: 'Item 3', href: '#', target: '_self' }
            ];
        }
        
        if (parentId) {
            // Helper function to recursively add to container
            const addToContainer = (elements: FormElement[]): FormElement[] => {
                return elements.map(el => {
                    if (el.id === parentId && (el.type === 'container' || el.type === 'columns' || el.type === 'rows' || el.type === 'grid')) {
                        // If adding to columns, set width to fit the column
                        if (el.type === 'columns') {
                            const columnWidth = 12 / (el.columnCount || 2);
                            newElement.width = columnWidth;
                        } else if (el.type === 'container') {
                            // If adding to container, set to full width
                            newElement.width = 12;
                        }
                        return {
                            ...el,
                            children: [...(el.children || []), newElement]
                        };
                    }
                    if (el.children) {
                        return {
                            ...el,
                            children: addToContainer(el.children)
                        };
                    }
                    return el;
                });
            };
            
            return {
                elements: addToContainer(state.elements),
                selectedElementId: newElement.id,
            };
        } else {
            // Add to root level
            return {
                elements: [...state.elements, newElement],
                selectedElementId: newElement.id,
            };
        }
    }),

    addElementAtStart: (type) => set((state) => {
        const label = type === 'rich-text' ? '' : `New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        const name = label.toLowerCase().replace(/[^a-z0-9]/g, '_');

        const newElement: FormElement = {
            id: uuidv4(),
            type,
            label,
            name,
            placeholder: '',
            required: false,
            width: 12,
            options: type === 'select' ? [{ label: 'Option 1', value: 'option1' }] : 
                     type === 'radio' ? [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }] : undefined,
            maxStars: type === 'star-rating' ? 5 : undefined,
            children: (type === 'container' || type === 'columns' || type === 'rows' || type === 'grid' || type === 'menu') ? [] : undefined,
            columnCount: type === 'columns' ? 2 : undefined,
            gap: (type === 'container' || type === 'columns' || type === 'rows' || type === 'grid') ? 0 : undefined,
            labelSize: type !== 'hidden' && type !== 'rich-text' ? 'sm' : undefined,
            labelWeight: type !== 'hidden' && type !== 'rich-text' ? 'medium' : undefined,
            value: type === 'hidden' ? '' : undefined,
            content: type === 'rich-text' ? '<p>Your rich text content here</p>' : 
                    type === 'text-block' ? '<p>Click to edit this text block</p>' : undefined,
            buttonText: type === 'button' ? 'Click me' : undefined,
            buttonType: type === 'button' ? 'button' : undefined,
            buttonStyle: type === 'button' ? 'primary' : undefined,
            buttonSize: type === 'button' ? 'md' : undefined,
            buttonAction: type === 'button' ? 'none' : undefined,
            buttonUrl: type === 'button' ? '' : undefined,
            buttonTarget: type === 'button' ? '_self' : undefined,
            headingLevel: type === 'heading' ? 1 : undefined,
            imageUrl: type === 'image' ? 'https://placehold.co/400x200/e2e8f0/94a3b8?text=Image' : undefined,
            imageAlt: type === 'image' ? 'Placeholder image' : undefined,
            imageWidth: type === 'image' ? 400 : undefined,
            imageHeight: type === 'image' ? 200 : undefined,
            imageWidthPercent: type === 'image' ? 100 : undefined,
            imageAlign: type === 'image' ? 'left' : undefined,
            navItems: type === 'navigation' ? [
                { label: 'Home', href: '#home' },
                { label: 'About', href: '#about' },
                { label: 'Contact', href: '#contact' }
            ] : undefined,
            menuItems: type === 'menu' ? [
                { label: 'Item 1', href: '#' },
                { label: 'Item 2', href: '#' },
                { label: 'Item 3', href: '#' }
            ] : undefined,
            socialLinks: type === 'social' ? [
                { platform: 'facebook', url: 'https://facebook.com', icon: 'facebook' },
                { platform: 'twitter', url: 'https://twitter.com', icon: 'twitter' },
                { platform: 'instagram', url: 'https://instagram.com', icon: 'instagram' }
            ] : undefined,
            paddingTop: ['text-block', 'heading', 'social'].includes(type) ? 4 : (type === 'container' || type === 'columns' || type === 'rows' || type === 'grid') ? 16 : 8,
            paddingRight: (type === 'container' || type === 'columns' || type === 'rows' || type === 'grid') ? 16 : 8,
            paddingBottom: (type === 'container' || type === 'columns' || type === 'rows' || type === 'grid') ? 16 : 8,
            paddingLeft: (type === 'container' || type === 'columns' || type === 'rows' || type === 'grid') ? 16 : 8,
            marginTop: type === 'text-block' ? 4 : 8,
            marginRight: 0,
            marginBottom: 0,
            marginLeft: 0,
            fontSize: type === 'text-block' ? 14 : undefined,
            borderRadius: type === 'image' ? 8 : undefined,
        };
        
        // Handle menu component special initialization
        if (type === 'menu') {
            newElement.children = [
                {
                    id: uuidv4(),
                    type: 'button' as FormElementType,
                    label: '',
                    name: 'menu_item_1',
                    required: false,
                    width: 12,
                    buttonText: 'Item 1',
                    buttonStyle: 'link',
                    buttonSize: 'sm',
                    paddingTop: 4,
                    paddingBottom: 4,
                    paddingLeft: 8,
                    paddingRight: 8
                },
                {
                    id: uuidv4(),
                    type: 'button' as FormElementType,
                    label: '',
                    name: 'menu_item_2',
                    required: false,
                    width: 12,
                    buttonText: 'Item 2',
                    buttonStyle: 'link',
                    buttonSize: 'sm',
                    paddingTop: 4,
                    paddingBottom: 4,
                    paddingLeft: 8,
                    paddingRight: 8
                },
                {
                    id: uuidv4(),
                    type: 'button' as FormElementType,
                    label: '',
                    name: 'menu_item_3',
                    required: false,
                    width: 12,
                    buttonText: 'Item 3',
                    buttonStyle: 'link',
                    buttonSize: 'sm',
                    paddingTop: 4,
                    paddingBottom: 4,
                    paddingLeft: 8,
                    paddingRight: 8
                }
            ];
        }
        
        // Add to beginning of root level
        return {
            elements: [newElement, ...state.elements],
            selectedElementId: newElement.id,
        };
    }),

    removeElement: (id) => set((state) => {
        // Helper function to sync menu items based on children
        const syncMenuItems = (element: FormElement): FormElement => {
            if (element.type === 'menu' && element.children) {
                const menuItems = element.children
                    .filter(child => child && child.type === 'button')
                    .map(child => ({
                        label: child.buttonText || 'Menu Item',
                        href: child.buttonUrl || '#',
                        target: child.buttonTarget || '_self' as '_self' | '_blank'
                    }));
                return { ...element, menuItems };
            }
            return element;
        };

        // Helper function to find the parent of the element to be removed
        const findParent = (elements: FormElement[], targetId: string): FormElement | null => {
            for (const el of elements) {
                if (!el) continue;
                if (el.children) {
                    // Check if target is a direct child
                    if (el.children.some(child => child && child.id === targetId)) {
                        return el;
                    }
                    // Recursively search in nested elements
                    const found = findParent(el.children, targetId);
                    if (found) return found;
                }
            }
            return null;
        };

        // Helper function to remove element recursively
        const removeFromElements = (elements: FormElement[]): FormElement[] => {
            return elements
                .filter(el => el && el.id !== id) // Skip undefined elements and filter by id
                .map(el => {
                    if (!el) return el; // Handle undefined elements
                    
                    // Special handling for columns - replace with undefined instead of removing
                    if (el.type === 'columns' && el.children) {
                        const updatedChildren = el.children.map(child => {
                            if (!child) return child;
                            // If the direct child is the target, replace with undefined
                            if (child.id === id) {
                                return undefined;
                            }
                            // If the child has its own children, process them recursively
                            if (child.children) {
                                const processedChild = {
                                    ...child,
                                    children: removeFromElements(child.children)
                                };
                                return processedChild;
                            }
                            return child;
                        });
                        return syncMenuItems({
                            ...el,
                            children: updatedChildren
                        });
                    }
                    
                    const updatedEl = {
                        ...el,
                        children: el.children ? removeFromElements(el.children) : undefined
                    };
                    
                    // Sync menu items if this is a menu component
                    return syncMenuItems(updatedEl);
                });
        };

        return {
            elements: removeFromElements(state.elements),
            selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
        };
    }),

    duplicateElement: (id) => set((state) => {
        // Helper function to sync menu items based on children
        const syncMenuItems = (element: FormElement): FormElement => {
            if (element.type === 'menu' && element.children) {
                const menuItems = element.children
                    .filter(child => child && child.type === 'button')
                    .map(child => ({
                        label: child.buttonText || 'Menu Item',
                        href: child.buttonUrl || '#',
                        target: child.buttonTarget || '_self' as '_self' | '_blank'
                    }));
                return { ...element, menuItems };
            }
            return element;
        };

        // Helper function to recursively duplicate elements with new IDs
        const cloneElementWithNewIds = (element: FormElement): FormElement => {
            const newElement = {
                ...element,
                id: uuidv4(),
                label: element.label.includes('(Copy)') ? element.label : `${element.label} (Copy)`,
                children: element.children ? element.children.map(child => child ? cloneElementWithNewIds(child) : child) : undefined
            };
            return newElement;
        };

        // Helper function to find and duplicate element recursively
        const duplicateInElements = (elements: FormElement[]): FormElement[] => {
            for (let i = 0; i < elements.length; i++) {
                if (!elements[i]) continue; // Skip undefined elements
                if (elements[i].id === id) {
                    // Found the element to duplicate at this level
                    const elementToDuplicate = elements[i];
                    const newElement = cloneElementWithNewIds(elementToDuplicate);
                    
                    // Insert after the current element
                    const newElements = [...elements];
                    newElements.splice(i + 1, 0, newElement);
                    return newElements;
                }
                
                if (elements[i].children) {
                    // Recursively search in children
                    const updatedChildren = duplicateInElements(elements[i].children);
                    if (updatedChildren !== elements[i].children) {
                        // A duplication happened in children, update this parent
                        const newElements = [...elements];
                        newElements[i] = syncMenuItems({
                            ...elements[i],
                            children: updatedChildren
                        });
                        return newElements;
                    }
                }
            }
            return elements;
        };

        const newElements = duplicateInElements(state.elements);
        
        // If no changes were made, the element wasn't found
        if (newElements === state.elements) {
            return state;
        }

        return {
            elements: newElements,
            selectedElementId: id, // Keep the original element selected
        };
    }),

    updateElement: (id, updates) => set((state) => {
        // Helper function to update element recursively
        const updateInElements = (elements: FormElement[]): FormElement[] => {
            return elements.map(el => {
                if (!el) return el; // Handle undefined elements
                if (el.id === id) {
                    const updatedElement = { ...el, ...updates };
                    
                    // Sync menuItems to children for menu components
                    if (updatedElement.type === 'menu' && updates.menuItems) {
                        updatedElement.children = updates.menuItems.map((item: any) => ({
                            id: uuidv4(),
                            type: 'button' as FormElementType,
                            label: '',
                            name: `menu_item_${item.label.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
                            required: false,
                            width: 12,
                            buttonText: item.label,
                            buttonStyle: 'link',
                            buttonSize: 'sm',
                            paddingTop: 4,
                            paddingBottom: 4,
                            paddingLeft: 8,
                            paddingRight: 8
                        }));
                    }
                    
                    return updatedElement;
                }
                if (el.children) {
                    return {
                        ...el,
                        children: updateInElements(el.children)
                    };
                }
                return el;
            });
        };

        return {
            elements: updateInElements(state.elements),
        };
    }),

    selectElement: (id) => set({ selectedElementId: id }),

    reorderElements: (elements) => set({ elements }),

    moveElementToContainer: (elementId, containerId) => set((state) => {
        // Helper function to sync menu items based on children
        const syncMenuItems = (element: FormElement): FormElement => {
            if (element.type === 'menu' && element.children) {
                const menuItems = element.children
                    .filter(child => child && child.type === 'button')
                    .map(child => ({
                        label: child.buttonText || 'Menu Item',
                        href: child.buttonUrl || '#',
                        target: child.buttonTarget || '_self' as '_self' | '_blank'
                    }));
                return { ...element, menuItems };
            }
            return element;
        };

        // Prevent moving an element into itself or its descendants
        const isDescendant = (parentId: string, elements: FormElement[]): boolean => {
            for (const el of elements) {
                if (el.id === parentId) return true;
                if (el.children && isDescendant(parentId, el.children)) return true;
            }
            return false;
        };
        
        // Find the element to move to check if target is its descendant
        const findElement = (id: string, elements: FormElement[]): FormElement | null => {
            for (const el of elements) {
                if (el.id === id) return el;
                if (el.children) {
                    const found = findElement(id, el.children);
                    if (found) return found;
                }
            }
            return null;
        };
        
        const elementToMoveRef = findElement(elementId, state.elements);
        if (elementToMoveRef && elementToMoveRef.children && isDescendant(containerId, elementToMoveRef.children)) {
            return state; // Prevent circular nesting
        }
        
        // First find and remove the element from wherever it is
        let elementToMove: FormElement | null = null;
        
        const removeFromElements = (elements: FormElement[]): FormElement[] => {
            return elements.filter(el => {
                if (el.id === elementId) {
                    elementToMove = el;
                    return false;
                }
                return true;
            }).map(el => ({
                ...el,
                children: el.children ? removeFromElements(el.children) : undefined
            }));
        };

        const newElements = removeFromElements(state.elements);
        
        if (!elementToMove) return state;

        // Then add it to the target container (recursively search)
        const addToContainer = (elements: FormElement[]): FormElement[] => {
            return elements.map(el => {
                if (el.id === containerId && (el.type === 'container' || el.type === 'columns' || el.type === 'rows' || el.type === 'grid' || el.type === 'menu')) {
                    // Adjust width based on container type
                    if (el.type === 'columns' && elementToMove) {
                        const columnWidth = 12 / (el.columnCount || 2);
                        elementToMove.width = columnWidth;
                    } else if ((el.type === 'container' || el.type === 'rows' || el.type === 'grid' || el.type === 'menu') && elementToMove) {
                        // If moving to container, rows, grid, or menu, set to full width
                        elementToMove.width = 12;
                        
                        // If moving a button to a menu, apply menu item styling
                        if (el.type === 'menu' && elementToMove.type === 'button') {
                            elementToMove.buttonStyle = 'link';
                            elementToMove.buttonSize = 'sm';
                            elementToMove.paddingTop = 4;
                            elementToMove.paddingBottom = 4;
                            elementToMove.paddingLeft = 8;
                            elementToMove.paddingRight = 8;
                        }
                    }
                    const updatedEl = {
                        ...el,
                        children: [...(el.children || []), elementToMove!]
                    };
                    return syncMenuItems(updatedEl);
                }
                if (el.children) {
                    const updatedEl = {
                        ...el,
                        children: addToContainer(el.children)
                    };
                    return syncMenuItems(updatedEl);
                }
                return el;
            });
        };

        return {
            elements: addToContainer(newElements),
        };
    }),

    moveElementToColumnPosition: (elementId, containerId, columnIndex) => set((state) => {
        // Prevent moving an element into itself or its descendants
        const isDescendant = (parentId: string, elements: FormElement[]): boolean => {
            for (const el of elements) {
                if (el.id === parentId) return true;
                if (el.children && isDescendant(parentId, el.children)) return true;
            }
            return false;
        };
        
        // Find the element to move
        const findElement = (id: string, elements: FormElement[]): FormElement | null => {
            for (const el of elements) {
                if (!el) continue;
                if (el.id === id) return el;
                if (el.children) {
                    const found = findElement(id, el.children);
                    if (found) return found;
                }
            }
            return null;
        };
        
        const elementToMoveRef = findElement(elementId, state.elements);
        if (elementToMoveRef && elementToMoveRef.children && isDescendant(containerId, elementToMoveRef.children)) {
            return state; // Prevent circular nesting
        }
        
        // First find and remove the element from wherever it is
        let elementToMove: FormElement | null = null;
        
        const removeFromElements = (elements: FormElement[]): FormElement[] => {
            return elements.map(el => {
                if (!el) return el;
                
                // If this is the element we're looking for, capture it and remove
                if (el.id === elementId) {
                    elementToMove = el;
                    return undefined; // Remove it by setting to undefined
                }
                
                // Special handling for columns - replace with undefined instead of removing completely
                if (el.type === 'columns' && el.children) {
                    const updatedChildren = el.children.map(child => {
                        if (child && child.id === elementId) {
                            elementToMove = child;
                            return undefined; // Replace with undefined to maintain position
                        }
                        return child;
                    });
                    
                    // Check if we found the element in this column's children
                    if (elementToMove) {
                        return {
                            ...el,
                            children: updatedChildren
                        };
                    }
                    
                    // Continue recursing if not found yet
                    return {
                        ...el,
                        children: el.children ? removeFromElements(el.children) : undefined
                    };
                }
                
                // For non-column containers, use filter to remove completely
                if (el.children) {
                    return {
                        ...el,
                        children: removeFromElements(el.children)
                    };
                }
                
                return el;
            }).filter(el => el !== undefined); // Remove undefined elements from root level
        };

        const newElements = removeFromElements(state.elements);
        
        if (!elementToMove) return state;

        // Then add it to the specific column position
        const addToColumnPosition = (elements: FormElement[]): FormElement[] => {
            return elements.map(el => {
                if (!el) return el;
                if (el.id === containerId && el.type === 'columns') {
                    // Clone the children array and ensure it has the right structure
                    const children = el.children || [];
                    const columnCount = el.columnCount || 2;
                    
                    // Create new children array with correct length
                    const updatedChildren = Array(columnCount).fill(undefined);
                    
                    // Copy existing elements to their positions, but only up to columnCount
                    for (let i = 0; i < Math.min(children.length, columnCount); i++) {
                        if (children[i]) {
                            updatedChildren[i] = children[i];
                        }
                    }
                    
                    // Set width based on column layout and create new element object
                    const columnWidth = 12 / columnCount;
                    const updatedElementToMove = {
                        ...elementToMove!,
                        width: columnWidth
                    };
                    
                    // Place element at specific column index
                    updatedChildren[columnIndex] = updatedElementToMove;
                    
                    return {
                        ...el,
                        children: updatedChildren
                    };
                }
                if (el.children) {
                    return {
                        ...el,
                        children: addToColumnPosition(el.children)
                    };
                }
                return el;
            });
        };

        return {
            elements: addToColumnPosition(newElements),
        };
    }),

    moveElementToRowPosition: (elementId, containerId, rowIndex) => set((state) => {
        // Prevent moving an element into itself or its descendants
        const isDescendant = (parentId: string, elements: FormElement[]): boolean => {
            for (const el of elements) {
                if (el.id === parentId) return true;
                if (el.children && isDescendant(parentId, el.children)) return true;
            }
            return false;
        };
        
        // Find the element to move
        const findElement = (id: string, elements: FormElement[]): FormElement | null => {
            for (const el of elements) {
                if (!el) continue;
                if (el.id === id) return el;
                if (el.children) {
                    const found = findElement(id, el.children);
                    if (found) return found;
                }
            }
            return null;
        };
        
        const elementToMoveRef = findElement(elementId, state.elements);
        if (elementToMoveRef && elementToMoveRef.children && isDescendant(containerId, elementToMoveRef.children)) {
            return state; // Prevent circular nesting
        }
        
        // First find and remove the element from wherever it is
        let elementToMove: FormElement | null = null;
        
        const removeFromElements = (elements: FormElement[]): FormElement[] => {
            return elements.map(el => {
                if (!el) return el;
                
                // If this is the element we're looking for, capture it and remove
                if (el.id === elementId) {
                    elementToMove = el;
                    return undefined; // Remove it by setting to undefined
                }
                
                // Special handling for rows - replace with undefined instead of removing completely
                if (el.type === 'rows' && el.children) {
                    const updatedChildren = el.children.map(child => {
                        if (child && child.id === elementId) {
                            elementToMove = child;
                            return undefined; // Replace with undefined to maintain position
                        }
                        return child;
                    });
                    
                    // Check if we found the element in this row's children
                    if (elementToMove) {
                        return {
                            ...el,
                            children: updatedChildren
                        };
                    }
                    
                    // Continue recursing if not found yet
                    return {
                        ...el,
                        children: el.children ? removeFromElements(el.children) : undefined
                    };
                }
                
                // For non-row containers, use filter to remove completely
                if (el.children) {
                    return {
                        ...el,
                        children: removeFromElements(el.children)
                    };
                }
                
                return el;
            }).filter(el => el !== undefined); // Remove undefined elements from root level
        };

        const newElements = removeFromElements(state.elements);
        
        if (!elementToMove) return state;

        // Then add it to the specific row position
        const addToRowPosition = (elements: FormElement[]): FormElement[] => {
            return elements.map(el => {
                if (!el) return el;
                if (el.id === containerId && el.type === 'rows') {
                    // Clone the children array and ensure it has the right structure
                    const children = el.children || [];
                    const rowCount = el.rowCount || 2;
                    
                    // Create new children array with correct length
                    const updatedChildren = Array(rowCount).fill(undefined);
                    
                    // Copy existing elements to their positions, but only up to rowCount
                    for (let i = 0; i < Math.min(children.length, rowCount); i++) {
                        if (children[i]) {
                            updatedChildren[i] = children[i];
                        }
                    }
                    
                    // Set width to full width for rows and create new element object
                    const updatedElementToMove = {
                        ...elementToMove!,
                        width: 12
                    };
                    
                    // Place element at specific row index
                    updatedChildren[rowIndex] = updatedElementToMove;
                    
                    return {
                        ...el,
                        children: updatedChildren
                    };
                }
                if (el.children) {
                    return {
                        ...el,
                        children: addToRowPosition(el.children)
                    };
                }
                return el;
            });
        };

        return {
            elements: addToRowPosition(newElements),
        };
    }),

    insertElementBefore: (elementId, targetElementId, targetParentId) => set((state) => {
        // Find and remove the element from its current location
        let elementToMove: FormElement | null = null;
        
        const removeFromElements = (elements: FormElement[]): FormElement[] => {
            return elements.map(el => {
                if (!el) return el;
                
                // If this is the element we're looking for, capture it and remove
                if (el.id === elementId) {
                    elementToMove = el;
                    return undefined;
                }
                
                // Special handling for columns - replace with undefined
                if (el.type === 'columns' && el.children) {
                    const updatedChildren = el.children.map(child => {
                        if (child && child.id === elementId) {
                            elementToMove = child;
                            return undefined;
                        }
                        return child;
                    });
                    
                    if (elementToMove) {
                        return {
                            ...el,
                            children: updatedChildren
                        };
                    }
                }
                
                // For other containers, recurse
                if (el.children) {
                    return {
                        ...el,
                        children: removeFromElements(el.children)
                    };
                }
                
                return el;
            }).filter(el => el !== undefined);
        };

        const newElements = removeFromElements(state.elements);
        
        if (!elementToMove) return state;
        
        // Insert the element before the target element
        const insertIntoElements = (elements: FormElement[]): FormElement[] => {
            if (!targetParentId) {
                // Insert at root level (before the target element to match visual indicator)
                const targetIndex = elements.findIndex(el => el && el.id === targetElementId);
                if (targetIndex !== -1) {
                    const newElementsArray = [...elements];
                    // Set width to 12 for root level
                    const elementWithRootWidth = { ...elementToMove!, width: 12 };
                    newElementsArray.splice(targetIndex, 0, elementWithRootWidth);
                    return newElementsArray;
                }
                return elements;
            } else {
                // Insert into container
                return elements.map(el => {
                    if (!el) return el;
                    if (el.id === targetParentId) {
                        const children = el.children || [];
                        const targetIndex = children.findIndex(child => child && child.id === targetElementId);
                        if (targetIndex !== -1) {
                            const newChildren = [...children];
                            // Adjust width based on container type
                            let adjustedElement = { ...elementToMove! };
                            if (el.type === 'columns') {
                                adjustedElement.width = 12 / (el.columnCount || 2);
                            } else {
                                adjustedElement.width = 12;
                            }
                            newChildren.splice(targetIndex, 0, adjustedElement);
                            return { ...el, children: newChildren };
                        }
                        return el;
                    }
                    if (el.children) {
                        return {
                            ...el,
                            children: insertIntoElements(el.children)
                        };
                    }
                    return el;
                });
            }
        };

        return {
            elements: insertIntoElements(newElements),
        };
    }),

    insertElementAfter: (elementId, targetElementId, targetParentId) => set((state) => {
        // Find and remove the element from its current location
        let elementToMove: FormElement | null = null;
        
        const removeFromElements = (elements: FormElement[]): FormElement[] => {
            return elements.map(el => {
                if (!el) return el;
                
                // If this is the element we're looking for, capture it and remove
                if (el.id === elementId) {
                    elementToMove = el;
                    return undefined;
                }
                
                // Special handling for columns - replace with undefined
                if (el.type === 'columns' && el.children) {
                    const updatedChildren = el.children.map(child => {
                        if (child && child.id === elementId) {
                            elementToMove = child;
                            return undefined;
                        }
                        return child;
                    });
                    
                    if (elementToMove) {
                        return {
                            ...el,
                            children: updatedChildren
                        };
                    }
                }
                
                // For other containers, recurse
                if (el.children) {
                    return {
                        ...el,
                        children: removeFromElements(el.children)
                    };
                }
                
                return el;
            }).filter(el => el !== undefined);
        };

        const newElements = removeFromElements(state.elements);
        
        if (!elementToMove) return state;
        
        // Insert the element after the target element
        const insertIntoElements = (elements: FormElement[]): FormElement[] => {
            if (!targetParentId) {
                // Insert at root level (after the target element)
                const targetIndex = elements.findIndex(el => el && el.id === targetElementId);
                if (targetIndex !== -1) {
                    const newElementsArray = [...elements];
                    // Set width to 12 for root level
                    const elementWithRootWidth = { ...elementToMove!, width: 12 };
                    newElementsArray.splice(targetIndex + 1, 0, elementWithRootWidth);
                    return newElementsArray;
                }
                return elements;
            } else {
                // Insert into container
                return elements.map(el => {
                    if (!el) return el;
                    if (el.id === targetParentId) {
                        const children = el.children || [];
                        const targetIndex = children.findIndex(child => child && child.id === targetElementId);
                        if (targetIndex !== -1) {
                            const newChildren = [...children];
                            // Adjust width based on container type
                            let adjustedElement = { ...elementToMove! };
                            if (el.type === 'columns') {
                                adjustedElement.width = 12 / (el.columnCount || 2);
                            } else {
                                adjustedElement.width = 12;
                            }
                            newChildren.splice(targetIndex + 1, 0, adjustedElement);
                            return { ...el, children: newChildren };
                        }
                        return el;
                    }
                    if (el.children) {
                        return {
                            ...el,
                            children: insertIntoElements(el.children)
                        };
                    }
                    return el;
                });
            }
        };

        return {
            elements: insertIntoElements(newElements),
        };
    }),

    addElementBefore: (type, targetElementId, targetParentId) => set((state) => {
        // Create new element based on the existing addElement logic
        const label = type === 'rich-text' ? '' : `New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        const name = label.toLowerCase().replace(/[^a-z0-9]/g, '_');

        const newElement: FormElement = {
            id: uuidv4(),
            type,
            label,
            name,
            placeholder: '',
            required: false,
            width: 12,
            options: type === 'select' ? [{ label: 'Option 1', value: 'option1' }] : 
                     type === 'radio' ? [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }] : undefined,
            maxStars: type === 'star-rating' ? 5 : undefined,
            children: (type === 'container' || type === 'columns' || type === 'rows' || type === 'grid' || type === 'menu') ? [] : undefined,
            columnCount: type === 'columns' ? 2 : undefined,
            gap: (type === 'container' || type === 'columns' || type === 'rows' || type === 'grid') ? 0 : undefined,
            labelSize: type !== 'hidden' && type !== 'rich-text' ? 'sm' : undefined,
            labelWeight: type !== 'hidden' && type !== 'rich-text' ? 'medium' : undefined,
            value: type === 'hidden' ? '' : undefined,
            content: type === 'rich-text' ? '<p>Your rich text content here</p>' : 
                    type === 'text-block' ? '<p>Click to edit this text block</p>' : undefined,
            buttonText: type === 'button' ? 'Click me' : undefined,
            buttonType: type === 'button' ? 'button' : undefined,
            buttonStyle: type === 'button' ? 'primary' : undefined,
            buttonSize: type === 'button' ? 'md' : undefined,
            // Set default padding: 0 for layout containers, 8px/16px for buttons, 16px for content elements, 12px for form inputs
            paddingTop: (['columns', 'grid', 'container', 'rows'].includes(type)) ? 0 : 
                       type === 'button' ? 8 : 
                       ['text-block', 'heading', 'social'].includes(type) ? 4 :
                       ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'datetime-local', 'textarea', 'select', 'checkbox', 'radio', 'hidden', 'rich-text'].includes(type) ? 3 : undefined,
            paddingRight: (['columns', 'grid', 'container', 'rows'].includes(type)) ? 0 : 
                         type === 'button' ? 16 : 
                         ['text-block', 'heading', 'social'].includes(type) ? 4 :
                         ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'datetime-local', 'textarea', 'select', 'checkbox', 'radio', 'hidden', 'rich-text'].includes(type) ? 3 : undefined,
            paddingBottom: (['columns', 'grid', 'container', 'rows'].includes(type)) ? 0 : 
                          type === 'button' ? 8 : 
                          ['text-block', 'heading', 'social'].includes(type) ? 4 :
                          ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'datetime-local', 'textarea', 'select', 'checkbox', 'radio', 'hidden', 'rich-text'].includes(type) ? 3 : undefined,
            paddingLeft: (['columns', 'grid', 'container', 'rows'].includes(type)) ? 0 : 
                        type === 'button' ? 16 : 
                        ['text-block', 'heading', 'social'].includes(type) ? 4 :
                        ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'datetime-local', 'textarea', 'select', 'checkbox', 'radio', 'hidden', 'rich-text'].includes(type) ? 3 : undefined,
            // Add default top margin for spacing between components (except when in containers or for columns/grid)
            marginTop: !targetParentId && !['columns', 'grid'].includes(type) ? 
                      (type === 'text-block' ? 4 : 8) : 0,
        };

        // Handle menu component special initialization
        if (type === 'menu') {
            newElement.children = [
                {
                    id: uuidv4(),
                    type: 'button' as FormElementType,
                    label: '',
                    name: 'menu_item_1',
                    required: false,
                    width: 12,
                    buttonText: 'Item 1',
                    buttonStyle: 'link',
                    buttonSize: 'sm',
                    paddingTop: 4,
                    paddingBottom: 4,
                    paddingLeft: 8,
                    paddingRight: 8
                },
                {
                    id: uuidv4(),
                    type: 'button' as FormElementType,
                    label: '',
                    name: 'menu_item_2',
                    required: false,
                    width: 12,
                    buttonText: 'Item 2',
                    buttonStyle: 'link',
                    buttonSize: 'sm',
                    paddingTop: 4,
                    paddingBottom: 4,
                    paddingLeft: 8,
                    paddingRight: 8
                },
                {
                    id: uuidv4(),
                    type: 'button' as FormElementType,
                    label: '',
                    name: 'menu_item_3',
                    required: false,
                    width: 12,
                    buttonText: 'Item 3',
                    buttonStyle: 'link',
                    buttonSize: 'sm',
                    paddingTop: 4,
                    paddingBottom: 4,
                    paddingLeft: 8,
                    paddingRight: 8
                }
            ];
            // Also initialize menuItems property to sync with children
            newElement.menuItems = [
                { label: 'Item 1', href: '#', target: '_self' },
                { label: 'Item 2', href: '#', target: '_self' },
                { label: 'Item 3', href: '#', target: '_self' }
            ];
        }

        // Insert before the target element
        const insertIntoElements = (elements: FormElement[]): FormElement[] => {
            if (!targetParentId) {
                // Insert at root level
                const targetIndex = elements.findIndex(el => el && el.id === targetElementId);
                if (targetIndex !== -1) {
                    const newElementsArray = [...elements];
                    newElement.width = 12; // Full width for root level
                    newElementsArray.splice(targetIndex, 0, newElement);
                    return newElementsArray;
                }
                return elements;
            } else {
                // Insert into container
                return elements.map(el => {
                    if (!el) return el;
                    if (el.id === targetParentId) {
                        const children = el.children || [];
                        const targetIndex = children.findIndex(child => child && child.id === targetElementId);
                        if (targetIndex !== -1) {
                            const newChildren = [...children];
                            // Adjust width based on container type
                            if (el.type === 'columns') {
                                newElement.width = 12 / (el.columnCount || 2);
                            } else {
                                newElement.width = 12;
                            }
                            newChildren.splice(targetIndex, 0, newElement);
                            return { ...el, children: newChildren };
                        }
                        return el;
                    }
                    if (el.children) {
                        return {
                            ...el,
                            children: insertIntoElements(el.children)
                        };
                    }
                    return el;
                });
            }
        };

        return {
            elements: insertIntoElements(state.elements),
            selectedElementId: newElement.id,
        };
    }),

    addElementAfter: (type, targetElementId, targetParentId) => set((state) => {
        // Create new element based on the existing addElement logic
        const label = type === 'rich-text' ? '' : `New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        const name = label.toLowerCase().replace(/[^a-z0-9]/g, '_');

        const newElement: FormElement = {
            id: uuidv4(),
            type,
            label,
            name,
            placeholder: '',
            required: false,
            width: 12,
            options: type === 'select' ? [{ label: 'Option 1', value: 'option1' }] : 
                     type === 'radio' ? [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }] : undefined,
            maxStars: type === 'star-rating' ? 5 : undefined,
            children: (type === 'container' || type === 'columns' || type === 'rows' || type === 'grid' || type === 'menu') ? [] : undefined,
            columnCount: type === 'columns' ? 2 : undefined,
            gap: (type === 'container' || type === 'columns' || type === 'rows' || type === 'grid') ? 0 : undefined,
            labelSize: type !== 'hidden' && type !== 'rich-text' ? 'sm' : undefined,
            labelWeight: type !== 'hidden' && type !== 'rich-text' ? 'medium' : undefined,
            value: type === 'hidden' ? '' : undefined,
            content: type === 'rich-text' ? '<p>Your rich text content here</p>' : 
                    type === 'text-block' ? '<p>Click to edit this text block</p>' : undefined,
            buttonText: type === 'button' ? 'Click me' : undefined,
            buttonType: type === 'button' ? 'button' : undefined,
            buttonStyle: type === 'button' ? 'primary' : undefined,
            buttonSize: type === 'button' ? 'md' : undefined,
            // Set default padding: 0 for layout containers, 8px/16px for buttons, 16px for content elements, 12px for form inputs
            paddingTop: (['columns', 'grid', 'container', 'rows'].includes(type)) ? 0 : 
                       type === 'button' ? 8 : 
                       ['text-block', 'heading', 'social'].includes(type) ? 4 :
                       ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'datetime-local', 'textarea', 'select', 'checkbox', 'radio', 'hidden', 'rich-text'].includes(type) ? 3 : undefined,
            paddingRight: (['columns', 'grid', 'container', 'rows'].includes(type)) ? 0 : 
                         type === 'button' ? 16 : 
                         ['text-block', 'heading', 'social'].includes(type) ? 4 :
                         ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'datetime-local', 'textarea', 'select', 'checkbox', 'radio', 'hidden', 'rich-text'].includes(type) ? 3 : undefined,
            paddingBottom: (['columns', 'grid', 'container', 'rows'].includes(type)) ? 0 : 
                          type === 'button' ? 8 : 
                          ['text-block', 'heading', 'social'].includes(type) ? 4 :
                          ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'datetime-local', 'textarea', 'select', 'checkbox', 'radio', 'hidden', 'rich-text'].includes(type) ? 3 : undefined,
            paddingLeft: (['columns', 'grid', 'container', 'rows'].includes(type)) ? 0 : 
                        type === 'button' ? 16 : 
                        ['text-block', 'heading', 'social'].includes(type) ? 4 :
                        ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'datetime-local', 'textarea', 'select', 'checkbox', 'radio', 'hidden', 'rich-text'].includes(type) ? 3 : undefined,
            // Add default top margin for spacing between components (except when in containers or for columns/grid)
            marginTop: !targetParentId && !['columns', 'grid'].includes(type) ? 
                      (type === 'text-block' ? 4 : 8) : 0,
        };

        // Handle menu component special initialization
        if (type === 'menu') {
            newElement.children = [
                {
                    id: uuidv4(),
                    type: 'button' as FormElementType,
                    label: '',
                    name: 'menu_item_1',
                    required: false,
                    width: 12,
                    buttonText: 'Item 1',
                    buttonStyle: 'link',
                    buttonSize: 'sm',
                    paddingTop: 4,
                    paddingBottom: 4,
                    paddingLeft: 8,
                    paddingRight: 8
                },
                {
                    id: uuidv4(),
                    type: 'button' as FormElementType,
                    label: '',
                    name: 'menu_item_2',
                    required: false,
                    width: 12,
                    buttonText: 'Item 2',
                    buttonStyle: 'link',
                    buttonSize: 'sm',
                    paddingTop: 4,
                    paddingBottom: 4,
                    paddingLeft: 8,
                    paddingRight: 8
                },
                {
                    id: uuidv4(),
                    type: 'button' as FormElementType,
                    label: '',
                    name: 'menu_item_3',
                    required: false,
                    width: 12,
                    buttonText: 'Item 3',
                    buttonStyle: 'link',
                    buttonSize: 'sm',
                    paddingTop: 4,
                    paddingBottom: 4,
                    paddingLeft: 8,
                    paddingRight: 8
                }
            ];
            // Also initialize menuItems property to sync with children
            newElement.menuItems = [
                { label: 'Item 1', href: '#', target: '_self' },
                { label: 'Item 2', href: '#', target: '_self' },
                { label: 'Item 3', href: '#', target: '_self' }
            ];
        }

        // Insert after the target element
        const insertIntoElements = (elements: FormElement[]): FormElement[] => {
            if (!targetParentId) {
                // Insert at root level
                const targetIndex = elements.findIndex(el => el && el.id === targetElementId);
                if (targetIndex !== -1) {
                    const newElementsArray = [...elements];
                    newElement.width = 12; // Full width for root level
                    newElementsArray.splice(targetIndex + 1, 0, newElement);
                    return newElementsArray;
                }
                return elements;
            } else {
                // Insert into container
                return elements.map(el => {
                    if (!el) return el;
                    if (el.id === targetParentId) {
                        const children = el.children || [];
                        const targetIndex = children.findIndex(child => child && child.id === targetElementId);
                        if (targetIndex !== -1) {
                            const newChildren = [...children];
                            // Adjust width based on container type
                            if (el.type === 'columns') {
                                newElement.width = 12 / (el.columnCount || 2);
                            } else {
                                newElement.width = 12;
                            }
                            newChildren.splice(targetIndex + 1, 0, newElement);
                            return { ...el, children: newChildren };
                        }
                        return el;
                    }
                    if (el.children) {
                        return {
                            ...el,
                            children: insertIntoElements(el.children)
                        };
                    }
                    return el;
                });
            }
        };

        return {
            elements: insertIntoElements(state.elements),
            selectedElementId: newElement.id,
        };
    }),

    removeElementFromContainer: (elementId, containerId) => set((state) => {
        // Helper function to sync menu items based on children
        const syncMenuItems = (element: FormElement): FormElement => {
            if (element.type === 'menu' && element.children) {
                const menuItems = element.children
                    .filter(child => child && child.type === 'button')
                    .map(child => ({
                        label: child.buttonText || 'Menu Item',
                        href: child.buttonUrl || '#',
                        target: child.buttonTarget || '_self' as '_self' | '_blank'
                    }));
                return { ...element, menuItems };
            }
            return element;
        };

        const updateContainer = (elements: FormElement[]): FormElement[] => {
            return elements.map(el => {
                if (el.id === containerId && (el.type === 'container' || el.type === 'columns' || el.type === 'rows' || el.type === 'grid' || el.type === 'menu')) {
                    if (el.type === 'columns') {
                        // For columns, maintain array structure with undefined/null slots
                        const updatedChildren = [...(el.children || [])];
                        const elementIndex = updatedChildren.findIndex(child => child?.id === elementId);
                        if (elementIndex !== -1) {
                            updatedChildren[elementIndex] = undefined; // Keep the slot but make it empty
                        }
                        return syncMenuItems({
                            ...el,
                            children: updatedChildren
                        });
                    } else {
                        // For other containers, remove completely
                        return syncMenuItems({
                            ...el,
                            children: (el.children || []).filter(child => child && child.id !== elementId)
                        });
                    }
                }
                if (el.children) {
                    return {
                        ...el,
                        children: updateContainer(el.children)
                    };
                }
                return el;
            });
        };

        return {
            elements: updateContainer(state.elements),
        };
    }),

    moveElementUp: (id, parentId) => set((state) => {
        // Helper function to sync menu items based on children
        const syncMenuItems = (element: FormElement): FormElement => {
            if (element.type === 'menu' && element.children) {
                const menuItems = element.children
                    .filter(child => child && child.type === 'button')
                    .map(child => ({
                        label: child.buttonText || 'Menu Item',
                        href: child.buttonUrl || '#',
                        target: child.buttonTarget || '_self' as '_self' | '_blank'
                    }));
                return { ...element, menuItems };
            }
            return element;
        };

        if (parentId) {
            // Move within container
            const updateContainer = (elements: FormElement[]): FormElement[] => {
                return elements.map(el => {
                    if (el.id === parentId && (el.type === 'container' || el.type === 'columns' || el.type === 'rows' || el.type === 'grid' || el.type === 'menu') && el.children) {
                        const children = [...el.children];
                        const index = children.findIndex(child => child && child.id === id);
                        if (index > 0) {
                            [children[index - 1], children[index]] = [children[index], children[index - 1]];
                        }
                        return syncMenuItems({ ...el, children });
                    }
                    if (el.children) {
                        return { ...el, children: updateContainer(el.children) };
                    }
                    return el;
                });
            };
            return { elements: updateContainer(state.elements) };
        } else {
            // Move in root level
            const elements = [...state.elements];
            const index = elements.findIndex(el => el.id === id);
            if (index > 0) {
                [elements[index - 1], elements[index]] = [elements[index], elements[index - 1]];
            }
            return { elements };
        }
    }),

    moveElementDown: (id, parentId) => set((state) => {
        // Helper function to sync menu items based on children
        const syncMenuItems = (element: FormElement): FormElement => {
            if (element.type === 'menu' && element.children) {
                const menuItems = element.children
                    .filter(child => child && child.type === 'button')
                    .map(child => ({
                        label: child.buttonText || 'Menu Item',
                        href: child.buttonUrl || '#',
                        target: child.buttonTarget || '_self' as '_self' | '_blank'
                    }));
                return { ...element, menuItems };
            }
            return element;
        };

        if (parentId) {
            // Move within container
            const updateContainer = (elements: FormElement[]): FormElement[] => {
                return elements.map(el => {
                    if (el.id === parentId && (el.type === 'container' || el.type === 'columns' || el.type === 'rows' || el.type === 'grid' || el.type === 'menu') && el.children) {
                        const children = [...el.children];
                        const index = children.findIndex(child => child && child.id === id);
                        if (index < children.length - 1) {
                            [children[index], children[index + 1]] = [children[index + 1], children[index]];
                        }
                        return syncMenuItems({ ...el, children });
                    }
                    if (el.children) {
                        return { ...el, children: updateContainer(el.children) };
                    }
                    return el;
                });
            };
            return { elements: updateContainer(state.elements) };
        } else {
            // Move in root level
            const elements = [...state.elements];
            const index = elements.findIndex(el => el.id === id);
            if (index < elements.length - 1) {
                [elements[index], elements[index + 1]] = [elements[index + 1], elements[index]];
            }
            return { elements };
        }
    }),

    updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
    })),

    // Project management methods
    createProject: (name: string, type: ProjectType) => {
        const project: Project = {
            id: uuidv4(),
            name,
            type,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            settings: {
                title: type === 'form' ? 'My Form' : type === 'email' ? 'My Email' : 'My Website',
                description: '',
                submitButtonText: type === 'form' ? 'Submit' : 'Get Started',
                submissionActions: [],
            },
            elements: []
        };

        set((state) => ({
            projects: [...state.projects, project],
            currentProject: project,
            elements: [],
            selectedElementId: null,
            settings: project.settings,
            projectListOpen: false
        }));
    },

    loadProject: (projectId: string) => {
        const state = get();
        const project = state.projects.find(p => p.id === projectId);
        if (project) {
            set({
                currentProject: project,
                elements: project.elements,
                selectedElementId: null,
                settings: project.settings,
                projectListOpen: false
            });
        }
    },

    saveCurrentProject: () => {
        const state = get();
        if (state.currentProject) {
            const updatedProject = {
                ...state.currentProject,
                elements: state.elements,
                settings: state.settings,
                updatedAt: new Date().toISOString()
            };

            set((currentState) => ({
                currentProject: updatedProject,
                projects: currentState.projects.map(p => 
                    p.id === updatedProject.id ? updatedProject : p
                )
            }));
        }
    },

    deleteProject: (projectId: string) => {
        set((state) => {
            const newProjects = state.projects.filter(p => p.id !== projectId);
            const isCurrentProject = state.currentProject?.id === projectId;
            
            return {
                projects: newProjects,
                currentProject: isCurrentProject ? null : state.currentProject,
                elements: isCurrentProject ? [] : state.elements,
                selectedElementId: isCurrentProject ? null : state.selectedElementId,
                settings: isCurrentProject ? {
                    title: 'My Form',
                    description: '',
                    submitButtonText: 'Submit',
                    submissionActions: [],
                } : state.settings
            };
        });
    },

    duplicateProject: (projectId: string) => {
        const state = get();
        const project = state.projects.find(p => p.id === projectId);
        if (project) {
            const duplicatedProject: Project = {
                ...project,
                id: uuidv4(),
                name: `${project.name} (Copy)`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            set((currentState) => ({
                projects: [...currentState.projects, duplicatedProject]
            }));
        }
    },

    updateProjectName: (name: string) => {
        set((state) => {
            if (state.currentProject) {
                const updatedProject = { ...state.currentProject, name, updatedAt: new Date().toISOString() };
                return {
                    currentProject: updatedProject,
                    projects: state.projects.map(p => 
                        p.id === updatedProject.id ? updatedProject : p
                    )
                };
            }
            return state;
        });
    },

    setProjectListOpen: (open: boolean) => set({ projectListOpen: open }),

    // Add element directly to specific column position
    addElementToColumnPosition: (type: FormElementType, containerId: string, columnIndex: number) => set((state) => {
        console.log('addElementToColumnPosition started:', { type, containerId, columnIndex });
        const label = type === 'rich-text' ? '' : `New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        const name = label.toLowerCase().replace(/[^a-z0-9]/g, '_');

        const newElement: FormElement = {
            id: uuidv4(),
            type,
            label,
            name,
            placeholder: '',
            required: false,
            width: 12, // Will be adjusted based on column count
            options: type === 'select' ? [{ label: 'Option 1', value: 'option1' }] : 
                     type === 'radio' ? [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }] : undefined,
            maxStars: type === 'star-rating' ? 5 : undefined,
            children: (type === 'container' || type === 'columns' || type === 'rows' || type === 'grid' || type === 'menu') ? [] : undefined,
            columnCount: type === 'columns' ? 2 : undefined,
            gap: (type === 'container' || type === 'columns' || type === 'rows' || type === 'grid') ? 0 : undefined,
            labelSize: type !== 'hidden' && type !== 'rich-text' ? 'sm' : undefined,
            labelWeight: type !== 'hidden' && type !== 'rich-text' ? 'medium' : undefined,
            value: type === 'hidden' ? '' : undefined,
            content: type === 'rich-text' ? '<p>Your rich text content here</p>' : 
                    type === 'text-block' ? '<p>Click to edit this text block</p>' : undefined,
            buttonText: type === 'button' ? 'Click me' : undefined,
            buttonType: type === 'button' ? 'button' : undefined,
            buttonStyle: type === 'button' ? 'primary' : undefined,
            buttonSize: type === 'button' ? 'md' : undefined,
            buttonAction: type === 'button' ? 'none' : undefined,
            buttonUrl: type === 'button' ? '' : undefined,
            buttonTarget: type === 'button' ? '_self' : undefined,
            headingLevel: type === 'heading' ? 1 : undefined,
            imageUrl: type === 'image' ? 'https://placehold.co/400x200/e2e8f0/94a3b8?text=Image' : undefined,
            imageAlt: type === 'image' ? 'Placeholder image' : undefined,
            imageWidth: type === 'image' ? 400 : undefined,
            imageHeight: type === 'image' ? 200 : undefined,
            imageWidthPercent: type === 'image' ? 100 : undefined,
            imageAlign: type === 'image' ? 'left' : undefined,
            display: (type === 'menu' || type === 'container') ? 'flex' : undefined,
            flexDirection: type === 'menu' ? 'row' : type === 'container' ? 'column' : undefined,
            // Set default padding: 0 for layout containers, 8px/16px for buttons, 16px for content elements, 12px for form inputs
            paddingTop: (['columns', 'grid', 'container', 'rows'].includes(type)) ? 0 : 
                       type === 'button' ? 8 : 
                       ['text-block', 'heading', 'social'].includes(type) ? 4 :
                       ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'datetime-local', 'textarea', 'select', 'checkbox', 'radio', 'hidden', 'rich-text'].includes(type) ? 3 : undefined,
            paddingRight: (['columns', 'grid', 'container', 'rows'].includes(type)) ? 0 : 
                         type === 'button' ? 16 : 
                         ['text-block', 'heading', 'social'].includes(type) ? 4 :
                         ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'datetime-local', 'textarea', 'select', 'checkbox', 'radio', 'hidden', 'rich-text'].includes(type) ? 3 : undefined,
            paddingBottom: (['columns', 'grid', 'container', 'rows'].includes(type)) ? 0 : 
                          type === 'button' ? 8 : 
                          ['text-block', 'heading', 'social'].includes(type) ? 4 :
                          ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'datetime-local', 'textarea', 'select', 'checkbox', 'radio', 'hidden', 'rich-text'].includes(type) ? 3 : undefined,
            paddingLeft: (['columns', 'grid', 'container', 'rows'].includes(type)) ? 0 : 
                        type === 'button' ? 16 : 
                        ['text-block', 'heading', 'social'].includes(type) ? 4 :
                        ['text', 'email', 'password', 'number', 'tel', 'url', 'date', 'time', 'datetime-local', 'textarea', 'select', 'checkbox', 'radio', 'hidden', 'rich-text'].includes(type) ? 3 : undefined,
            // Add default top margin for spacing between components (but 0 for column position since elements are inside containers)
            marginTop: type === 'text-block' ? 4 : 0,
        };

        // Handle menu component special initialization
        if (type === 'menu') {
            newElement.children = [
                {
                    id: uuidv4(),
                    type: 'button' as FormElementType,
                    label: '',
                    name: 'menu_item_1',
                    required: false,
                    width: 12,
                    buttonText: 'Item 1',
                    buttonStyle: 'link',
                    buttonSize: 'sm',
                    paddingTop: 4,
                    paddingBottom: 4,
                    paddingLeft: 8,
                    paddingRight: 8
                },
                {
                    id: uuidv4(),
                    type: 'button' as FormElementType,
                    label: '',
                    name: 'menu_item_2',
                    required: false,
                    width: 12,
                    buttonText: 'Item 2',
                    buttonStyle: 'link',
                    buttonSize: 'sm',
                    paddingTop: 4,
                    paddingBottom: 4,
                    paddingLeft: 8,
                    paddingRight: 8
                },
                {
                    id: uuidv4(),
                    type: 'button' as FormElementType,
                    label: '',
                    name: 'menu_item_3',
                    required: false,
                    width: 12,
                    buttonText: 'Item 3',
                    buttonStyle: 'link',
                    buttonSize: 'sm',
                    paddingTop: 4,
                    paddingBottom: 4,
                    paddingLeft: 8,
                    paddingRight: 8
                }
            ];
        }

        // Find and update the container
        const updateElements = (elements: FormElement[]): FormElement[] => {
            return elements.map(el => {
                if (el.id === containerId && el.type === 'columns') {
                    // Adjust width based on column count
                    newElement.width = 12 / (el.columnCount || 2);
                    
                    // Ensure children array exists and has the right length
                    const children = el.children || [];
                    const targetLength = el.columnCount || 2;
                    
                    // Create new children array with correct length
                    const paddedChildren = [...children];
                    while (paddedChildren.length < targetLength) {
                        paddedChildren.push(undefined);
                    }
                    
                    // Add element to the specific column cell's children instead of replacing it
                    const newChildren = [...paddedChildren];
                    
                    // Get the column cell container (should already be a container)
                    const columnCell = newChildren[columnIndex];
                    if (columnCell && columnCell.type === 'container') {
                        // Add to the column cell's children
                        const cellChildren = columnCell.children || [];
                        newChildren[columnIndex] = {
                            ...columnCell,
                            children: [...cellChildren, newElement]
                        };
                    } else {
                        // If no column cell exists, this shouldn't happen with our new structure
                        console.warn('Column cell not found or not a container');
                        newChildren[columnIndex] = newElement;
                    }
                    
                    return {
                        ...el,
                        children: newChildren
                    };
                }
                if (el.children) {
                    return {
                        ...el,
                        children: updateElements(el.children)
                    };
                }
                return el;
            });
        };

        const updatedElements = updateElements(state.elements);
        console.log('addElementToColumnPosition completed successfully');
        
        // Debug: Check if the column container was actually updated
        const updatedContainer = updatedElements.find(el => el.id === containerId);
        if (updatedContainer) {
            console.log('Updated container children:', updatedContainer.children?.map(c => c ? c.type : 'undefined'));
            
            // Check the menu element itself to see if it has children
            const menuElement = updatedContainer.children?.find(c => c && c.type === 'menu');
            if (menuElement) {
                console.log('Menu element children:', menuElement.children?.map(c => c.type) || 'no children');
                console.log('Menu element structure:', {
                    id: menuElement.id,
                    type: menuElement.type,
                    childrenCount: menuElement.children?.length || 0
                });
            }
        }
        
        const result = {
            elements: updatedElements,
            selectedElementId: newElement.id,
        };
        return result;
    }),

    clearCurrentProject: () => set({
        currentProject: null,
        elements: [],
        selectedElementId: null,
        settings: {
            title: 'My Form',
            description: '',
            submitButtonText: 'Submit',
            submissionActions: [],
        }
    }),

    // Image gallery management functions
    addImageToGallery: (image) => {
        const newImage: GalleryImage = {
            ...image,
            id: uuidv4(),
            createdAt: new Date().toISOString()
        };
        
        set((state) => ({
            imageGallery: [...state.imageGallery, newImage]
        }));
        
        return newImage;
    },

    removeImageFromGallery: (imageId) => set((state) => ({
        imageGallery: state.imageGallery.filter(img => img.id !== imageId)
    })),

    updateGalleryImage: (imageId, updates) => set((state) => ({
        imageGallery: state.imageGallery.map(img => 
            img.id === imageId ? { ...img, ...updates } : img
        )
    })),

    clearImageGallery: () => set({ imageGallery: [] })

}), 
{
    name: 'form-builder-storage',
    version: 1,
}
));
