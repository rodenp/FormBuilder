
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import {
    Type,
    Hash,
    Mail,
    AlignLeft,
    CheckSquare,
    Radio,
    List,
    Calendar,
    Clock,
    CalendarDays,
    EyeOff,
    Edit3,
    GripVertical,
    Layout,
    Star,
    Columns,
    Rows,
    Grid3x3,
    MousePointer2,
    Image as ImageIcon,
    FileText,
    Menu,
    Share2,
    Heading
} from 'lucide-react';
import type { FormElementType } from '../types';
import { useStore } from '../store/useStore';
import { ComponentRegistry } from './form-elements/index';

interface SidebarItemProps {
    type: FormElementType;
    label: string;
    icon: React.ReactNode;
    description: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ type, label, icon, description }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `sidebar-${type}`,
        data: {
            type,
            isSidebar: true,
        },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`
        relative flex flex-col items-center gap-2 p-3 border rounded-xl cursor-move shadow-sm
        dark:bg-gray-800 dark:border-gray-700
        bg-white border-slate-200
        ${isDragging ? 'opacity-50 ring-2 ring-brand-500 rotate-2' : ''}
      `}
        >
            <div className="p-2 rounded-lg transition-colors bg-slate-50 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600 dark:bg-gray-700 dark:text-gray-400 dark:group-hover:bg-gray-600 dark:group-hover:text-brand-400">
                {icon}
            </div>
            <div className="text-center">
                <span className="block text-sm font-semibold text-slate-700 group-hover:text-brand-700 dark:text-gray-300 dark:group-hover:text-brand-400">{label}</span>
                <span className="block text-xs text-slate-400 dark:text-gray-500">{description}</span>
            </div>
            <div className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2">
                <GripVertical size={14} />
            </div>
        </div>
    );
};

