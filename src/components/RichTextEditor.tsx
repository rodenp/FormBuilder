import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bold, Italic, Underline, Code, Link, FileX, Image, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { ImageGallery } from './ImageGallery';
import type { FormElement, GalleryImage } from '../types';

interface RichTextEditorProps {
    selectedElement: FormElement;
    onContentChange: (content: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ selectedElement, onContentChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [lastElementId, setLastElementId] = useState<string>('');
    const [showToolbar, setShowToolbar] = useState(false);
    const [linkModal, setLinkModal] = useState<{
        isOpen: boolean;
        linkElement: HTMLAnchorElement | null;
        text: string;
        url: string;
        isEdit: boolean;
        savedRange: Range | null;
    }>({
        isOpen: false,
        linkElement: null,
        text: '',
        url: '',
        isEdit: false,
        savedRange: null
    });

    const [imageGallery, setImageGallery] = useState<{
        isOpen: boolean;
        savedRange: Range | null;
    }>({
        isOpen: false,
        savedRange: null
    });

    // Debug modal state changes
    useEffect(() => {
        console.log('Link modal state changed:', linkModal);
    }, [linkModal]);

    const styleLinks = (container: HTMLElement) => {
        const links = container.querySelectorAll('a');
        links.forEach((link, index) => {
            const linkEl = link as HTMLElement;
            linkEl.style.setProperty('color', '#2563eb', 'important');
            linkEl.style.setProperty('text-decoration', 'underline', 'important');
            linkEl.style.setProperty('cursor', 'pointer', 'important');
            linkEl.style.setProperty('background-color', 'rgba(37, 99, 235, 0.1)', 'important');
            linkEl.style.setProperty('padding', '1px 2px', 'important');
            linkEl.style.setProperty('border-radius', '2px', 'important');
            
            // Remove existing click handlers to avoid duplicates
            const newLink = linkEl.cloneNode(true) as HTMLElement;
            newLink.addEventListener('click', handleLinkClick);
            linkEl.parentNode?.replaceChild(newLink, linkEl);
        });
    };

    const handleLinkClick = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        const link = e.target as HTMLAnchorElement;
        setLinkModal({
            isOpen: true,
            linkElement: link,
            text: link.textContent || '',
            url: link.href,
            isEdit: true,
            savedRange: null
        });
    };

