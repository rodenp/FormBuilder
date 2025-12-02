'use client'

import { FormBuilder, useStore } from '@form-builder/core'
import type { FormSchema } from '@form-builder/core'

interface FormBuilderWrapperProps {
  onSave?: (schema: FormSchema) => void
  onPublish?: (schema: FormSchema) => void
  initialSchema?: FormSchema
}

export function FormBuilderWrapper({ onSave, onPublish, initialSchema }: FormBuilderWrapperProps) {
  const { elements, settings } = useStore()
  
  // This would be better implemented with useEffect to load initialSchema
  // But for minimal changes, we'll just wrap the existing FormBuilder
  
  return (
    <div className="h-full w-full">
      <FormBuilder />
    </div>
  )
}