"use client"
import React, { useState } from 'react';
import { AuthModal } from '@/components/auth/AuthModal';

function Home() {
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    isAttorney?: boolean;
  } | null>(null);

  const handleClick = async (userType: string) => {
    setAuthModal({ isOpen: true, isAttorney: userType === "lawyer" ? true : false });
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Welcome</h1>
          <div className="space-y-4">
            <button
              onClick={() => handleClick("lawyer")}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              I'm a Lawyer
            </button>
            <button
              onClick={() => handleClick("client")}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              I'm a Client
            </button>
          </div>
        </div>
      </div>
      {authModal && (
        <AuthModal
          isOpen={authModal.isOpen}
          isAttorney={authModal.isAttorney}
          onClose={() => setAuthModal(null)}
        />
      )}
    </>
  );
}

export default Home;