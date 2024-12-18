"use client";
import React, { ReactElement, ReactNode, useState } from "react";
import { MapPin, Calendar, DollarSign, Globe } from "lucide-react";
import { useLawyerStore } from "@/store/useLawyerStore";
import { useAuthStore } from "@/store/useAuthStore";
import { SubscriptionModal } from "@/components/subscription/SubscriptionModal";
import { Availability, Lawyer, OfficeLocation, TimeSlot } from "@/types";
import MapboxAddressSearch from "@/components/lawyer/MapboxAddressSearch";
import { LawyerMap } from "@/components/map/LawyerMap";
import { LawyerCalendar } from "@/components/calendar/LawyerCalendar";

const LawyerDashboard: React.FC = () => {
  const { isSubscribed, user } = useAuthStore();
  const [open, setOpen] = useState<boolean>(isSubscribed);
  const { lawyer, updateFirestoreField, updateField } = useLawyerStore();

  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const [priceInput, setPriceInput] = useState<number | string>(
    lawyer?.startingPrice || 0
  );
  const [servicesInput, setServicesInput] = useState<string | null>(null);
  const [locationInput, setLocationInput] = useState<{
    address: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const handlePriceUpdate = async () => {
    if (user?.id) {
      await updateFirestoreField("startingPrice", Number(priceInput), user.id);
      await updateField("startingPrice", Number(priceInput))
      setShowPriceModal(false);
    }
  };

  const handleServicesUpdate = async () => {
    if (user?.id && servicesInput) {
      await updateFirestoreField("languages", lawyer?.languages ? [...lawyer?.languages, servicesInput] : [servicesInput], user.id);
      await updateField("languages", lawyer?.languages ? [...lawyer?.languages, servicesInput] : [servicesInput])
      setShowServicesModal(false);
    }
  };

  const handleLocationAdd = async () => {
    if (locationInput && user?.id) {
      const newLocation = {
        id: Date.now().toString(),
        ...locationInput,
      };
      const updatedLocations = [
        ...(lawyer?.officeLocations || []),
        newLocation,
      ];
      await updateFirestoreField("officeLocations", updatedLocations, user.id);
      await updateField("officeLocations", updatedLocations)
      setShowLocationModal(false);
    }
  };

  const Modal: React.FC<{ children: ReactNode; onClose: () => void }> = ({
    children,
    onClose,
  }) => (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {children}
        <button
          onClick={onClose}
          className="mt-4 p-2 bg-red-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );

  const onLocationSelect = async (location: OfficeLocation) => {

  };

  const dummyAvailability: Availability[] = [
    {
      id: "1",
      date: "2024-12-18",
      timeSlots: [
        { id: "1a", startTime: "09:00", endTime: "10:00", isBooked: false },
        { id: "1b", startTime: "10:00", endTime: "11:00", isBooked: true },
        { id: "1c", startTime: "11:00", endTime: "12:00", isBooked: false },
      ],
    },
    {
      id: "2",
      date: "2024-12-19",
      timeSlots: [
        { id: "2a", startTime: "13:00", endTime: "14:00", isBooked: false },
        { id: "2b", startTime: "14:00", endTime: "15:00", isBooked: false },
        { id: "2c", startTime: "15:00", endTime: "16:00", isBooked: true },
      ],
    },
    {
      id: "3",
      date: "2024-12-20",
      timeSlots: [
        { id: "3a", startTime: "10:00", endTime: "11:00", isBooked: false },
        { id: "3b", startTime: "11:00", endTime: "12:00", isBooked: true },
      ],
    },
  ];
  
  
  const onSlotSelect = (slot: TimeSlot, date: string) => {
    const availability = dummyAvailability.find((a) => a.date === date);
  
    if (availability) {
      const timeSlot = availability.timeSlots.find((s) => s.id === slot.id);
  
      if (timeSlot) {
        if (!timeSlot.isBooked) {
          // Mark the slot as booked (example update logic)
          timeSlot.isBooked = true;
          console.log(`Slot selected: ${timeSlot.startTime} - ${timeSlot.endTime} on ${date}`);
        } else {
          console.log(`Slot already booked: ${timeSlot.startTime} - ${timeSlot.endTime} on ${date}`);
        }
      } else {
        console.error(`Time slot not found for ID: ${slot.id}`);
      }
    } else {
      console.error(`Availability not found for date: ${date}`);
    }
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
            value={lawyer?.languages?.join(", ") || "Not set"}
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
            onClick={() => setShowCalendarModal(true)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Office Locations</h2>
            <div className="h-[400px] rounded-lg overflow-hidden">
              {lawyer && lawyer.officeLocations && (
                <LawyerMap
                  locations={lawyer?.officeLocations}
                  onLocationSelect={onLocationSelect}
                />
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              Recent Client Requests
            </h2>
            {/* Client requests list would go here */}
          </div>
        </div>
      </div>

      {isSubscribed && (
        <SubscriptionModal isOpen={open} onClose={() => setOpen(!open)} />
      )}

{showCalendarModal && <LawyerCalendar availability={dummyAvailability} onSlotSelect={onSlotSelect} onClose={() => setShowCalendarModal(false)}/>}
      {/* Price Modal */}
      {showPriceModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
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
            <button
              onClick={() => setShowPriceModal(false)}
              className="mt-4 p-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Services Modal */}
      {showServicesModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold">Update Languages</h2>
            <input
              type="text"
              value={servicesInput || "English"}
              onChange={(e) => setServicesInput(e.target.value)}
              className="mt-2 p-2 border rounded"
              placeholder="Enter languages"
            />
            <button
              onClick={handleServicesUpdate}
              className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => setShowServicesModal(false)}
              className="mt-4 p-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <Modal onClose={() => setShowLocationModal(false)}>
          <h2 className="text-xl font-semibold">Add Office Location</h2>
          <MapboxAddressSearch setLocationInput={setLocationInput} />
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

const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  title,
  value,
  onClick,
}) => (
  <div
    className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
    onClick={onClick}
  >
    <div className="flex items-center mb-2">
      <div className="p-2 bg-blue-100 rounded-lg mr-3">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);
