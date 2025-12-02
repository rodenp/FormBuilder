'use client'

import React, { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { FormRenderer } from '@form-builder/core'
import clsx from 'clsx'

interface DynamicFormProps {
  formConfig: any
  onSuccess?: () => void
  onError?: (error: any) => void
}

export default function DynamicForm({ 
  formConfig, 
  onSuccess, 
  onError 
}: DynamicFormProps) {
  const submitForm = useMutation(api.formSubmissions.submitForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMessage, setShowMessage] = useState<{
    type: string
    message: string
  } | null>(null)

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    setShowMessage(null)
    
    try {
      // Submit to Convex
      await submitForm({
        formId: formConfig.id,
        formTitle: formConfig.settings.title,
        data,
        actions: formConfig.settings.submissionActions?.filter((a: any) => 
          a.type === 'webhook' && a.enabled
        ),
      })

      // Handle client-side actions
      const clientActions = formConfig.settings.submissionActions?.filter(
        (action: any) => action.enabled && ['redirect', 'message'].includes(action.type)
      ) || []

      for (const action of clientActions) {
        if (action.type === 'redirect' && action.redirectUrl) {
          if (action.openInNewTab) {
            window.open(action.redirectUrl, '_blank')
          } else {
            window.location.href = action.redirectUrl
          }
        } else if (action.type === 'message') {
          setShowMessage({
            type: action.messageType || 'success',
            message: action.message || 'Form submitted successfully!'
          })
        }
      }

      onSuccess?.()
    } catch (error) {
      console.error('Form submission error:', error)
      setShowMessage({
        type: 'error',
        message: 'Failed to submit form. Please try again.'
      })
      onError?.(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {showMessage && (
        <div className={clsx(
          'mb-6 p-4 rounded-lg mx-6 mt-6',
          showMessage.type === 'success' && 'bg-green-50 border border-green-200 text-green-800',
          showMessage.type === 'info' && 'bg-blue-50 border border-blue-200 text-blue-800',
          showMessage.type === 'warning' && 'bg-yellow-50 border border-yellow-200 text-yellow-800',
          showMessage.type === 'error' && 'bg-red-50 border border-red-200 text-red-800'
        )}>
          {showMessage.message}
        </div>
      )}
      
      <FormRenderer
        schema={formConfig}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  )
}