import React, { useState } from 'react';
import { Flag, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../providers/AuthProvider';

interface ReportButtonProps {
  entityType: 'content' | 'user' | 'community' | 'event' | 'cafe';
  entityId: string;
  className?: string;
}

const ReportButton: React.FC<ReportButtonProps> = ({
  entityType,
  entityId,
  className = ''
}) => {
  const { isAuthenticated } = useAuth();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  const reportReasons = {
    content: [
      'Inappropriate content',
      'Spam',
      'Harassment',
      'Misinformation',
      'Other'
    ],
    user: [
      'Inappropriate behavior',
      'Harassment',
      'Spam',
      'Fake account',
      'Other'
    ],
    community: [
      'Inappropriate content',
      'Spam',
      'Misleading information',
      'Violation of terms',
      'Other'
    ],
    event: [
      'Inappropriate content',
      'Scam',
      'Misleading information',
      'Safety concerns',
      'Other'
    ],
    cafe: [
      'Inappropriate content',
      'Misleading information',
      'Safety concerns',
      'False information',
      'Other'
    ]
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please log in to report');
      return;
    }

    if (!reason) {
      toast.error('Please select a reason');
      return;
    }

    try {
      // Here you would normally send the report to your backend
      console.log('Reporting:', {
        entityType,
        entityId,
        reason,
        details
      });

      toast.success('Report submitted successfully');
      setShowReportModal(false);
      setReason('');
      setDetails('');
    } catch (error) {
      toast.error('Failed to submit report');
    }
  };

  return (
    <>
      <button
        onClick={() => {
          if (!isAuthenticated) {
            toast.error('Please log in to report');
            return;
          }
          setShowReportModal(true);
        }}
        className={`flex items-center text-gray-400 hover:text-red-500 ${className}`}
        title="Report"
      >
        <Flag className="w-4 h-4" />
      </button>

      {showReportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowReportModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleReport} className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Report</h3>
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for reporting
                    </label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      required
                    >
                      <option value="">Select a reason</option>
                      {reportReasons[entityType].map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional details
                    </label>
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Please provide any additional details about your report..."
                    />
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportButton;