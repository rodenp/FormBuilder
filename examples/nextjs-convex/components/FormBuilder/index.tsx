'use client'

import React, { useEffect } from 'react'
import { FormBuilder as FormBuilderCore, FormSchema } from '@form-builder/core'

interface FormBuilderProps {
  onStateChange?: (schema: FormSchema) => void
  initialSchema?: FormSchema
}

export const FormBuilderWithConvex: React.FC<FormBuilderProps> = ({
  onStateChange,
  initialSchema
}) => {
  const handleSave = (schema: FormSchema) => {
    onStateChange?.(schema)
  }

  const handlePreview = (schema: FormSchema) => {
    onStateChange?.(schema)
  }

  return (
    <FormBuilderCore
      initialSchema={initialSchema}
      onSave={handleSave}
      onPreview={handlePreview}
      showPreview={true}
      className="flex-1"
    />
  )
}