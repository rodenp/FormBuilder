'use client'

import { useQuery } from 'convex/react'
import Link from 'next/link'
import { api } from '@/convex/_generated/api'
import formConfig from '@/formConfig.json'

export default function AdminPage() {
  const submissions = useQuery(api.formSubmissions.getSubmissions, { 
    formId: formConfig.id 
  })

  const totalSubmissions = submissions?.length || 0
  const processedSubmissions = submissions?.filter(s => s.processed).length || 0
  const pendingSubmissions = totalSubmissions - processedSubmissions

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              ← Back to Form
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Admin Dashboard
          </h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Total Submissions
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {totalSubmissions}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Processed
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {processedSubmissions}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Pending
              </h3>
              <p className="text-3xl font-bold text-yellow-600">
                {pendingSubmissions}
              </p>
            </div>
          </div>

          {/* Form Configuration */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <h2 className="text-xl font-semibold mb-4">Form Configuration</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Form ID:</strong> {formConfig.id}</p>
              <p><strong>Title:</strong> {formConfig.settings.title}</p>
              <p><strong>Fields:</strong> {formConfig.elements.length}</p>
              <p><strong>Actions:</strong> {formConfig.settings.submissionActions?.length || 0}</p>
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Recent Submissions</h2>
            {submissions && submissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Data Preview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.slice(0, 5).map((submission) => (
                      <tr key={submission._id} className="border-b">
                        <td className="py-2">
                          {new Date(submission.submittedAt).toLocaleString()}
                        </td>
                        <td className="py-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            submission.processed 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {submission.processed ? 'Processed' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-2">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {JSON.stringify(submission.data).substring(0, 50)}...
                          </code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No submissions yet</p>
            )}
            
            {submissions && submissions.length > 5 && (
              <div className="mt-4">
                <Link
                  href="/submissions"
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  View all submissions →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}