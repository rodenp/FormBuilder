import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export const FormSubmissions = ({ formId }: { formId: string }) => {
  const submissions = useQuery(api.formSubmissions.getSubmissions, { formId });

  if (!submissions) return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          <div className="h-32 bg-gray-100 rounded"></div>
          <div className="h-32 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Form Submissions ({submissions.length})</h2>
      
      {submissions.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500">No submissions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div 
              key={submission._id} 
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Submitted: {new Date(submission.submittedAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    ID: {submission._id}
                  </p>
                </div>
                <span className={`
                  px-2 py-1 text-xs rounded-full
                  ${submission.processed 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                  }
                `}>
                  {submission.processed ? 'Processed' : 'Pending'}
                </span>
              </div>
              
              <div className="bg-gray-50 rounded p-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(submission.data).map(([key, value]) => (
                      <tr key={key} className="border-b border-gray-200 last:border-b-0">
                        <td className="py-2 pr-4 font-medium text-gray-600 align-top">
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
  );
};