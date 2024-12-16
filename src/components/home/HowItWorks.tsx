import React from 'react';
import { ClipboardList, Search, MessageSquare, Handshake } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: 'Submit Your Case',
      description: 'Fill out our simple form with your case details and requirements.',
      Icon: ClipboardList
    },
    {
      title: 'Get Matched',
      description: 'Our system matches you with qualified attorneys specializing in your case type.',
      Icon: Search
    },
    {
      title: 'Receive Quotes',
      description: 'Compare detailed quotes from multiple attorneys within 24 hours.',
      Icon: MessageSquare
    },
    {
      title: 'Choose & Connect',
      description: 'Select your preferred attorney and begin your legal journey.',
      Icon: Handshake
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600">
            Find your perfect legal match in four simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/4 right-0 w-full h-0.5 bg-blue-200" />
              )}
              <div className="relative bg-white p-6 rounded-xl text-center z-10">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <step.Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};