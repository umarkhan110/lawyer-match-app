// import React, { useState } from 'react';
// import { X } from 'lucide-react';
// import { Button } from '../common/Button';
// import { useCaseStore } from '@/store/useCaseStore';
// import type { CaseType } from '@/types';

// interface NewCaseModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   caseType: CaseType;
// }

// export const NewCaseModal: React.FC<NewCaseModalProps> = ({
//   isOpen,
//   onClose,
//   caseType
// }) => {
//   const { submitCase, isLoading, error } = useCaseStore();
//   const [formData, setFormData] = useState({
//     budget: '',
//     details: {} as Record<string, string>
//   });

//   if (!isOpen) return null;

//   const getFieldsForCaseType = (type: CaseType) => {
//     switch (type) {
//       case 'IMMIGRATION':
//         return [
//           { name: 'entryDate', label: 'Date of Entry', type: 'date' },
//           { name: 'alienNumber', label: 'Alien Number', type: 'text' },
//           { name: 'hasCourtDate', label: 'Do you have a court date?', type: 'select', options: ['Yes', 'No'] },
//           { name: 'language', label: 'Preferred Language', type: 'select', options: ['English', 'Spanish', 'Russian', 'Armenian'] }
//         ];
//       case 'PERSONAL_INJURY':
//         return [
//           { name: 'accidentDate', label: 'Date of Accident', type: 'date' },
//           { name: 'injuryType', label: 'Type of Injury', type: 'text' },
//           { name: 'medicalTreatment', label: 'Have you received medical treatment?', type: 'select', options: ['Yes', 'No'] }
//         ];
//       // Add more case types as needed
//       default:
//         return [];
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await submitCase({
//         caseType,
//         budget: Number(formData.budget),
//         details: formData.details
//       });
//       onClose();
//     } catch (err) {
//       // Error is handled by the store
//     }
//   };

//   const handleChange = (name: string, value: string) => {
//     if (name === 'budget') {
//       setFormData(prev => ({ ...prev, budget: value }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         details: { ...prev.details, [name]: value }
//       }));
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
//       <div className="bg-white rounded-lg p-8 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//         >
//           <X className="h-6 w-6" />
//         </button>

//         <h2 className="text-2xl font-bold mb-6">Submit New Case</h2>

//         {error && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {getFieldsForCaseType(caseType).map(field => (
//             <div key={field.name}>
//               <label className="block text-sm font-medium text-gray-700">
//                 {field.label}
//               </label>
//               {field.type === 'select' ? (
//                 <select
//                   name={field.name}
//                   onChange={(e) => handleChange(field.name, e.target.value)}
//                   required
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                 >
//                   <option value="">Select an option</option>
//                   {field.options?.map(option => (
//                     <option key={option} value={option}>{option}</option>
//                   ))}
//                 </select>
//               ) : (
//                 <input
//                   type={field.type}
//                   name={field.name}
//                   onChange={(e) => handleChange(field.name, e.target.value)}
//                   required
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                 />
//               )}
//             </div>
//           ))}

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Budget (USD)
//             </label>
//             <input
//               type="number"
//               name="budget"
//               value={formData.budget}
//               onChange={(e) => handleChange('budget', e.target.value)}
//               required
//               min="0"
//               step="100"
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//             />
//           </div>

//           <Button type="submit" className="w-full" disabled={isLoading}>
//             {isLoading ? 'Submitting...' : 'Submit Case'}
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// };