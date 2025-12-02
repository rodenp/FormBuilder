import React from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import type { FormSchema, FormElement } from '../types';

interface FormRendererProps {
  schema: FormSchema;
  onSubmit: (data: any) => void | Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export const FormRenderer: React.FC<FormRendererProps> = ({
  schema,
  onSubmit,
  isLoading = false,
  className = ''
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleFormSubmit = async (data: any) => {
    // Always call the onSubmit handler - it will handle both form actions and webhooks
    await onSubmit(data);
  };

  const getInputStyle = () => {
    const { primaryColor = '#3B82F6', inputBorderStyle = 'rounded' } = schema.settings;
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
    const { primaryColor = '#3B82F6', buttonStyle = 'rounded' } = schema.settings;
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

  const renderElement = (element: FormElement, isRootLevel = true): JSX.Element | null => {
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

    // Only apply width classes at root level, nested elements should be full width
    const widthClasses = isRootLevel && element.width ? `w-${element.width}/12` : 'w-full';

    switch (element.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
      case 'time':
      case 'month':
        return (
          <div 
            key={element.id} 
            className={clsx('mb-4', widthClasses)}
            style={{
              marginLeft: element.marginLeft ? `${element.marginLeft * 0.25}rem` : undefined,
              marginRight: element.marginRight ? `${element.marginRight * 0.25}rem` : undefined,
              paddingLeft: element.paddingLeft ? `${element.paddingLeft * 0.25}rem` : undefined,
              paddingRight: element.paddingRight ? `${element.paddingRight * 0.25}rem` : undefined,
              paddingTop: element.paddingTop ? `${element.paddingTop * 0.25}rem` : undefined,
              paddingBottom: element.paddingBottom ? `${element.paddingBottom * 0.25}rem` : undefined
            }}>
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
                {(errors[element.name] as any)?.message || 'This field is required'}
              </p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div 
            key={element.id} 
            className={clsx('mb-4', widthClasses)}
            style={{
              marginLeft: element.marginLeft ? `${element.marginLeft * 0.25}rem` : undefined,
              marginRight: element.marginRight ? `${element.marginRight * 0.25}rem` : undefined,
              paddingLeft: element.paddingLeft ? `${element.paddingLeft * 0.25}rem` : undefined,
              paddingRight: element.paddingRight ? `${element.paddingRight * 0.25}rem` : undefined,
              paddingTop: element.paddingTop ? `${element.paddingTop * 0.25}rem` : undefined,
              paddingBottom: element.paddingBottom ? `${element.paddingBottom * 0.25}rem` : undefined
            }}>
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
          <div 
            key={element.id} 
            className={clsx('mb-4', widthClasses)}
            style={{
              marginLeft: element.marginLeft ? `${element.marginLeft * 0.25}rem` : undefined,
              marginRight: element.marginRight ? `${element.marginRight * 0.25}rem` : undefined,
              paddingLeft: element.paddingLeft ? `${element.paddingLeft * 0.25}rem` : undefined,
              paddingRight: element.paddingRight ? `${element.paddingRight * 0.25}rem` : undefined,
              paddingTop: element.paddingTop ? `${element.paddingTop * 0.25}rem` : undefined,
              paddingBottom: element.paddingBottom ? `${element.paddingBottom * 0.25}rem` : undefined
            }}>
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
              {element.options?.map((opt) => (
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
          <div 
            key={element.id} 
            className={clsx('mb-4', widthClasses)}
            style={{
              marginLeft: element.marginLeft ? `${element.marginLeft * 0.25}rem` : undefined,
              marginRight: element.marginRight ? `${element.marginRight * 0.25}rem` : undefined,
              paddingLeft: element.paddingLeft ? `${element.paddingLeft * 0.25}rem` : undefined,
              paddingRight: element.paddingRight ? `${element.paddingRight * 0.25}rem` : undefined,
              paddingTop: element.paddingTop ? `${element.paddingTop * 0.25}rem` : undefined,
              paddingBottom: element.paddingBottom ? `${element.paddingBottom * 0.25}rem` : undefined
            }}>
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
          <div 
            key={element.id} 
            className={clsx('mb-4', widthClasses)}
            style={{
              marginLeft: element.marginLeft ? `${element.marginLeft * 0.25}rem` : undefined,
              marginRight: element.marginRight ? `${element.marginRight * 0.25}rem` : undefined,
              paddingLeft: element.paddingLeft ? `${element.paddingLeft * 0.25}rem` : undefined,
              paddingRight: element.paddingRight ? `${element.paddingRight * 0.25}rem` : undefined,
              paddingTop: element.paddingTop ? `${element.paddingTop * 0.25}rem` : undefined,
              paddingBottom: element.paddingBottom ? `${element.paddingBottom * 0.25}rem` : undefined
            }}>
            <label className={clsx(labelClasses, 'mb-2')}>
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {element.options?.map((opt) => (
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
            style={{
              marginLeft: element.marginLeft ? `${element.marginLeft * 0.25}rem` : undefined,
              marginRight: element.marginRight ? `${element.marginRight * 0.25}rem` : undefined,
              paddingLeft: element.paddingLeft ? `${element.paddingLeft * 0.25}rem` : undefined,
              paddingRight: element.paddingRight ? `${element.paddingRight * 0.25}rem` : undefined,
              paddingTop: element.paddingTop ? `${element.paddingTop * 0.25}rem` : undefined,
              paddingBottom: element.paddingBottom ? `${element.paddingBottom * 0.25}rem` : undefined
            }}
            dangerouslySetInnerHTML={{ __html: element.content || '' }}
          />
        );

      case 'container':
        return (
          <div
            key={element.id}
            className={clsx('mb-4 p-6 border border-gray-200 rounded-lg bg-gray-50', widthClasses)}
            style={{
              marginLeft: element.marginLeft ? `${element.marginLeft * 0.25}rem` : undefined,
              marginRight: element.marginRight ? `${element.marginRight * 0.25}rem` : undefined,
              paddingLeft: element.paddingLeft ? `${element.paddingLeft * 0.25 + 1.5}rem` : undefined,
              paddingRight: element.paddingRight ? `${element.paddingRight * 0.25 + 1.5}rem` : undefined,
              paddingTop: element.paddingTop ? `${element.paddingTop * 0.25 + 1.5}rem` : undefined,
              paddingBottom: element.paddingBottom ? `${element.paddingBottom * 0.25 + 1.5}rem` : undefined
            }}
          >
            {element.label && (
              <h3 className="text-lg font-semibold mb-4">{element.label}</h3>
            )}
            {element.children?.map(child => renderElement(child, false))}
          </div>
        );

      case 'columns':
        return (
          <div
            key={element.id}
            className={clsx('mb-4 grid', widthClasses)}
            style={{
              gridTemplateColumns: `repeat(${element.columnCount || 2}, 1fr)`,
              gap: `${(element.gap ?? 4) * 0.25}rem`,
              marginLeft: element.marginLeft ? `${element.marginLeft * 0.25}rem` : undefined,
              marginRight: element.marginRight ? `${element.marginRight * 0.25}rem` : undefined,
              paddingLeft: element.paddingLeft ? `${element.paddingLeft * 0.25}rem` : undefined,
              paddingRight: element.paddingRight ? `${element.paddingRight * 0.25}rem` : undefined,
              paddingTop: element.paddingTop ? `${element.paddingTop * 0.25}rem` : undefined,
              paddingBottom: element.paddingBottom ? `${element.paddingBottom * 0.25}rem` : undefined
            }}
          >
            {element.children?.map(child => renderElement(child, false))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className={clsx('max-w-2xl mx-auto p-6', className)}
      style={{ backgroundColor: schema.settings.formBackground || '#FFFFFF' }}
    >
      <h1 className="text-2xl font-bold mb-2">{schema.settings.title}</h1>
      {schema.settings.description && (
        <p className="text-gray-600 mb-6">{schema.settings.description}</p>
      )}
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {schema.elements.map(element => renderElement(element, true))}
        
        <button
          type="submit"
          disabled={isLoading}
          className={clsx(
            'w-full py-3 px-6 text-white font-medium transition-all',
            'hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed',
            buttonBorderRadius
          )}
          style={{ backgroundColor }}
        >
          {isLoading ? 'Submitting...' : schema.settings.submitButtonText}
        </button>
      </form>
    </div>
  );
};