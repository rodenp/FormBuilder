import { useStore } from '../store/useStore';
import type { FormSchema, FormElementType } from '../types';

export const useFormBuilder = () => {
  const store = useStore();

  const getFormSchema = (): FormSchema => ({
    id: `form-${Date.now()}`,
    settings: store.settings,
    elements: store.elements
  });

  const loadFormSchema = (schema: FormSchema) => {
    store.reorderElements(schema.elements);
    store.updateSettings(schema.settings);
  };

  const addFormElement = (type: FormElementType, parentId?: string) => {
    store.addElement(type, parentId);
  };

  const clearForm = () => {
    store.reorderElements([]);
    store.updateSettings({
      title: 'My Form',
      description: '',
      submitButtonText: 'Submit',
      gap: 4,
      submissionActions: [],
    });
    store.selectElement(null);
  };

  return {
    // State
    elements: store.elements,
    settings: store.settings,
    selectedElementId: store.selectedElementId,
    
    // Actions
    addElement: store.addElement,
    removeElement: store.removeElement,
    updateElement: store.updateElement,
    selectElement: store.selectElement,
    updateSettings: store.updateSettings,
    
    // Helper methods
    getFormSchema,
    loadFormSchema,
    addFormElement,
    clearForm,
  };
};