export const Sidebar: React.FC = () => {
    const { currentProject } = useStore();
    const projectType = currentProject?.type || 'form';

    // Helper to get component metadata from registry if available
    const getComponentMeta = (type: FormElementType) => {
        const registered = ComponentRegistry.get(type);
        if (registered) {
            const Icon = registered.config.icon;
            return {
                label: registered.config.label,
                icon: <Icon size={18} />
            };
        }
        return null; // Fallback
    };

    return (
        <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800">
            <div className="p-6 border-b border-slate-100 dark:border-gray-800">
                <h2 className="text-lg font-bold text-slate-800 dark:text-gray-100">Components</h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Drag components to the canvas</p>
            </div>

            <div className="p-4 flex-1 overflow-y-auto overflow-x-hidden">
                {/* For non-form projects, show limited components */}
                {projectType !== 'form' ? (
                    <>
                        {/* Legacy list for non-form projects - keeping as is for now unless they should also be generic */}
                        <div className="px-2 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            Components
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <SidebarItem
                                type="select"
                                label="Dropdown"
                                icon={<List size={18} />}
                                description="Select from options"
                            />
                            {/* ... (keeping existing items for non-form) ... */}
                            {/* Shortened for brevity in this thought, but in real file I'd keep them all or map them */}
                            <SidebarItem
                                type="checkbox"
                                label="Checkbox"
                                icon={<CheckSquare size={18} />}
                                description="Toggle selection"
                            />
                            <SidebarItem
                                type="radio"
                                label="Radio Group"
                                icon={<Radio size={18} />}
                                description="Single selection"
                            />
                            <SidebarItem
                                type="button"
                                label="Button"
                                icon={<MousePointer2 size={18} />}
                                description="Clickable button"
                            />
                            <SidebarItem
                                type="image"
                                label="Image"
                                icon={<ImageIcon size={18} />}
                                description="Display image"
                            />
                            <SidebarItem
                                type="text-block"
                                label="Text Block"
                                icon={<FileText size={18} />}
                                description="Rich text content"
                            />
                            <SidebarItem
                                type="heading"
                                label="Heading"
                                icon={<Heading size={18} />}
                                description="Title and headings"
                            />
                            <SidebarItem
                                type="menu"
                                label="Menu"
                                icon={<Menu size={18} />}
                                description="Navigation menu"
                            />
                            <SidebarItem
                                type="social"
                                label="Social Links"
                                icon={<Share2 size={18} />}
                                description="Social media links"
                            />
                        </div>

                        <div className="px-2 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            Layout
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <SidebarItem
                                type="container"
                                label="Container"
                                icon={<Layout size={18} />}
                                description="Custom layout"
                            />
                            <SidebarItem
                                type="columns"
                                label="Columns"
                                icon={<Columns size={18} />}
                                description="Horizontal layout"
                            />
                            <SidebarItem
                                type="rows"
                                label="Rows"
                                icon={<Rows size={18} />}
                                description="Vertical layout"
                            />
                            <SidebarItem
                                type="grid"
                                label="Grid"
                                icon={<Grid3x3 size={18} />}
                                description="Grid layout"
                            />
                        </div>
                    </>
                ) : (
                    /* Full form components for form projects */
                    <>
                        <div className="px-2 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            Basic Fields
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {/* Using Registry Data if available, else static fallbacks */}

                            <SidebarItem
                                type="text"
                                label={getComponentMeta('text')?.label || "Text Input"}
                                icon={getComponentMeta('text')?.icon || <Type size={18} />}
                                description="Single line text"
                            />
                            <SidebarItem
                                type="textarea"
                                label={getComponentMeta('textarea')?.label || "Text Area"}
                                icon={getComponentMeta('textarea')?.icon || <AlignLeft size={18} />}
                                description="Multi-line text"
                            />
                            <SidebarItem
                                type="number"
                                label="Number"
                                icon={<Hash size={18} />}
                                description="Numeric values"
                            />
                            <SidebarItem
                                type="email"
                                label="Email"
                                icon={<Mail size={18} />}
                                description="Email validation"
                            />
                            <SidebarItem
                                type="rich-text"
                                label="Rich Text"
                                icon={<Edit3 size={18} />}
                                description="Formatted text"
                            />
                            <SidebarItem
                                type="button"
                                label="Button"
                                icon={<MousePointer2 size={18} />}
                                description="Clickable button"
                            />
                            <SidebarItem
                                type="image"
                                label="Image"
                                icon={<ImageIcon size={18} />}
                                description="Display image"
                            />
                            <SidebarItem
                                type="text-block"
                                label="Text Block"
                                icon={<FileText size={18} />}
                                description="Rich text content"
                            />
                        </div>

                        <div className="px-2 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            Selection & Date
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <SidebarItem
                                type="select"
                                label="Dropdown"
                                icon={<List size={18} />}
                                description="Select from options"
                            />
                            <SidebarItem
                                type="checkbox"
                                label="Checkbox"
                                icon={<CheckSquare size={18} />}
                                description="Toggle selection"
                            />
                            <SidebarItem
                                type="radio"
                                label="Radio Group"
                                icon={<Radio size={18} />}
                                description="Single selection"
                            />
                            <SidebarItem
                                type="date"
                                label="Date Picker"
                                icon={<Calendar size={18} />}
                                description="Select a date"
                            />
                            <SidebarItem
                                type="time"
                                label="Time Picker"
                                icon={<Clock size={18} />}
                                description="Select a time"
                            />
                            <SidebarItem
                                type="month"
                                label="Month Picker"
                                icon={<CalendarDays size={18} />}
                                description="Select month/year"
                            />
                            <SidebarItem
                                type="hidden"
                                label="Hidden Field"
                                icon={<EyeOff size={18} />}
                                description="Invisible data field"
                            />
                            <SidebarItem
                                type="star-rating"
                                label="Star Rating"
                                icon={<Star size={18} />}
                                description="Rating input"
                            />
                        </div>

                        <div className="px-2 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                            Layout
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <SidebarItem
                                type="container"
                                label="Container"
                                icon={<Layout size={18} />}
                                description="Group components"
                            />
                            <SidebarItem
                                type="columns"
                                label="Columns"
                                icon={<Columns size={18} />}
                                description="Side-by-side layout"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
