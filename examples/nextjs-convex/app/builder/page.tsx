'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { FormBuilderWrapper } from '@/components/FormBuilderWrapper'
import type { FormSchema } from '@form-builder/core'
import Link from 'next/link'

export default function BuilderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const formId = searchParams.get('id')
  
  const saveForm = useMutation(api.forms.saveForm)
  const existingForm = useQuery(api.forms.getForm, formId ? { formId } : 'skip')
  
  const [saving, setSaving] = useState(false)
  const [savedFormId, setSavedFormId] = useState<string | null>(null)

  const handleSave = async (schema: FormSchema) => {
    setSaving(true)
    try {
      const id = await saveForm({
        formId: schema.id,
        config: schema,
      })
      
      setSavedFormId(id)
      setTimeout(() => setSavedFormId(null), 3000)
      
      // Update URL without navigation
      window.history.replaceState({}, '', `/builder?id=${id}`)
    } catch (error) {
      console.error('Failed to save form:', error)
      alert('Failed to save form')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async (schema: FormSchema) => {
    setSaving(true)
    try {
      const id = await saveForm({
        formId: schema.id,
        config: schema,
      })
      
      // Redirect to form view
      router.push(`/forms/${id}`)
    } catch (error) {
      console.error('Failed to publish form:', error)
      alert('Failed to publish form')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="border-b bg-white px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/forms"
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Forms
          </Link>
          <h1 className="text-xl font-bold">Form Builder</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {savedFormId && (
            <span className="text-green-600 text-sm mr-4">
              ✓ Form saved
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <FormBuilderWrapper 
          onSave={handleSave}
          onPublish={handlePublish}
          initialSchema={existingForm?.config}
        />
      </div>
      
      {saving && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-gray-700">Saving form...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}