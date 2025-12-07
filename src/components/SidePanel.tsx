import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Sidebar } from './Sidebar';
import { PropertiesPanel } from './PropertiesPanel';
import { BodyPropertiesPanel } from './BodyPropertiesPanel';
import { BrandPropertiesPanel } from './BrandPropertiesPanel';
import { ChevronRight, ChevronLeft } from 'lucide-react';

type ActiveTab = 'content' | 'blocks' | 'body' | 'brand';

export const SidePanel: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState<ActiveTab | null>(null);
    const { selectedElementId } = useStore();

    // When an element is selected, show properties
    const shouldShowElementProperties = selectedElementId !== null;

    // Reset active tab when an element is selected
    React.useEffect(() => {
        if (selectedElementId !== null) {
            setActiveTab(null);
        }
    }, [selectedElementId]);

    const renderContent = () => {
        // Context-aware content: 
        // - When tab is active: show tab content (overrides element properties)
        // - When element is selected and no tab active: show element properties
        // - When canvas selected and no tab active: show form properties
        
        // If a tab is active, always show tab content
        if (activeTab !== null) {
            switch (activeTab) {
                case 'content':
                    return <Sidebar />;
                case 'blocks':
                    return (
                        <div className="p-4 h-full bg-white">
                            <h3 className="text-sm font-medium text-gray-900 mb-4">Custom Blocks</h3>
                            <div className="text-gray-500 text-sm">
                                Custom blocks feature coming soon...
                            </div>
                        </div>
                    );
                case 'body':
                    return <BodyPropertiesPanel />;
                case 'brand':
                    return <BrandPropertiesPanel />;
                default:
                    return <PropertiesPanel />;
            }
        }
        
        // No tab active, show properties
        return <PropertiesPanel />;
    };

    if (isCollapsed) {
        return (
            <div className="relative w-0">
                {/* Collapsed state - just the expand button */}
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="absolute -left-10 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-l-lg p-2 shadow-md hover:bg-gray-50 z-50"
                    title="Expand panel"
                >
                    <ChevronLeft size={16} className="text-gray-600" />
                </button>
            </div>
        );
    }

    return (
        <div className="flex relative">
            {/* Collapse button */}
            <button
                onClick={() => setIsCollapsed(true)}
                className="absolute -left-10 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-l-lg p-2 shadow-md hover:bg-gray-50 z-50"
                title="Collapse panel"
            >
                <ChevronRight size={16} className="text-gray-600" />
            </button>

            {/* Main content panel */}
            <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
                {/* Content area */}
                <div className="flex-1 overflow-auto">
                    {renderContent()}
                </div>
            </div>

            {/* Right sidebar menu - always shown */}
            <div className="w-16 bg-gray-50 border-l border-gray-200 flex flex-col items-center py-4 space-y-6">
                    {/* Content tab */}
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-colors ${
                            activeTab === 'content'
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                        title="Content"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-current">
                            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2"/>
                            <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span className="text-xs font-medium">Content</span>
                    </button>

                    {/* Blocks tab */}
                    <button
                        onClick={() => setActiveTab('blocks')}
                        className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-colors ${
                            activeTab === 'blocks'
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                        title="Blocks"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-current">
                            <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
                            <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
                            <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
                            <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" rx="1"/>
                        </svg>
                        <span className="text-xs font-medium">Blocks</span>
                    </button>

                    {/* Body tab */}
                    <button
                        onClick={() => setActiveTab('body')}
                        className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-colors ${
                            activeTab === 'body'
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                        title="Body"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-current">
                            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2"/>
                            <path d="M8 8H16" stroke="currentColor" strokeWidth="2"/>
                            <path d="M8 12H16" stroke="currentColor" strokeWidth="2"/>
                            <path d="M8 16H12" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span className="text-xs font-medium">Body</span>
                    </button>

                    {/* Brand tab */}
                    <button
                        onClick={() => setActiveTab('brand')}
                        className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-colors ${
                            activeTab === 'brand'
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                        title="Brand"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-current">
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 1V5" stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 19V23" stroke="currentColor" strokeWidth="2"/>
                            <path d="M4.22 4.22L6.32 6.32" stroke="currentColor" strokeWidth="2"/>
                            <path d="M17.68 17.68L19.78 19.78" stroke="currentColor" strokeWidth="2"/>
                            <path d="M1 12H5" stroke="currentColor" strokeWidth="2"/>
                            <path d="M19 12H23" stroke="currentColor" strokeWidth="2"/>
                            <path d="M4.22 19.78L6.32 17.68" stroke="currentColor" strokeWidth="2"/>
                            <path d="M17.68 6.32L19.78 4.22" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span className="text-xs font-medium">Brand</span>
                    </button>
                </div>
        </div>
    );
};