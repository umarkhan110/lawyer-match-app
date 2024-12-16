import React from 'react';
// import { Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
// import { Button } from '../common/Button';
// import { NewCaseModal } from '../case/NewCaseModal';
// import { useCaseStore } from '@/store/useCaseStore';
// import type { Case, CaseType } from '@/types';

export const ClientDashboard: React.FC = () => {
  // const { cases } = useCaseStore();
  // const [newCaseModal, setNewCaseModal] = useState<{ isOpen: boolean; type: CaseType | null }>({
  //   isOpen: false,
  //   type: null
  // });

  // const handleNewCase = (type: CaseType) => {
  //   setNewCaseModal({ isOpen: true, type });
  // };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Cases</h1>
        {/* <div className="flex space-x-2">
          <Button
            onClick={() => handleNewCase('PERSONAL_INJURY')}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Personal Injury
          </Button>
          <Button
            onClick={() => handleNewCase('IMMIGRATION')}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Immigration
          </Button>
        </div> */}
      </div>

      {/* <div className="bg-white rounded-lg shadow">
        {cases.length === 0 ? (
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cases yet</h3>
            <p className="text-gray-600 mb-4">Start by submitting your first case</p>
            <Button onClick={() => handleNewCase('PERSONAL_INJURY')}>
              Submit a Case
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Case Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cases.map((case_) => (
                  <tr key={case_.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {case_.caseType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={case_.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(case_.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div> */}

      {/* {newCaseModal.isOpen && newCaseModal.type && (
        <NewCaseModal
          isOpen={newCaseModal.isOpen}
          caseType={newCaseModal.type}
          onClose={() => setNewCaseModal({ isOpen: false, type: null })}
        />
      )} */}
    </div>
  );
};

// const StatusBadge: React.FC<{ status: Case['status'] }> = ({ status }) => {
//   const styles = {
//     PENDING: 'bg-yellow-100 text-yellow-800',
//     QUOTED: 'bg-blue-100 text-blue-800',
//     ACCEPTED: 'bg-green-100 text-green-800',
//     REJECTED: 'bg-red-100 text-red-800'
//   };

//   const icons = {
//     PENDING: Clock,
//     QUOTED: Clock,
//     ACCEPTED: CheckCircle,
//     REJECTED: XCircle
//   };

//   const Icon = icons[status];

//   return (
//     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
//       <Icon className="w-4 w-4 mr-1" />
//       {status.charAt(0) + status.slice(1).toLowerCase()}
//     </span>
//   );
// };