    // Only update editor content when the selected element ID changes (not content)
    useEffect(() => {
        if (editorRef.current && (selectedElement.type === 'rich-text' || selectedElement.type === 'text-block') && selectedElement.id !== lastElementId) {
            editorRef.current.innerHTML = selectedElement.content || '';
            setLastElementId(selectedElement.id);
            
            // Style all existing links
            styleLinks(editorRef.current);

            // Listen for custom link modal events
            const handleOpenLinkModal = (e: CustomEvent) => {
                const selectedText = e.detail.selectedText || '';
                const savedRange = e.detail.range || null;
                setLinkModal({
                    isOpen: true,
                    linkElement: null,
                    text: selectedText,
                    url: '',
                    isEdit: false,
                    savedRange: savedRange
                });
            };

            editorRef.current.addEventListener('openLinkModal', handleOpenLinkModal as EventListener);

            // Create a mutation observer to watch for new links being added
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' || mutation.type === 'subtree') {
                        // Re-style all links whenever the DOM changes
                        if (editorRef.current) {
                            styleLinks(editorRef.current);
                        }
                    }
                });
            });

            // Start observing
            observer.observe(editorRef.current, {
                childList: true,
                subtree: true,
                characterData: true
            });
            
            // Focus the editor after a brief delay
            setTimeout(() => {
                if (editorRef.current) {
                    editorRef.current.focus();
                    setShowToolbar(true);
                }
            }, 100);

            return () => {
                if (editorRef.current) {
                    editorRef.current.removeEventListener('openLinkModal', handleOpenLinkModal as EventListener);
                }
                observer.disconnect();
            };
        }
    }, [selectedElement.id, lastElementId, selectedElement.type]);

    // Separate effect for heading components to avoid focus issues  
    useEffect(() => {
        if (editorRef.current && selectedElement.type === 'heading' && selectedElement.id !== lastElementId) {
            // For headings, display as HTML but strip line breaks
            const content = selectedElement.content || '';
            const singleLineContent = content.replace(/<br\s*\/?>/gi, '').replace(/\n/g, '');
            editorRef.current.innerHTML = singleLineContent;
            setLastElementId(selectedElement.id);
            
            // Focus the editor after a brief delay
            setTimeout(() => {
                if (editorRef.current) {
                    editorRef.current.focus();
                    setShowToolbar(true);
                }
            }, 100);
        }
    }, [selectedElement.id, lastElementId, selectedElement.type]);


    const updateContent = () => {
        if (editorRef.current) {
            onContentChange(editorRef.current.innerHTML);
        }
    };

    const saveLinkModal = () => {
        const { linkElement, text, url, isEdit, savedRange } = linkModal;
        
        if (text.trim() && url.trim()) {
            const finalUrl = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') ? url : 'https://' + url;
            
            if (isEdit && linkElement) {
                // Update existing link
                linkElement.textContent = text;
                linkElement.href = finalUrl;
            } else {
                // Create new link - properly handle text replacement
                const editor = editorRef.current;
                if (editor) {
                    editor.focus();
                    
                    const linkHtml = `<a href="${finalUrl}" style="color: #2563eb !important; text-decoration: underline !important; cursor: pointer !important; background-color: rgba(37, 99, 235, 0.1) !important; padding: 1px 2px !important; border-radius: 2px !important;">${text}</a>`;
                    
                    if (savedRange) {
                        // Restore the saved selection and replace it
                        const selection = window.getSelection();
                        selection?.removeAllRanges();
                        selection?.addRange(savedRange);
                        document.execCommand('insertHTML', false, linkHtml);
                    } else {
                        // Fallback: insert at current cursor position
                        document.execCommand('insertHTML', false, linkHtml);
                    }
                }
            }
            updateContent();
            
            // Re-style all links after a short delay
            setTimeout(() => {
                if (editorRef.current) {
                    styleLinks(editorRef.current);
                }
            }, 100);
        }
        
        setLinkModal({ isOpen: false, linkElement: null, text: '', url: '', isEdit: false, savedRange: null });
    };

    const deleteLinkModal = () => {
        const { linkElement } = linkModal;
        if (linkElement) {
            const text = linkElement.textContent || '';
            const textNode = document.createTextNode(text);
            linkElement.parentNode?.replaceChild(textNode, linkElement);
            updateContent();
        }
        setLinkModal({ isOpen: false, linkElement: null, text: '', url: '', isEdit: false, savedRange: null });
    };

    const handleImageSelect = (image: GalleryImage) => {
        const { savedRange } = imageGallery;
        const editor = editorRef.current;
        
        if (editor) {
            // First focus the editor to ensure it's active
            editor.focus();
            
            const imageHtml = `<img src="${image.url}" alt="${image.name || 'Inserted image'}" style="max-width: 100%; height: auto; margin: 8px 0; border-radius: 4px; display: inline-block;" draggable="false" />`;
            
            if (savedRange) {
                try {
                    // Restore the saved selection and insert at that exact position
                    const selection = window.getSelection();
                    if (selection) {
                        selection.removeAllRanges();
                        
                        // Ensure the range is still valid and within the editor
                        if (editor.contains(savedRange.startContainer)) {
                            selection.addRange(savedRange);
                            
                            // Use insertHTML to insert at the exact cursor position
                            if (document.execCommand('insertHTML', false, imageHtml)) {
                                console.log('Image inserted successfully at saved position');
                            } else {
                                // Fallback: create text node and insert manually
                                const img = document.createElement('img');
                                img.src = image.url;
                                img.alt = image.name || 'Inserted image';
                                img.style.maxWidth = '100%';
                                img.style.height = 'auto';
                                img.style.margin = '8px 0';
                                img.style.borderRadius = '4px';
                                img.style.display = 'inline-block';
                                img.draggable = false;
                                
                                savedRange.insertNode(img);
                                savedRange.setStartAfter(img);
                                savedRange.collapse(true);
                                selection.removeAllRanges();
                                selection.addRange(savedRange);
                            }
                        } else {
                            console.log('Saved range is no longer valid, inserting at end');
                            // Range is no longer valid, insert at end of editor
                            editor.appendChild(document.createElement('br'));
                            const img = document.createElement('img');
                            img.src = image.url;
                            img.alt = image.name || 'Inserted image';
                            img.style.maxWidth = '100%';
                            img.style.height = 'auto';
                            img.style.margin = '8px 0';
                            img.style.borderRadius = '4px';
                            img.style.display = 'inline-block';
                            img.draggable = false;
                            editor.appendChild(img);
                        }
                    }
                } catch (error) {
                    console.error('Error restoring selection:', error);
                    // Fallback to inserting at current position
                    document.execCommand('insertHTML', false, imageHtml);
                }
            } else {
                // No saved range, insert at current cursor position
                console.log('No saved range, inserting at current cursor position');
                document.execCommand('insertHTML', false, imageHtml);
            }
            
            updateContent();
        }
        
        setImageGallery({ isOpen: false, savedRange: null });
    };


    const renderPortalToolbar = () => {
        if (!showToolbar || !editorRef.current) return null;
        
        const rect = editorRef.current.getBoundingClientRect();
        const toolbarStyle = {
            position: 'fixed' as const,
            top: rect.top - 50,
            right: window.innerWidth - rect.right,
            zIndex: 99999,
            pointerEvents: 'all' as const
        };
        
        return (
            <div 
                style={toolbarStyle}
                className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1"
                onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                {/* Text Formatting Group */}
                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (editorRef.current) {
                                editorRef.current.focus();
                                document.execCommand('bold', false);
                                updateContent();
                            }
                        }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                        title="Bold"
                    >
                        <Bold size={16} />
                    </button>
                    
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (editorRef.current) {
                                editorRef.current.focus();
                                document.execCommand('italic', false);
                                updateContent();
                            }
                        }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                        title="Italic"
                    >
                        <Italic size={16} />
                    </button>
                    
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (editorRef.current) {
                                editorRef.current.focus();
                                document.execCommand('underline', false);
                                updateContent();
                            }
                        }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                        title="Underline"
                    >
                        <Underline size={16} />
                    </button>
                </div>
                
                {/* Separator */}
                <div className="w-px h-6 bg-gray-300"></div>
                
                {/* Alignment Group */}
                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (editorRef.current) {
                                editorRef.current.focus();
                                document.execCommand('justifyLeft', false);
                                updateContent();
                            }
                        }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        title="Align Left"
                    >
                        <AlignLeft size={16} />
                    </button>
                    
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (editorRef.current) {
                                editorRef.current.focus();
                                document.execCommand('justifyCenter', false);
                                updateContent();
                            }
                        }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        title="Align Center"
                    >
                        <AlignCenter size={16} />
                    </button>
                    
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (editorRef.current) {
                                editorRef.current.focus();
                                document.execCommand('justifyRight', false);
                                updateContent();
                            }
                        }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        title="Align Right"
                    >
                        <AlignRight size={16} />
                    </button>
                </div>
                
                {/* Advanced Tools - Only for rich-text and text-block */}
                {selectedElement.type !== 'heading' && (
                    <>
                        {/* Separator */}
                        <div className="w-px h-6 bg-gray-300"></div>
                        
                        {/* Text Format Dropdown */}
                        <div className="flex items-center">
                            <select
                                onChange={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (editorRef.current) {
                                        const value = e.target.value;
                                        document.execCommand('formatBlock', false, value === 'p' ? '<p>' : `<${value}>`);
                                        updateContent();
                                        e.target.value = 'p';
                                    }
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                className="text-xs px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                defaultValue="p"
                            >
                                <option value="p">Paragraph</option>
                                <option value="h1">Heading 1</option>
                                <option value="h2">Heading 2</option>
                                <option value="h3">Heading 3</option>
                                <option value="h4">Heading 4</option>
                                <option value="h5">Heading 5</option>
                                <option value="h6">Heading 6</option>
                            </select>
                        </div>
                        
                        {/* Separator */}
                        <div className="w-px h-6 bg-gray-300"></div>
                        
                        <div className="flex items-center">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Link button clicked');
                                    const editor = editorRef.current;
                                    if (editor) {
                                        console.log('Editor found, focusing...');
                                        editor.focus();
                                        const selection = window.getSelection();
                                        const selectedText = selection?.toString().trim() || '';
                                        let savedRange: Range | null = null;
                                        
                                        // Save the current selection range
                                        if (selection && selection.rangeCount > 0) {
                                            savedRange = selection.getRangeAt(0).cloneRange();
                                            console.log('Saved range:', savedRange);
                                        }
                                        
                                        console.log('Selected text:', selectedText);
                                        console.log('Dispatching custom event...');
                                        
                                        // Direct modal opening instead of custom event for debugging
                                        setLinkModal({
                                            isOpen: true,
                                            linkElement: null,
                                            text: selectedText,
                                            url: '',
                                            isEdit: false,
                                            savedRange: savedRange
                                        });
                                        console.log('Modal state set directly');
                                    } else {
                                        console.log('Editor not found!');
                                    }
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                                title="Add Link"
                            >
                                <Link size={16} />
                            </button>
                            
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Image button clicked');
                                    const editor = editorRef.current;
                                    if (editor) {
                                        console.log('Editor found, focusing...');
                                        editor.focus();
                                        const selection = window.getSelection();
                                        let savedRange: Range | null = null;
                                        
                                        // Save the current selection range
                                        if (selection && selection.rangeCount > 0) {
                                            savedRange = selection.getRangeAt(0).cloneRange();
                                            console.log('Saved range:', savedRange);
                                        }
                                        
                                        setImageGallery({
                                            isOpen: true,
                                            savedRange: savedRange
                                        });
                                        console.log('Image gallery opened');
                                    } else {
                                        console.log('Editor not found!');
                                    }
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                                title="Add Image"
                            >
                                <Image size={16} />
                            </button>
                            
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (editorRef.current) {
                                        editorRef.current.focus();
                                        document.execCommand('removeFormat', false);
                                        updateContent();
                                    }
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                                title="Clear Formatting"
                            >
                                <FileX size={16} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="relative pointer-events-auto">
            <style dangerouslySetInnerHTML={{
                __html: `
                    #rich-editor-${selectedElement.id} a {
                        color: #2563eb !important;
                        text-decoration: underline !important;
                        cursor: pointer !important;
                        font-weight: inherit !important;
                        background-color: rgba(37, 99, 235, 0.1) !important;
                        padding: 1px 2px !important;
                        border-radius: 2px !important;
                    }
                    #rich-editor-${selectedElement.id} a:hover {
                        text-decoration: underline !important;
                        background-color: rgba(37, 99, 235, 0.2) !important;
                    }
                    #rich-editor-${selectedElement.id} img {
                        cursor: pointer !important;
                        transition: all 0.2s ease !important;
                        border: 2px solid transparent !important;
                    }
                    #rich-editor-${selectedElement.id} img:hover {
                        border-color: #e5e7eb !important;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
                    }
                    #rich-editor-${selectedElement.id} img:focus {
                        outline: 2px solid #3b82f6 !important;
                        outline-offset: 2px !important;
                        border-color: #3b82f6 !important;
                    }
                `
            }} />

            {/* Render portaled toolbar */}
            {showToolbar && typeof document !== 'undefined' && document.body && createPortal(renderPortalToolbar(), document.body)}
            
            {/* Link Modal */}
            {linkModal.isOpen && typeof document !== 'undefined' && document.body && createPortal(
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]"
                    onClick={(e) => {
                        console.log('Backdrop clicked');
                        // Close modal only if clicking on backdrop
                        if (e.target === e.currentTarget) {
                            setLinkModal({ isOpen: false, linkElement: null, text: '', url: '', isEdit: false, savedRange: null });
                        }
                    }}
                    onMouseDown={(e) => {
                        console.log('Backdrop mouse down - stopping propagation');
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                    onPointerDown={(e) => {
                        console.log('Backdrop pointer down - stopping propagation');
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                    onMouseUp={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                    onPointerUp={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                    style={{ pointerEvents: 'auto' }}
                >
                    <div 
                        className="bg-white rounded-lg p-6 w-96 mx-4"
                        onClick={(e) => {
                            console.log('Modal content clicked - stopping propagation');
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                        onMouseDown={(e) => {
                            console.log('Modal content mouse down - stopping propagation');
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                        onPointerDown={(e) => {
                            console.log('Modal content pointer down - stopping propagation');
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                        onMouseUp={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                        onPointerUp={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                    >
                        <h3 className="text-lg font-semibold mb-4">
                            {linkModal.isEdit ? 'Edit Link' : 'Add Link'}
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Link Text
                                </label>
                                <input
                                    type="text"
                                    value={linkModal.text}
                                    onChange={(e) => setLinkModal(prev => ({ ...prev, text: e.target.value }))}
                                    onClick={(e) => {
                                        console.log('Text input clicked - stopping propagation');
                                        e.stopPropagation();
                                    }}
                                    onMouseDown={(e) => {
                                        console.log('Text input mouse down - stopping propagation');
                                        e.stopPropagation();
                                    }}
                                    onPointerDown={(e) => {
                                        console.log('Text input pointer down - stopping propagation');
                                        e.stopPropagation();
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter link text"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL
                                </label>
                                <input
                                    type="url"
                                    value={linkModal.url}
                                    onChange={(e) => setLinkModal(prev => ({ ...prev, url: e.target.value }))}
                                    onFocus={(e) => {
                                        console.log('URL input focused');
                                        e.stopPropagation();
                                    }}
                                    onBlur={(e) => {
                                        console.log('URL input blurred');
                                        e.stopPropagation();
                                    }}
                                    onClick={(e) => {
                                        console.log('URL input clicked - stopping propagation');
                                        e.stopPropagation();
                                    }}
                                    onMouseDown={(e) => {
                                        console.log('URL input mouse down - stopping propagation');
                                        e.stopPropagation();
                                    }}
                                    onPointerDown={(e) => {
                                        console.log('URL input pointer down - stopping propagation');
                                        e.stopPropagation();
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-between mt-6">
                            <div>
                                {linkModal.isEdit && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteLinkModal();
                                        }}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    >
                                        Delete Link
                                    </button>
                                )}
                            </div>
                            
                            <div className="space-x-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLinkModal({ isOpen: false, linkElement: null, text: '', url: '', isEdit: false, savedRange: null });
                                    }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        saveLinkModal();
                                    }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    disabled={!linkModal.text.trim() || !linkModal.url.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {linkModal.isEdit ? 'Update' : 'Add'} Link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>, document.body
            )}
            
            {/* Image Gallery Modal */}
            {imageGallery.isOpen && (
                <ImageGallery
                    isOpen={imageGallery.isOpen}
                    onClose={() => setImageGallery({ isOpen: false, savedRange: null })}
                    onImageSelect={handleImageSelect}
                    mode="picker"
                />
            )}
            
            {/* Editor */}
            <div
                ref={editorRef}
                id={`rich-editor-${selectedElement.id}`}
                contentEditable="true"
                suppressContentEditableWarning={true}
                className={selectedElement.type === 'heading' ? 
                    "p-4 text-sm focus:outline-none rounded-lg border-none" : 
                    "p-4 text-sm focus:outline-none rounded-lg border-none"}
                style={{ 
                    lineHeight: selectedElement.lineHeight ? `${selectedElement.lineHeight}%` : '1.5',
                    outline: '0',
                    border: '0',
                    textAlign: selectedElement.textAlign || 'left',
                    fontFamily: selectedElement.fontFamily || undefined,
                    fontSize: selectedElement.fontSize ? `${selectedElement.fontSize}px` : undefined,
                    fontWeight: selectedElement.fontWeight || undefined,
                    color: selectedElement.textColor || undefined,
                    letterSpacing: selectedElement.letterSpacing ? `${selectedElement.letterSpacing}px` : undefined,
                    backgroundColor: selectedElement.backgroundColor || 'transparent',
                    WebkitUserSelect: 'text',
                    MozUserSelect: 'text',
                    msUserSelect: 'text',
                    userSelect: 'text',
                    ...(selectedElement.type === 'heading' && {
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                    })
                }}
                onInput={(e) => {
                    const target = e.target as HTMLDivElement;
                    if (selectedElement.type === 'heading') {
                        const htmlContent = target.innerHTML.replace(/<br\s*\/?>/gi, '').replace(/\n/g, '');
                        onContentChange(htmlContent);
                    } else {
                        onContentChange(target.innerHTML);
                    }
                }}
                onKeyDown={(e) => {
                    if (selectedElement.type === 'heading' && e.key === 'Enter') {
                        e.preventDefault();
                        return;
                    }

                    // Handle image deletion
                    if (e.key === 'Delete' || e.key === 'Backspace') {
                        const selection = window.getSelection();
                        if (selection && selection.rangeCount > 0) {
                            const range = selection.getRangeAt(0);
                            
                            if (e.key === 'Backspace' && range.collapsed) {
                                // For backspace, check if there's an image before the cursor
                                const container = range.startContainer;
                                const offset = range.startOffset;
                                
                                if (container.nodeType === Node.TEXT_NODE && offset === 0) {
                                    // At beginning of text node, check previous sibling
                                    const prevSibling = container.previousSibling;
                                    if (prevSibling && prevSibling.nodeName === 'IMG') {
                                        e.preventDefault();
                                        prevSibling.remove();
                                        updateContent();
                                        return;
                                    }
                                } else if (container.nodeType === Node.ELEMENT_NODE) {
                                    // In element node, check the node before cursor position
                                    const nodeBeforeCursor = container.childNodes[offset - 1];
                                    if (nodeBeforeCursor && nodeBeforeCursor.nodeName === 'IMG') {
                                        e.preventDefault();
                                        nodeBeforeCursor.remove();
                                        updateContent();
                                        return;
                                    }
                                }
                            } else if (e.key === 'Delete' && range.collapsed) {
                                // For delete key, check if there's an image after the cursor
                                const container = range.startContainer;
                                const offset = range.startOffset;
                                
                                if (container.nodeType === Node.TEXT_NODE && offset === container.textContent?.length) {
                                    // At end of text node, check next sibling
                                    const nextSibling = container.nextSibling;
                                    if (nextSibling && nextSibling.nodeName === 'IMG') {
                                        e.preventDefault();
                                        nextSibling.remove();
                                        updateContent();
                                        return;
                                    }
                                } else if (container.nodeType === Node.ELEMENT_NODE) {
                                    // In element node, check the node after cursor position
                                    const nodeAfterCursor = container.childNodes[offset];
                                    if (nodeAfterCursor && nodeAfterCursor.nodeName === 'IMG') {
                                        e.preventDefault();
                                        nodeAfterCursor.remove();
                                        updateContent();
                                        return;
                                    }
                                }
                            }
                            
                            // Check if selection contains any images
                            if (!range.collapsed) {
                                const fragment = range.cloneContents();
                                const images = fragment.querySelectorAll('img');
                                if (images.length > 0) {
                                    // Let the browser handle the deletion naturally since selection contains images
                                    setTimeout(() => updateContent(), 0);
                                }
                            }
                        }
                    }
                }}
                onFocus={() => setShowToolbar(true)}
                onBlur={(e) => {
                    console.log('Editor blurred, linkModal.isOpen:', linkModal.isOpen, 'imageGallery.isOpen:', imageGallery.isOpen);
                    // Only hide toolbar if focus moves completely away from editor area and no modal is open
                    if (!linkModal.isOpen && !imageGallery.isOpen && !e.currentTarget.contains(e.relatedTarget as Node)) {
                        console.log('Hiding toolbar');
                        setShowToolbar(false);
                    } else {
                        console.log('Not hiding toolbar - modal is open or focus still in editor');
                    }
                }}
                onPaste={(e) => {
                    e.preventDefault();
                    const text = e.clipboardData?.getData('text/plain') || '';
                    document.execCommand('insertText', false, text);
                }}
                placeholder={!selectedElement.content ? 
                    (selectedElement.type === 'heading' ? "Click to edit heading..." : "Click to edit text...") : undefined}
            />
        </div>
    );
};
