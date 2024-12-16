"use client"
import React, { useState } from 'react';
import { MapPin, Calendar, DollarSign, Globe } from 'lucide-react';
import { useLawyerStore } from '@/store/useLawyerStore';
import { useAuthStore } from '@/store/useAuthStore';
import { SubscriptionModal } from '@/components/subscription/SubscriptionModal';
import { ClientMap } from '@/components/client/ClientMap';
import { useClientStore } from '@/store/useClientStore';
import { Lawyer } from '@/types';

const LawyerDashboard: React.FC = () => {
  const { isSubscribed } = useAuthStore();
  const [open, setOpen] = useState<boolean>(isSubscribed);
  const { lawyer, updateStartingPrice, updateAdditionalServices, addOfficeLocation } = useLawyerStore();
  const { client, nearbyLawyers } = useClientStore();

  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  
  // States to handle user inputs
  const [priceInput, setPriceInput] = useState<number | string>(lawyer?.startingPrice || 0);
  const [servicesInput, setServicesInput] = useState<string[]>(lawyer?.languages || []);
  const [locationInput, setLocationInput] = useState<{ address: string; latitude: number; longitude: number } | null>(null);

  const handlePriceUpdate = () => {
    updateStartingPrice(Number(priceInput));
    setShowPriceModal(false);
  };

  const handleServicesUpdate = () => {
    updateAdditionalServices(servicesInput);
    setShowServicesModal(false);
  };

  const handleLocationAdd = () => {
    if (locationInput) {
      addOfficeLocation({
        id: Date.now().toString(),
        ...locationInput
      });
      setShowLocationModal(false);
    }
  };

  const Modal: React.FC<{ children:any, onClose: () => void }> = ({ children, onClose }) => (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {children}
        <button onClick={onClose} className="mt-4 p-2 bg-red-500 text-white rounded">
          Close
        </button>
      </div>
    </div>
  );

    const handleLawyerSelect = async (lawyer: Lawyer) => {
      // setSelectedLawyer(lawyer);
      // if (lawyer.id) {
      //   await matchWithLawyer(lawyer.id);
      // }
    };
  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Lawyer Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            icon={<DollarSign className="h-6 w-6" />}
            title="Starting Price"
            value={`$${lawyer?.startingPrice || 0}`}
            onClick={() => setShowPriceModal(true)}
          />
          <DashboardCard
            icon={<Globe className="h-6 w-6" />}
            title="Languages"
            value={lawyer?.languages?.join(', ') || 'Not set'}
            onClick={() => setShowServicesModal(true)}
          />
          <DashboardCard
            icon={<MapPin className="h-6 w-6" />}
            title="Office Locations"
            value={`${lawyer?.officeLocations?.length || 0} locations`}
            onClick={() => setShowLocationModal(true)}
          />
          <DashboardCard
            icon={<Calendar className="h-6 w-6" />}
            title="Available Slots"
            value="View Calendar"
            onClick={() => {/* Handle calendar view */ }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Office Locations</h2>
            <div className="h-[400px] rounded-lg overflow-hidden">
              {/* Mapbox implementation would go here */}
                {client && (
                            <ClientMap
                              client={client}
                              nearbyLawyers={nearbyLawyers.filter(
                                (lawyer: any) => lawyer.startingPrice <= 100000
                              )}
                              onLawyerSelect={handleLawyerSelect}
                            />
                          )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Client Requests</h2>
            {/* Client requests list would go here */}
          </div>
        </div>

      </div>
      {!isSubscribed &&
      <SubscriptionModal isOpen={open} onClose={() => setOpen(!open)} />
       }

      {/* Price Modal */}
      {showPriceModal && (
        <Modal onClose={() => setShowPriceModal(false)}>
          <h2 className="text-xl font-semibold">Update Starting Price</h2>
          <input
            type="number"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            className="mt-2 p-2 border rounded"
            placeholder="Enter new price"
          />
          <button
            onClick={handlePriceUpdate}
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </Modal>
      )}

      {/* Services Modal */}
      {showServicesModal && (
        <Modal onClose={() => setShowServicesModal(false)}>
          <h2 className="text-xl font-semibold">Update Languages</h2>
          <input
            type="text"
            value={servicesInput.join(', ')}
            onChange={(e) => setServicesInput(e.target.value.split(', '))}
            className="mt-2 p-2 border rounded"
            placeholder="Enter languages"
          />
          <button
            onClick={handleServicesUpdate}
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </Modal>
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <Modal onClose={() => setShowLocationModal(false)}>
          <h2 className="text-xl font-semibold">Add Office Location</h2>
          <input
            type="text"
            value={locationInput?.address || ''}
            onChange={(e) => setLocationInput(prev => ({ ...prev!, address: e.target.value }))}
            className="mt-2 p-2 border rounded"
            placeholder="Enter address"
          />
          <button
            onClick={handleLocationAdd}
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Add Location
          </button>
        </Modal>
      )}
    </>
  );
};

export default LawyerDashboard;

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  onClick: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, value, onClick }) => (
  <div
    className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
    onClick={onClick}
  >
    <div className="flex items-center mb-2">
      <div className="p-2 bg-blue-100 rounded-lg mr-3">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);
