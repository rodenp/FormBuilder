'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Link from 'next/link'
import { useState } from 'react'

export default function SubmissionsPage({ params }: { params: { id: string } }) {
  const form = useQuery(api.forms.getForm, { formId: params.id })
  const submissions = useQuery(api.formSubmissions.getSubmissions, { formId: params.id })
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Link href="/forms" className="text-blue-600 hover:text-blue-700">
                ← Back to Forms
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <Link href="/forms" className="text-blue-600 hover:text-blue-700 text-sm">
                ← Back to Forms
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">
                Form Submissions: {form.config.settings.title}
              </h1>
              <p className="text-gray-600">
                {submissions?.length || 0} total submissions
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/builder?id=${form.formId}`}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Edit Form
              </Link>
              <Link
                href={`/forms/${form.formId}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Form
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submissions List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Submissions</h2>
              </div>
              
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {!submissions ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading submissions...</p>
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="p-12 text-center">
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
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                    <p className="text-gray-500">Submissions will appear here once users submit the form</p>
                  </div>
                ) : (
                  submissions.map((submission) => (
                    <div
                      key={submission._id}
                      onClick={() => setSelectedSubmission(submission)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedSubmission?._id === submission._id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              submission.processed ? 'bg-green-500' : 'bg-yellow-500'
                            }`}></div>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              Submission #{submission._id.slice(-8)}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(submission.submittedAt)}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            submission.processed 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {submission.processed ? 'Processed' : 'Processing'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Submission Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Submission Details</h2>
              </div>
              
              <div className="p-6">
                {!selectedSubmission ? (
                  <div className="text-center py-12">
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
                        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.122 2.122"
                      />
                    </svg>
                    <p className="text-gray-500">Select a submission to view details</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Submission Info */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Submission Info</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">ID:</span>
                          <span className="text-gray-900 ml-2 font-mono">
                            {selectedSubmission._id}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Submitted:</span>
                          <span className="text-gray-900 ml-2">
                            {formatDate(selectedSubmission.submittedAt)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            selectedSubmission.processed 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {selectedSubmission.processed ? 'Processed' : 'Processing'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Form Data */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Form Data</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                          {JSON.stringify(selectedSubmission.data, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {/* Export Actions */}
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Actions</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const dataStr = JSON.stringify(selectedSubmission.data, null, 2)
                            navigator.clipboard.writeText(dataStr)
                            alert('Data copied to clipboard!')
                          }}
                          className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                          Copy Data
                        </button>
                        <button
                          onClick={() => {
                            const dataStr = JSON.stringify(selectedSubmission, null, 2)
                            const blob = new Blob([dataStr], { type: 'application/json' })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `submission-${selectedSubmission._id}.json`
                            a.click()
                            URL.revokeObjectURL(url)
                          }}
                          className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          Download JSON
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}