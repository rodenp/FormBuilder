import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { Sidebar } from './Sidebar';
import { Canvas } from './Canvas';
import { PropertiesPanel } from './PropertiesPanel';
import { Preview } from './Preview';
import { useStore } from '../store/useStore';
import type { FormSchema } from '../types';

interface FormBuilderProps {
  onSave?: (schema: FormSchema) => void;
  onPreview?: (schema: FormSchema) => void;
  initialSchema?: FormSchema;
  showPreview?: boolean;
  className?: string;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  onSave,
  onPreview,
  initialSchema,
  showPreview = true,
  className = ''
}) => {
  const { 
    elements, 
    settings, 
    addElement, 
    moveElementToContainer, 
    selectElement,
    reorderElements,
    updateSettings
  } = useStore();
  
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  // Load initial schema if provided
  useEffect(() => {
    if (initialSchema) {
      reorderElements(initialSchema.elements);
      updateSettings(initialSchema.settings);
    }
  }, [initialSchema, reorderElements, updateSettings]);

  // Notify parent of changes
  useEffect(() => {
    const schema: FormSchema = {
      id: initialSchema?.id || `form-${Date.now()}`,
      settings,
      elements
    };
    
    if (viewMode === 'preview') {
      onPreview?.(schema);
    }
  }, [elements, settings, viewMode, onPreview, initialSchema?.id]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Handle dropping from sidebar
    if (active.id.toString().startsWith('sidebar-')) {
      const elementType = active.id.toString().replace('sidebar-', '') as any;
      
      if (over.id === 'canvas') {
        // Drop on main canvas
        addElement(elementType);
      } else if (over.id.toString().startsWith('container-') || over.id.toString().startsWith('columns-')) {
        // Drop on container or columns
        const containerId = over.id.toString().replace(/^(container-|columns-)/, '');
        addElement(elementType, containerId);
      }
      
      return;
    }

    // Handle moving existing elements
    if (over.id.toString().startsWith('container-') || over.id.toString().startsWith('columns-')) {
      const containerId = over.id.toString().replace(/^(container-|columns-)/, '');
      const elementId = active.id.toString();
      
      moveElementToContainer(elementId, containerId);
    }
  };

  const handleSave = () => {
    const schema: FormSchema = {
      id: initialSchema?.id || `form-${Date.now()}`,
      settings,
      elements
    };
    onSave?.(schema);
  };

  const toggleViewMode = () => {
    const newMode = viewMode === 'edit' ? 'preview' : 'edit';
    setViewMode(newMode);
  };

  return (
    <div className={`h-full flex flex-col bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">Form Builder</h1>
        <div className="flex items-center gap-3">
          {showPreview && (
            <button
              onClick={toggleViewMode}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {viewMode === 'edit' ? 'Preview' : 'Edit'}
            </button>
          )}
          {onSave && (
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Form
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'edit' ? (
        <DndContext onDragEnd={handleDragEnd}>
          <div className="flex-1 flex overflow-hidden">
            <Sidebar />
            <Canvas />
            <PropertiesPanel />
          </div>
        </DndContext>
      ) : (
        <div className="flex-1 overflow-hidden">
          <Preview />
        </div>
      )}
    </div>
  );
};