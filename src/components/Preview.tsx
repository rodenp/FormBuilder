import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Smartphone, Tablet, Laptop, RotateCw } from 'lucide-react';
import { clsx } from 'clsx';
import { DeviceFrameset } from 'react-device-frameset';
import 'react-device-frameset/styles/marvel-devices.min.css';
import { Renderer } from './Renderer';

export const Preview: React.FC = () => {
    const { elements, settings } = useStore();
    const [selectedDevice, setSelectedDevice] = useState<'iPhone X' | 'MacBook Pro' | 'iPad Mini'>('MacBook Pro');
    const [isLandscape, setIsLandscape] = useState(false);

    useEffect(() => {
        // Default to landscape for iPad Mini, portrait for others
        if (selectedDevice === 'iPad Mini') {
            setIsLandscape(true);
        } else {
            setIsLandscape(false);
        }
    }, [selectedDevice]);

    return (
        <div className="flex flex-col h-full bg-slate-100 overflow-hidden">
            {/* Device Selector Toolbar */}
            <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setSelectedDevice('iPhone X')}
                            className={clsx(
                                "p-2 rounded-md transition-all flex items-center gap-2",
                                selectedDevice === 'iPhone X'
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                            )}
                            title="Mobile"
                        >
                            <Smartphone size={18} />
                            <span className="text-xs font-medium">Mobile</span>
                        </button>
                        <button
                            onClick={() => setSelectedDevice('iPad Mini')}
                            className={clsx(
                                "p-2 rounded-md transition-all flex items-center gap-2",
                                selectedDevice === 'iPad Mini'
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                            )}
                            title="Tablet"
                        >
                            <Tablet size={18} />
                            <span className="text-xs font-medium">Tablet</span>
                        </button>
                        <button
                            onClick={() => setSelectedDevice('MacBook Pro')}
                            className={clsx(
                                "p-2 rounded-md transition-all flex items-center gap-2",
                                selectedDevice === 'MacBook Pro'
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                            )}
                            title="Desktop"
                        >
                            <Laptop size={18} />
                            <span className="text-xs font-medium">Desktop</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsLandscape(!isLandscape)}
                        className={clsx(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                            isLandscape
                                ? "bg-blue-50 text-blue-600 border border-blue-200"
                                : "text-slate-600 hover:bg-slate-100 border border-transparent"
                        )}
                        title="Rotate Device"
                    >
                        <RotateCw size={16} />
                        <span>{isLandscape ? 'Landscape' : 'Portrait'}</span>
                    </button>
                </div>
            </div>

            {/* Device Preview Area */}
            <div className="flex-1 overflow-auto p-8 flex items-start justify-center bg-slate-100/50">
                <div className={clsx(
                    "transition-all duration-500 ease-in-out origin-top",
                    selectedDevice === 'MacBook Pro' ? "scale-[0.65] 2xl:scale-[0.8]" :
                        selectedDevice === 'iPad Mini' ? "scale-[0.85]" : "scale-100"
                )}>
                    <DeviceFrameset device={selectedDevice} color="black" landscape={isLandscape}>
                        <div className="w-full h-full overflow-y-auto custom-scrollbar">
                            <div className="min-h-full">
                                <Renderer
                                    elements={elements}
                                    settings={settings}
                                />
                            </div>
                        </div>
                    </DeviceFrameset>
                </div>
            </div>
        </div>
    );
};
