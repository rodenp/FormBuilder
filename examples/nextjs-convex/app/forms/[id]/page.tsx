'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { FormRenderer } from '@form-builder/core'
import Link from 'next/link'
import { useState } from 'react'
import clsx from 'clsx'

export default function FormPage({ params }: { params: { id: string } }) {
  const form = useQuery(api.forms.getForm, { formId: params.id })
  const submitForm = useMutation(api.formSubmissions.submitForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMessage, setShowMessage] = useState<{
    type: string
    message: string
  } | null>(null)

  const handleSubmit = async (data: any) => {
    console.log('Form submission started:', data)
    
    if (!form) {
      console.error('No form data available')
      return
    }
    
    setIsSubmitting(true)
    setShowMessage(null)

    try {
      console.log('Submitting to Convex with:', {
        formId: form.formId,
        formTitle: form.config.settings.title,
        data,
        actions: form.config.settings.submissionActions
      })

      // Submit to Convex (includes form action and webhook processing)
      const result = await submitForm({
        formId: form.formId,
        formTitle: form.config.settings.title,
        data,
        formAction: form.config.settings.formAction,
        actions: form.config.settings.submissionActions?.filter((a: any) => 
          a.type === 'webhook' && a.enabled
        ) || [],
      })

      console.log('Convex submission result:', result)

      // Handle client-side actions
      const clientActions = form.config.settings.submissionActions?.filter(
        (action: any) => action.enabled && ['redirect', 'message'].includes(action.type)
      ) || []

      console.log('Processing client actions:', clientActions)

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

      // Default success message if no message action
      if (clientActions.filter(a => a.type === 'message').length === 0) {
        setShowMessage({
          type: 'success',
          message: 'Form submitted successfully!'
        })
      }
    } catch (error) {
      console.error('Submission error:', error)
      setShowMessage({
        type: 'error',
        message: 'Failed to submit form. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link href="/forms" className="text-blue-600 hover:text-blue-700">
                ← Back to Forms
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading form...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (form === null) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link href="/forms" className="text-blue-600 hover:text-blue-700">
                ← Back to Forms
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Form not found</h3>
              <p className="text-gray-500 mb-6">The form you're looking for doesn't exist or has been deleted.</p>
              <Link
                href="/forms"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View All Forms
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Link href="/forms" className="text-blue-600 hover:text-blue-700">
              ← Back to Forms
            </Link>
            <div className="flex gap-2">
              <Link
                href={`/builder?id=${form.formId}`}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Edit Form
              </Link>
              <Link
                href={`/forms/${form.formId}/submissions`}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                View Submissions
              </Link>
            </div>
          </div>

          {showMessage && (
            <div className={clsx(
              'mb-6 p-4 rounded-lg',
              showMessage.type === 'success' && 'bg-green-50 border border-green-200 text-green-800',
              showMessage.type === 'info' && 'bg-blue-50 border border-blue-200 text-blue-800',
              showMessage.type === 'warning' && 'bg-yellow-50 border border-yellow-200 text-yellow-800',
              showMessage.type === 'error' && 'bg-red-50 border border-red-200 text-red-800'
            )}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {showMessage.type === 'success' && (
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {showMessage.type === 'error' && (
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{showMessage.message}</p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      onClick={() => setShowMessage(null)}
                      className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <FormRenderer
              schema={form.config}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  )
}