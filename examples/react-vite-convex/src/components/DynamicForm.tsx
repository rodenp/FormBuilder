import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import clsx from 'clsx';

interface DynamicFormProps {
  formConfig: any;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ 
  formConfig, 
  onSuccess, 
  onError 
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const submitForm = useMutation(api.formSubmissions.submitForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMessage, setShowMessage] = useState<{
    type: string;
    message: string;
  } | null>(null);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setShowMessage(null);
    
    try {
      // Submit to Convex
      const result = await submitForm({
        formId: formConfig.id,
        formTitle: formConfig.settings.title,
        data,
        actions: formConfig.settings.submissionActions?.filter((a: any) => 
          a.type === 'webhook' && a.enabled
        ),
      });

      // Handle client-side actions
      const clientActions = formConfig.settings.submissionActions?.filter(
        (action: any) => action.enabled && ['redirect', 'message'].includes(action.type)
      ) || [];

      for (const action of clientActions) {
        if (action.type === 'redirect' && action.redirectUrl) {
          if (action.openInNewTab) {
            window.open(action.redirectUrl, '_blank');
          } else {
            window.location.href = action.redirectUrl;
          }
        } else if (action.type === 'message') {
          setShowMessage({
            type: action.messageType || 'success',
            message: action.message || 'Form submitted successfully!'
          });
        }
      }

      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Form submission error:', error);
      setShowMessage({
        type: 'error',
        message: 'Failed to submit form. Please try again.'
      });
      onError?.(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputStyle = () => {
    const { primaryColor = '#3B82F6', inputBorderStyle = 'rounded' } = formConfig.settings;
    let borderRadius = '';
    
    switch (inputBorderStyle) {
      case 'square':
        borderRadius = 'rounded-none';
        break;
      case 'pill':
        borderRadius = 'rounded-full';
        break;
      default:
        borderRadius = 'rounded-md';
    }

    return { borderRadius, primaryColor };
  };

  const getButtonStyle = () => {
    const { primaryColor = '#3B82F6', buttonStyle = 'rounded' } = formConfig.settings;
    let borderRadius = '';
    
    switch (buttonStyle) {
      case 'square':
        borderRadius = 'rounded-none';
        break;
      case 'pill':
        borderRadius = 'rounded-full';
        break;
      default:
        borderRadius = 'rounded-lg';
    }

    return { borderRadius, backgroundColor: primaryColor };
  };

  const { borderRadius: inputBorderRadius, primaryColor } = getInputStyle();
  const { borderRadius: buttonBorderRadius, backgroundColor } = getButtonStyle();

  const renderElement = (element: any) => {
    const baseInputClasses = clsx(
      'w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 transition-all',
      inputBorderRadius
    );

    const labelClasses = clsx(
      'block mb-1',
      element.labelSize === 'xs' && 'text-xs',
      element.labelSize === 'sm' && 'text-sm',
      element.labelSize === 'lg' && 'text-lg',
      !element.labelSize && 'text-sm',
      element.labelBold && 'font-bold',
      element.labelItalic && 'italic',
      element.labelUnderline && 'underline',
      element.labelStrikethrough && 'line-through'
    );

    const widthClasses = `w-${element.width}/12`;

    switch (element.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
      case 'time':
      case 'month':
        return (
          <div key={element.id} className={clsx('mb-4', widthClasses)}>
            <label className={labelClasses}>
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={element.type}
              {...register(element.name, { 
                required: element.required ? `${element.label} is required` : false,
                pattern: element.validation?.pattern ? {
                  value: new RegExp(element.validation.pattern),
                  message: 'Invalid format'
                } : undefined,
                min: element.validation?.min,
                max: element.validation?.max
              })}
              placeholder={element.placeholder}
              className={baseInputClasses}
              style={{ 
                borderColor: errors[element.name] ? '#EF4444' : undefined,
                '--tw-ring-color': primaryColor 
              } as any}
            />
            {errors[element.name] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[element.name]?.message || 'This field is required'}
              </p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={element.id} className={clsx('mb-4', widthClasses)}>
            <label className={labelClasses}>
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              {...register(element.name, { 
                required: element.required ? `${element.label} is required` : false 
              })}
              placeholder={element.placeholder}
              rows={4}
              className={clsx(baseInputClasses, 'resize-none')}
              style={{ '--tw-ring-color': primaryColor } as any}
            />
            {errors[element.name] && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={element.id} className={clsx('mb-4', widthClasses)}>
            <label className={labelClasses}>
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              {...register(element.name, { 
                required: element.required ? `${element.label} is required` : false 
              })}
              className={baseInputClasses}
              style={{ '--tw-ring-color': primaryColor } as any}
            >
              <option value="">Select an option</option>
              {element.options?.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors[element.name] && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={element.id} className={clsx('mb-4', widthClasses)}>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register(element.name)}
                className="mr-2 h-4 w-4"
                style={{ accentColor: primaryColor }}
              />
              <span className={labelClasses}>
                {element.label}
                {element.required && <span className="text-red-500 ml-1">*</span>}
              </span>
            </label>
          </div>
        );

      case 'radio':
        return (
          <div key={element.id} className={clsx('mb-4', widthClasses)}>
            <label className={clsx(labelClasses, 'mb-2')}>
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {element.options?.map((opt: any) => (
                <label key={opt.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value={opt.value}
                    {...register(element.name, { 
                      required: element.required ? `${element.label} is required` : false 
                    })}
                    className="mr-2"
                    style={{ accentColor: primaryColor }}
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
            {errors[element.name] && (
              <p className="text-red-500 text-sm mt-1">This field is required</p>
            )}
          </div>
        );

      case 'hidden':
        return (
          <input
            key={element.id}
            type="hidden"
            {...register(element.name)}
            value={element.value || ''}
          />
        );

      case 'rich-text':
        return (
          <div 
            key={element.id}
            className={clsx('mb-4 prose prose-sm max-w-none', widthClasses)}
            dangerouslySetInnerHTML={{ __html: element.content || '' }}
          />
        );

      case 'container':
        return (
          <div
            key={element.id}
            className={clsx('mb-4 p-6 border border-gray-200 rounded-lg bg-gray-50', widthClasses)}
          >
            {element.label && (
              <h3 className="text-lg font-semibold mb-4">{element.label}</h3>
            )}
            {element.children?.map(renderElement)}
          </div>
        );

      case 'columns':
        return (
          <div
            key={element.id}
            className={clsx('mb-4 grid gap-4', widthClasses)}
            style={{
              gridTemplateColumns: `repeat(${element.columnCount || 2}, 1fr)`
            }}
          >
            {element.children?.map(renderElement)}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm"
      style={{ backgroundColor: formConfig.settings.formBackground || '#FFFFFF' }}
    >
      <h1 className="text-2xl font-bold mb-2">{formConfig.settings.title}</h1>
      {formConfig.settings.description && (
        <p className="text-gray-600 mb-6">{formConfig.settings.description}</p>
      )}

      {showMessage && (
        <div className={clsx(
          'mb-6 p-4 rounded-lg',
          showMessage.type === 'success' && 'bg-green-50 border border-green-200 text-green-800',
          showMessage.type === 'info' && 'bg-blue-50 border border-blue-200 text-blue-800',
          showMessage.type === 'warning' && 'bg-yellow-50 border border-yellow-200 text-yellow-800',
          showMessage.type === 'error' && 'bg-red-50 border border-red-200 text-red-800'
        )}>
          {showMessage.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {formConfig.elements.map(renderElement)}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={clsx(
            'w-full py-3 px-6 text-white font-medium transition-all',
            'hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed',
            buttonBorderRadius
          )}
          style={{ backgroundColor }}
        >
          {isSubmitting ? 'Submitting...' : formConfig.settings.submitButtonText}
        </button>
      </form>
    </div>
  );
};