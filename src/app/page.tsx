"use client"
// import React, { useState } from 'react';
// import { AuthModal } from '@/components/auth/AuthModal';

// function Home() {
//   const [authModal, setAuthModal] = useState<{
//     isOpen: boolean;
//     isAttorney?: boolean;
//   } | null>(null);

//   const handleClick = async (userType: string) => {
//     setAuthModal({ isOpen: true, isAttorney: userType === "lawyer" ? true : false });
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
//           <h1 className="text-2xl font-bold mb-6 text-center">Welcome</h1>
//           <div className="space-y-4">
//             <button
//               onClick={() => handleClick("lawyer")}
//               className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               I'm a Lawyer
//             </button>
//             <button
//               onClick={() => handleClick("client")}
//               className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
//             >
//               I'm a Client
//             </button>
//           </div>
//         </div>
//       </div>
//       {authModal && (
//         <AuthModal
//           isOpen={authModal.isOpen}
//           isAttorney={authModal.isAttorney}
//           onClose={() => setAuthModal(null)}
//         />
//       )}
//     </>
//   );
// }

// export default Home;


import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/home/Hero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Features } from '@/components/features/Features';
import { CaseTypeSelector } from '@/components/case/CaseTypeSelector';
import { AuthModal } from '@/components/auth/AuthModal';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/useAuthStore';
import type { CaseType } from '@/types';

function Home() {
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    isAttorney?: boolean;
  } | null>(null);
  const [selectedCaseType, setSelectedCaseType] = useState<CaseType | null>(null);
  const { isAuthenticated } = useAuthStore();

  const handleCaseTypeSelect = (caseType: CaseType) => {
    setSelectedCaseType(caseType);
    if (!isAuthenticated) {
      setAuthModal({ isOpen: true, isAttorney: false });
    }
  };

  const handleAuthClick = () => {
    setAuthModal({ isOpen: true });
  };

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      setAuthModal({ isOpen: true, isAttorney: false });
    }
  };

  const handleAttorneyClick = () => {
    if (!isAuthenticated) {
      setAuthModal({ isOpen: true, isAttorney: true });
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // if (isAuthenticated) {
  //   return <DashboardLayout />;
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onAuthClick={handleAuthClick}
        onNavClick={scrollToSection}
        onAttorneyClick={handleAttorneyClick}
      />
      <Hero
        onGetStarted={handleGetStarted}
        onAttorneyClick={handleAttorneyClick}
      />
      <HowItWorks />
      <Features />
      
      <section id="case-types" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Select Your Case Type</h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose the type of legal assistance you need
            </p>
          </div>
          <CaseTypeSelector onSelect={handleCaseTypeSelect} />
        </div>
      </section>

      {authModal && (
        <AuthModal
          isOpen={authModal.isOpen}
          isAttorney={authModal.isAttorney}
          onClose={() => setAuthModal(null)}
        />
      )}
    </div>
  );
}

export default Home;