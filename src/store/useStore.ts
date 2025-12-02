import { create } from 'zustand';
import type { FormElement, FormSettings, FormElementType } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface FormStore {
    elements: FormElement[];
    selectedElementId: string | null;
    settings: FormSettings;
    addElement: (type: FormElementType, parentId?: string) => void;
    removeElement: (id: string) => void;
    duplicateElement: (id: string) => void;
    updateElement: (id: string, updates: Partial<FormElement>) => void;
    selectElement: (id: string | null) => void;
    reorderElements: (elements: FormElement[]) => void;
    moveElementToContainer: (elementId: string, containerId: string) => void;
    removeElementFromContainer: (elementId: string, containerId: string) => void;
    moveElementUp: (id: string, parentId?: string) => void;
    moveElementDown: (id: string, parentId?: string) => void;
    updateSettings: (settings: Partial<FormSettings>) => void;
}

export const useStore = create<FormStore>((set) => ({
    elements: [],
    selectedElementId: null,
    settings: {
        title: 'My Form',
        description: '',
        submitButtonText: 'Submit',
        submissionActions: [],
    },

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
            children: (type === 'container' || type === 'columns') ? [] : undefined,
            columnCount: type === 'columns' ? 2 : undefined,
            gap: (type === 'container' || type === 'columns') ? 0 : undefined,
            labelSize: type !== 'hidden' && type !== 'rich-text' ? 'sm' : undefined,
            labelWeight: type !== 'hidden' && type !== 'rich-text' ? 'medium' : undefined,
            value: type === 'hidden' ? '' : undefined,
            content: type === 'rich-text' ? '<p>Your rich text content here</p>' : undefined,
            buttonText: type === 'button' ? 'Click me' : undefined,
            buttonType: type === 'button' ? 'button' : undefined,
            buttonStyle: type === 'button' ? 'primary' : undefined,
            buttonSize: type === 'button' ? 'md' : undefined,
            buttonAction: type === 'button' ? 'none' : undefined,
            buttonUrl: type === 'button' ? '' : undefined,
            buttonTarget: type === 'button' ? '_self' : undefined,
            // Set zero padding for containers and columns by default
            paddingTop: (type === 'container' || type === 'columns') ? 0 : undefined,
            paddingRight: (type === 'container' || type === 'columns') ? 0 : undefined,
            paddingBottom: (type === 'container' || type === 'columns') ? 0 : undefined,
            paddingLeft: (type === 'container' || type === 'columns') ? 0 : undefined,
            // Add default top margin for spacing between components (except when in containers)
            marginTop: !parentId ? 8 : 0,
        };
        
        if (parentId) {
            // Helper function to recursively add to container
            const addToContainer = (elements: FormElement[]): FormElement[] => {
                return elements.map(el => {
                    if (el.id === parentId && (el.type === 'container' || el.type === 'columns')) {
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

    removeElement: (id) => set((state) => {
        // Helper function to remove element recursively
        const removeFromElements = (elements: FormElement[]): FormElement[] => {
            return elements
                .filter(el => el.id !== id)
                .map(el => ({
                    ...el,
                    children: el.children ? removeFromElements(el.children) : undefined
                }));
        };

        return {
            elements: removeFromElements(state.elements),
            selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
        };
    }),

    duplicateElement: (id) => set((state) => {
        // Helper function to recursively duplicate elements with new IDs
        const cloneElementWithNewIds = (element: FormElement): FormElement => {
            const newElement = {
                ...element,
                id: uuidv4(),
                label: element.label.includes('(Copy)') ? element.label : `${element.label} (Copy)`,
                children: element.children ? element.children.map(child => cloneElementWithNewIds(child)) : undefined
            };
            return newElement;
        };

        // Helper function to find and duplicate element recursively
        const duplicateInElements = (elements: FormElement[]): FormElement[] => {
            for (let i = 0; i < elements.length; i++) {
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
                        newElements[i] = {
                            ...elements[i],
                            children: updatedChildren
                        };
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
                if (el.id === id) {
                    return { ...el, ...updates };
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
                if (el.id === containerId && (el.type === 'container' || el.type === 'columns')) {
                    // Adjust width based on container type
                    if (el.type === 'columns' && elementToMove) {
                        const columnWidth = 12 / (el.columnCount || 2);
                        elementToMove.width = columnWidth;
                    } else if (el.type === 'container' && elementToMove) {
                        // If moving to container, set to full width
                        elementToMove.width = 12;
                    }
                    return {
                        ...el,
                        children: [...(el.children || []), elementToMove!]
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
            elements: addToContainer(newElements),
        };
    }),

    removeElementFromContainer: (elementId, containerId) => set((state) => {
        const updateContainer = (elements: FormElement[]): FormElement[] => {
            return elements.map(el => {
                if (el.id === containerId && (el.type === 'container' || el.type === 'columns')) {
                    return {
                        ...el,
                        children: (el.children || []).filter(child => child.id !== elementId)
                    };
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
        if (parentId) {
            // Move within container
            const updateContainer = (elements: FormElement[]): FormElement[] => {
                return elements.map(el => {
                    if (el.id === parentId && (el.type === 'container' || el.type === 'columns') && el.children) {
                        const children = [...el.children];
                        const index = children.findIndex(child => child.id === id);
                        if (index > 0) {
                            [children[index - 1], children[index]] = [children[index], children[index - 1]];
                        }
                        return { ...el, children };
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
        if (parentId) {
            // Move within container
            const updateContainer = (elements: FormElement[]): FormElement[] => {
                return elements.map(el => {
                    if (el.id === parentId && (el.type === 'container' || el.type === 'columns') && el.children) {
                        const children = [...el.children];
                        const index = children.findIndex(child => child.id === id);
                        if (index < children.length - 1) {
                            [children[index], children[index + 1]] = [children[index + 1], children[index]];
                        }
                        return { ...el, children };
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
}));
