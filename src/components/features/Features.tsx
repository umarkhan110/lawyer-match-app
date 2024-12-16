import React from 'react';
import { Shield, Users, DollarSign, Clock } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

export const Features: React.FC = () => {
  const features = [
    {
      title: 'Verified Attorneys',
      description: 'All attorneys are verified and licensed professionals with proven track records.',
      Icon: Shield
    },
    {
      title: 'Perfect Match',
      description: 'Our matching system connects you with attorneys specialized in your case type.',
      Icon: Users
    },
    {
      title: 'Transparent Pricing',
      description: 'Get upfront quotes and clear payment plans without hidden fees.',
      Icon: DollarSign
    },
    {
      title: 'Quick Response',
      description: 'Receive responses from qualified attorneys within 24 hours.',
      Icon: Clock
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose LawyerMatch</h2>
          <p className="mt-4 text-lg text-gray-600">We make finding the right legal representation simple and efficient</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};