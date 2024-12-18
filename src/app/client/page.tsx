"use client";
import React, { useState, useEffect } from 'react';
import { ClientMap } from '@/components/client/ClientMap';
import { BudgetSlider } from '@/components/client/BudgetSlider';
import { useClientStore } from '@/store/useClientStore';
import { Lawyer } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';

const ClientDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { client, nearbyLawyers, matchWithLawyer, updateField, updateFirestoreField } = useClientStore();
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [budget, setBudget] = useState(client?.budget || 0);
  const [downPayment, setDownPayment] = useState(client?.downPayment || 0);

  const handleLawyerSelect = async (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer);
    if (lawyer.id) {
      await matchWithLawyer(lawyer.id);
    }
  };
  useEffect(() => {
    if(user?.id){
      updateField("budget", budget);
      updateFirestoreField("budget", budget, user.id);
    }
  }, [budget]);

  useEffect(() => {
    if(user?.id){
      updateField("downPayment", downPayment);
      updateFirestoreField("downPayment", downPayment, user.id);
    }
  }, [downPayment]);
// console.log(nearbyLawyers)
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Find a Lawyer</h1>
          <BudgetSlider
            totalBudget={budget}
            downPayment={downPayment}
            onTotalBudgetChange={setBudget}
            onDownPaymentChange={setDownPayment}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Available Lawyers Near You</h2>
            {client && client.location && (
              <ClientMap
                client={client}
                nearbyLawyers={nearbyLawyers.filter(
                  (lawyer: any) => lawyer.startingPrice <= budget
                )}
                onLawyerSelect={handleLawyerSelect}
              />
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Selected Lawyer</h2>
            {selectedLawyer ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedLawyer.profileImage}
                    alt={selectedLawyer.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-xl">{selectedLawyer.fullName}</h3>
                    <p className="text-gray-600">Starting at ${selectedLawyer.startingPrice.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedLawyer.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Additional Services</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {selectedLawyer.additionalServices.map((service) => (
                      <li key={service}>{service}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Office Locations</h4>
                  <ul className="space-y-2">
                    {selectedLawyer.officeLocations.map((location) => (
                      <li key={location.id} className="text-gray-600">
                        {location.address}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleLawyerSelect(selectedLawyer)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Connect with Lawyer
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Select a lawyer from the map to view their details</p>
                <p className="text-sm text-gray-400 mt-2">Click on any marker to see lawyer information</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ClientDashboard;