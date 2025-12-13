import React, { useState } from 'react';
import { Webhook, ExternalLink, MessageCircle, Plus, X, Globe } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { clsx } from 'clsx';
import type { FormSettings, SubmissionAction } from '../../types';

interface ActionPanelProps {
    settings: FormSettings;
    updateSettings: (settings: Partial<FormSettings>) => void;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ settings, updateSettings }) => {
    const [showActionSelector, setShowActionSelector] = useState(false);

    const hasUserAction = settings.submissionActions.some(action => action.type === 'redirect' || action.type === 'message');
    const hasFormAction = !!settings.formAction;

    const addSubmissionAction = (type: string) => {
        const newAction: SubmissionAction = {
            id: uuidv4(),
            type: type as any,
            enabled: true,
            ...(type === 'redirect' && { redirectUrl: 'https://example.com/success', openInNewTab: false }),
            ...(type === 'webhook' && { webhook: { id: uuidv4(), url: 'https://api.example.com/webhook', method: 'POST', enabled: true } }),
            ...(type === 'message' && { message: 'Thank you for your submission!', messageType: 'success' })
        };
        updateSettings({ submissionActions: [...settings.submissionActions, newAction] });
        setShowActionSelector(false);
    };

    const actionTypes = [
        {
            type: 'webhook',
            label: 'Webhook',
            description: 'Send data to external API',
            icon: <Webhook size={24} />,
            color: 'text-green-500',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            hoverBg: 'hover:bg-green-100',
            disabled: false
        },
        {
            type: 'redirect',
            label: 'Redirect',
            description: 'Redirect to another page',
            icon: <ExternalLink size={24} />,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            hoverBg: 'hover:bg-blue-100',
            disabled: hasFormAction || hasUserAction
        },
        {
            type: 'message',
            label: 'Message',
            description: 'Show custom message',
            icon: <MessageCircle size={24} />,
            color: 'text-purple-500',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            hoverBg: 'hover:bg-purple-100',
            disabled: hasFormAction || hasUserAction
        }
    ];

    return (
        <div className="space-y-6">
            {/* Form Action Configuration */}
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Form Action
                </label>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-gray-400 mb-2">
                            Action URL (optional)
                        </label>
                        <input
                            type="url"
                            value={settings.formAction || ''}
                            onChange={(e) => updateSettings({ formAction: e.target.value })}
                            placeholder="https://your-domain.com/submit"
                            className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none font-mono"
                        />
                        <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">Submit form directly to your server endpoint</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-gray-400 mb-2">
                                Method
                            </label>
                            <select
                                value={settings.formMethod || 'POST'}
                                onChange={(e) => updateSettings({ formMethod: e.target.value as any })}
                                className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                            >
                                <option value="POST">POST</option>
                                <option value="GET">GET</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-gray-400 mb-2">
                                Target
                            </label>
                            <select
                                value={settings.formTarget || '_self'}
                                onChange={(e) => updateSettings({ formTarget: e.target.value })}
                                className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                            >
                                <option value="_self">Same Window</option>
                                <option value="_blank">New Tab</option>
                                <option value="_parent">Parent Frame</option>
                                <option value="_top">Top Frame</option>
                            </select>
                        </div>
                    </div>

                    {settings.formAction && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-xs text-blue-700">
                                <strong>Note:</strong> When form action is set, only webhook submission actions are available.
                                Form data will be submitted directly to your endpoint.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="border-t border-slate-200 dark:border-gray-700 pt-6">
                <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                    Additional Submission Actions
                </label>
            </div>

            <div className="space-y-3">
                {settings.submissionActions.map((action, index) => (
                    <div key={action.id} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className={clsx(
                                    "p-2 rounded-lg",
                                    action.type === 'redirect' && "bg-blue-50 text-blue-500",
                                    action.type === 'webhook' && "bg-green-50 text-green-500",
                                    action.type === 'message' && "bg-purple-50 text-purple-500"
                                )}>
                                    {action.type === 'redirect' && <ExternalLink size={16} />}
                                    {action.type === 'webhook' && <Webhook size={16} />}
                                    {action.type === 'message' && <MessageCircle size={16} />}
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-slate-700 capitalize">{action.type}</span>
                                    {action.type === 'webhook' && action.webhook && (
                                        <p
                                            className="text-xs text-slate-400 font-mono truncate max-w-[140px] cursor-help"
                                            title={action.webhook.url}
                                        >
                                            {action.webhook.url}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input
                                        type="checkbox"
                                        checked={action.enabled}
                                        onChange={(e) => {
                                            const newActions = [...settings.submissionActions];
                                            newActions[index] = { ...action, enabled: e.target.checked };
                                            updateSettings({ submissionActions: newActions });
                                        }}
                                        className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out checked:right-0 checked:border-brand-500 right-5 border-slate-300"
                                    />
                                    <label className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors ${action.enabled ? 'bg-brand-500' : 'bg-slate-300'}`}></label>
                                </div>
                                <button
                                    onClick={() => {
                                        const newActions = settings.submissionActions.filter((_, i) => i !== index);
                                        updateSettings({ submissionActions: newActions });
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {action.type === 'redirect' && (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        Redirect URL
                                    </label>
                                    <input
                                        type="url"
                                        value={action.redirectUrl || ''}
                                        onChange={(e) => {
                                            const newActions = [...settings.submissionActions];
                                            newActions[index] = { ...action, redirectUrl: e.target.value };
                                            updateSettings({ submissionActions: newActions });
                                        }}
                                        placeholder="https://example.com/success"
                                        className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none font-mono"
                                    />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700">
                                    <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
                                        Open in new tab
                                    </label>
                                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                        <input
                                            type="checkbox"
                                            checked={action.openInNewTab || false}
                                            onChange={(e) => {
                                                const newActions = [...settings.submissionActions];
                                                newActions[index] = { ...action, openInNewTab: e.target.checked };
                                                updateSettings({ submissionActions: newActions });
                                            }}
                                            className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out checked:right-0 checked:border-brand-500 right-5 border-slate-300"
                                        />
                                        <label className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors ${action.openInNewTab ? 'bg-brand-500' : 'bg-slate-300'}`}></label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {action.type === 'webhook' && action.webhook && (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        Method
                                    </label>
                                    <select
                                        value={action.webhook.method}
                                        onChange={(e) => {
                                            const newActions = [...settings.submissionActions];
                                            newActions[index] = {
                                                ...action,
                                                webhook: { ...action.webhook!, method: e.target.value as any }
                                            };
                                            updateSettings({ submissionActions: newActions });
                                        }}
                                        className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                    >
                                        <option value="POST">POST</option>
                                        <option value="PUT">PUT</option>
                                        <option value="PATCH">PATCH</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        Webhook URL
                                    </label>
                                    <input
                                        type="url"
                                        value={action.webhook.url}
                                        onChange={(e) => {
                                            const newActions = [...settings.submissionActions];
                                            newActions[index] = {
                                                ...action,
                                                webhook: { ...action.webhook!, url: e.target.value }
                                            };
                                            updateSettings({ submissionActions: newActions });
                                        }}
                                        placeholder="https://api.example.com/webhook"
                                        className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none font-mono"
                                    />
                                </div>
                            </div>
                        )}

                        {action.type === 'message' && (
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        Message Type
                                    </label>
                                    <select
                                        value={action.messageType || 'success'}
                                        onChange={(e) => {
                                            const newActions = [...settings.submissionActions];
                                            newActions[index] = { ...action, messageType: e.target.value as any };
                                            updateSettings({ submissionActions: newActions });
                                        }}
                                        className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                                    >
                                        <option value="success">Success</option>
                                        <option value="info">Info</option>
                                        <option value="warning">Warning</option>
                                        <option value="error">Error</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        Message Content
                                    </label>
                                    <textarea
                                        value={action.message || ''}
                                        onChange={(e) => {
                                            const newActions = [...settings.submissionActions];
                                            newActions[index] = { ...action, message: e.target.value };
                                            updateSettings({ submissionActions: newActions });
                                        }}
                                        placeholder="Thank you for your submission!"
                                        className="w-full p-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none resize-none"
                                        rows={4}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Add Action Button */}
            <div className="mt-4">
                {!showActionSelector ? (
                    <button
                        onClick={() => setShowActionSelector(true)}
                        className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 dark:border-gray-700 rounded-xl text-slate-500 dark:text-gray-400 hover:border-brand-300 dark:hover:border-brand-700 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                    >
                        <Plus size={20} />
                        <span className="font-medium">Add Submission Action</span>
                    </button>
                ) : (
                    <div className="border border-slate-200 dark:border-gray-700 rounded-xl p-4 bg-slate-50 dark:bg-gray-800">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-slate-700 dark:text-gray-200">Choose Action Type</h4>
                            <button
                                onClick={() => setShowActionSelector(false)}
                                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {actionTypes.map((actionType) => (
                                <button
                                    key={actionType.type}
                                    onClick={() => {
                                        if (!actionType.disabled) {
                                            addSubmissionAction(actionType.type);
                                            setShowActionSelector(false);
                                        }
                                    }}
                                    disabled={actionType.disabled}
                                    className={clsx(
                                        "flex flex-col items-center gap-1 p-1.5 border rounded transition-all text-center",
                                        actionType.disabled
                                            ? "opacity-50 cursor-not-allowed border-slate-200 bg-slate-100"
                                            : `${actionType.borderColor} ${actionType.bgColor} ${actionType.hoverBg} hover:shadow-sm`
                                    )}
                                >
                                    <div className={`p-1 rounded ${actionType.bgColor} ${actionType.color}`}>
                                        <div className="w-3 h-3 flex items-center justify-center">
                                            {React.cloneElement(actionType.icon, { size: 12 })}
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-medium text-slate-700" style={{ fontSize: '10px' }}>{actionType.label}</h5>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {settings.submissionActions.length === 0 && !showActionSelector && (
                <div className="text-center py-4 text-slate-400">
                    <Globe size={20} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No submission actions configured</p>
                </div>
            )}
        </div>
    );
};
