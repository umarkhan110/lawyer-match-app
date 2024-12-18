import React from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { Availability, TimeSlot } from '@/types';

interface LawyerCalendarProps {
  availability: Availability[];
  onSlotSelect: (slot: TimeSlot, date: string) => void;
  onClose: () => void;
}

export const LawyerCalendar: React.FC<LawyerCalendarProps> = ({
  availability,
  onSlotSelect,
  onClose
}) => {
  const startDate = startOfWeek(new Date());
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow p-6 w-1/2">
        <button
          onClick={onClose}
          className="px-2 bg-red-500 text-white rounded-full float-right"
        >
          x
        </button>
        <div className="grid grid-cols-7 gap-4 mb-4">
          {weekDays.map((day) => (
            <div key={day.toString()} className="text-center">
              <div className="text-sm font-medium text-gray-500">
                {format(day, 'EEE')}
              </div>
              <div className="text-lg font-semibold">
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day) => {
            const dayAvailability = availability.find((a) =>
              isSameDay(new Date(a.date), day)
            );

            return (
              <div key={day.toString()} className="min-h-[200px] border rounded-lg p-2">
                {dayAvailability?.timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => onSlotSelect(slot, dayAvailability.date)}
                    disabled={slot.isBooked}
                    className={`w-full text-sm p-1 mb-1 rounded ${slot.isBooked
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                  >
                    {format(new Date(`2000-01-01T${slot.startTime}`), 'h:mm a')}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>

    </div>

  );
};