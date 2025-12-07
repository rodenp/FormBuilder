import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import type { ProjectType, Project } from '../types';
import { Plus, FileText, Mail, Globe, Copy, Trash2, Edit2, Calendar, Clock, Download, Upload } from 'lucide-react';
import { clsx } from 'clsx';

export const ProjectManager: React.FC = () => {
    const { 
        projects, 
        createProject, 
        loadProject, 
        deleteProject, 
        duplicateProject,
        currentProject,
        elements,
        settings,
        clearCurrentProject,
        reorderElements,
        updateSettings
    } = useStore();
    
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [selectedProjectType, setSelectedProjectType] = useState<ProjectType>('form');

    const handleCreateProject = () => {
        if (newProjectName.trim()) {
            createProject(newProjectName.trim(), selectedProjectType);
            setNewProjectName('');
            setShowCreateDialog(false);
        }
    };

    // Export specific project
    const exportProject = (project: Project) => {
        const projectData = {
            project: project,
            elements: project.elements || [],
            settings: project.settings || {
                title: project.name,
                submitButtonText: 'Submit',
                primaryColor: '#3B82F6',
                buttonStyle: 'rounded',
                inputBorderStyle: 'rounded',
                submissionActions: []
            },
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(projectData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_project.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    // Import project
    const importProject = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const projectData = JSON.parse(event.target?.result as string);
                    
                    // Validate the imported data structure
                    if (!projectData.project || !projectData.elements || !projectData.settings) {
                        alert('Invalid project file format. Please select a valid exported project file.');
                        return;
                    }
                    
                    // Create a new project with imported data
                    const importedProject = {
                        ...projectData.project,
                        id: Date.now().toString(), // Generate new ID
                        name: `${projectData.project.name} (Imported)`,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                    
                    // Create the new project
                    createProject(importedProject.name, importedProject.type);
                    
                    // Load the elements and settings
                    reorderElements(projectData.elements);
                    updateSettings(projectData.settings);
                    
                    alert(`Project "${importedProject.name}" imported successfully!`);
                } catch (error) {
                    console.error('Error importing project:', error);
                    alert('Error importing project. Please check the file format.');
                }
            };
            reader.readAsText(file);
        };
        fileInput.click();
    };

    const getProjectIcon = (type: ProjectType) => {
        switch (type) {
            case 'form':
                return <FileText size={24} className="text-blue-600" />;
            case 'email':
                return <Mail size={24} className="text-green-600" />;
            case 'website':
                return <Globe size={24} className="text-purple-600" />;
            default:
                return <FileText size={24} className="text-gray-600" />;
        }
    };

    const getProjectTypeColor = (type: ProjectType) => {
        switch (type) {
            case 'form':
                return 'bg-blue-100 text-blue-800';
            case 'email':
                return 'bg-green-100 text-green-800';
            case 'website':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const projectTypeOptions = [
        { type: 'form' as ProjectType, label: 'Form', description: 'Build interactive forms with validation', icon: FileText, color: 'blue' },
        { type: 'email' as ProjectType, label: 'Email', description: 'Design responsive email templates', icon: Mail, color: 'green' },
        { type: 'website' as ProjectType, label: 'Website', description: 'Create modern web pages', icon: Globe, color: 'purple' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
                            <p className="text-gray-600 mt-1">Create and manage your forms, emails, and websites</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={importProject}
                                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                title="Import Project"
                            >
                                <Upload size={20} />
                                Import
                            </button>
                            <button
                                onClick={() => setShowCreateDialog(true)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus size={20} />
                                New Project
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {projects.length === 0 ? (
                    /* Empty state */
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                        <p className="text-gray-600 mb-6">Get started by creating your first project</p>
                        <button
                            onClick={() => setShowCreateDialog(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Create Your First Project
                        </button>
                    </div>
                ) : (
                    /* Projects grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer group"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            {getProjectIcon(project.type)}
                                            <div>
                                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {project.name}
                                                </h3>
                                                <span className={clsx(
                                                    "inline-block px-2 py-1 text-xs font-medium rounded-full mt-1",
                                                    getProjectTypeColor(project.type)
                                                )}>
                                                    {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    exportProject(project);
                                                }}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Export Project"
                                            >
                                                <Download size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    duplicateProject(project.id);
                                                }}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Duplicate"
                                            >
                                                <Copy size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteProject(project.id);
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            <span>Created {formatDate(project.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} />
                                            <span>Updated {formatDate(project.updatedAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FileText size={14} />
                                            <span>{project.elements.length} elements</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                                    <button
                                        onClick={() => loadProject(project.id)}
                                        className="w-full text-center py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                    >
                                        Open Project
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Project Dialog */}
            {showCreateDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Project</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Project Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newProjectName}
                                        onChange={(e) => setNewProjectName(e.target.value)}
                                        placeholder="Enter project name..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleCreateProject();
                                            }
                                            if (e.key === 'Escape') {
                                                setShowCreateDialog(false);
                                            }
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Project Type
                                    </label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {projectTypeOptions.map(({ type, label, description, icon: Icon, color }) => (
                                            <div
                                                key={type}
                                                onClick={() => setSelectedProjectType(type)}
                                                className={clsx(
                                                    "p-3 border-2 rounded-lg cursor-pointer transition-all",
                                                    selectedProjectType === type
                                                        ? `border-${color}-500 bg-${color}-50`
                                                        : "border-gray-200 hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon size={20} className={`text-${color}-600`} />
                                                    <div>
                                                        <div className="font-medium text-gray-900">{label}</div>
                                                        <div className="text-sm text-gray-600">{description}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <button
                                onClick={() => setShowCreateDialog(false)}
                                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateProject}
                                disabled={!newProjectName.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Create Project
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};