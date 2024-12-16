import React, { useState } from 'react';
import { Bell, Users, DollarSign, Briefcase } from 'lucide-react';
import { Button } from '../common/Button';
import { useCaseStore } from '@/store/useCaseStore';
// import type { Case } from '@/types';

export const AttorneyDashboard: React.FC = () => {
  const { cases, submitQuote, isLoading } = useCaseStore();
  const [quoteModal, setQuoteModal] = useState<{ isOpen: boolean; caseId: string | null }>({
    isOpen: false,
    caseId: null
  });

  const pendingCases = cases.filter(c => c.status === 'PENDING');
  const activeCases = cases.filter(c => c.status === 'ACCEPTED');
  const totalRevenue = activeCases.reduce((sum, c) => sum + c.budget, 0);

  const stats = [
    { label: 'Active Cases', value: String(activeCases.length), Icon: Briefcase },
    { label: 'Total Clients', value: String(new Set(cases.map(c => c.clientId)).size), Icon: Users },
    { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, Icon: DollarSign },
    { label: 'New Inquiries', value: String(pendingCases.length), Icon: Bell }
  ];

  const handleQuoteSubmit = async (caseId: string, quote: number) => {
    await submitQuote(caseId, quote);
    setQuoteModal({ isOpen: false, caseId: null });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Attorney Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(({ label, value, Icon }) => (
          <div key={label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Case Inquiries</h2>
        </div>
        {pendingCases.length === 0 ? (
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No new inquiries</h3>
            <p className="text-gray-600">New case inquiries will appear here</p>
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
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
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
                {pendingCases.map((case_) => (
                  <tr key={case_.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {case_.caseType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Client #{case_.clientId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${case_.budget.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(case_.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => setQuoteModal({ isOpen: true, caseId: case_.id })}
                          disabled={isLoading}
                        >
                          Submit Quote
                        </Button>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {quoteModal.isOpen && quoteModal.caseId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Submit Quote</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const quote = Number((form.elements.namedItem('quote') as HTMLInputElement).value);
                handleQuoteSubmit(quoteModal.caseId!, quote);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quote Amount (USD)
                </label>
                <input
                  type="number"
                  name="quote"
                  required
                  min="0"
                  step="100"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setQuoteModal({ isOpen: false, caseId: null })}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Submit Quote'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};