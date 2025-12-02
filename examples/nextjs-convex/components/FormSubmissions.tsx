'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

export default function FormSubmissions({ formId }: { formId: string }) {
  const submissions = useQuery(api.formSubmissions.getSubmissions, { formId })
  const deleteSubmission = useMutation(api.formSubmissions.deleteSubmission)

  const handleDelete = async (submissionId: Id<"formSubmissions">) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      await deleteSubmission({ submissionId })
    }
  }

  if (!submissions) return (
    <div>
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          <div className="h-32 bg-gray-100 rounded"></div>
          <div className="h-32 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {submissions.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500">No submissions yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Submit the form to see submissions here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div 
              key={submission._id} 
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    ID: {submission._id}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`
                    px-2 py-1 text-xs rounded-full
                    ${submission.processed 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                    }
                  `}>
                    {submission.processed ? 'Processed' : 'Pending'}
                  </span>
                  <button
                    onClick={() => handleDelete(submission._id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                    title="Delete submission"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded p-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(submission.data).map(([key, value]) => (
                      <tr key={key} className="border-b border-gray-200 last:border-b-0">
                        <td className="py-2 pr-4 font-medium text-gray-600 align-top whitespace-nowrap">
                          {key}:
                        </td>
                        <td className="py-2 text-gray-900">
                          {typeof value === 'object' 
                            ? JSON.stringify(value, null, 2)
                            : String(value)
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}