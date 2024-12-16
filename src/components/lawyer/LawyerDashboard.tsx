import React, { useState } from 'react';
import { MapPin, Calendar, DollarSign, Globe } from 'lucide-react';
import { useLawyerStore } from '@/store/useLawyerStore';
// import Map from 'mapbox-gl';

export const LawyerDashboard: React.FC = () => {
  const { lawyer } = useLawyerStore();
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
console.log(showPriceModal, showServicesModal, showLocationModal)
  // const handlePriceUpdate = (price: number) => {
  //   updateStartingPrice(price);
  //   setShowPriceModal(false);
  // };

  // const handleServicesUpdate = (services: string[]) => {
  //   updateAdditionalServices(services);
  //   setShowServicesModal(false);
  // };

  // const handleLocationAdd = (location: { address: string; latitude: number; longitude: number }) => {
  //   addOfficeLocation({
  //     id: Date.now().toString(),
  //     ...location
  //   });
  //   setShowLocationModal(false);
  // };

  return (
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
          onClick={() => {/* Handle calendar view */}}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Office Locations</h2>
          <div className="h-[400px] rounded-lg overflow-hidden">
            {/* Mapbox implementation would go here */}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Client Requests</h2>
          {/* Client requests list would go here */}
        </div>
      </div>

      {/* Modals would be implemented here */}
    </div>
  );
};

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