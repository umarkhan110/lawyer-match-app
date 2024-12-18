import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuthStore } from '@/store/useAuthStore';
import ClientSignup from './ClientSignup';
import AttorneySignup from './AttorneySignup';
import { useRouter } from 'next/navigation';
import { auth } from "@/firebase/config";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ShowNotification } from '../Toaster';
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAttorney?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  isAttorney = false
}) => {
  const router = useRouter();
  const { login, signup, isLoading, error } = useAuthStore();
  const [type, setType] = useState('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    barLicenseNumber: '',
    lawFirm: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (type === 'signin') {
        const res = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        // console.log(res)
        if (res) {
          await login(res, isAttorney);
          ShowNotification("Login successfully!", "success");
          router.push(isAttorney ? "/lawyer" : "/client")
        }
        // onClose();
      } 
      // onClose();
    } catch (err) {
      // Error is handled by the store
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-scroll">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {type === 'signin' ? 'Sign In' : 'Create Account'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {type === 'signin' ?
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Please wait...' : 'Sign In'}
            </Button>
            <div onClick={() => setType('signup')} className='cursor-pointer'>Create a new account.</div>
          </form> :
          isAttorney ? <AttorneySignup onSubmit={onClose} setType={setType} /> : <ClientSignup onClose={onClose} setType={setType} />}
      </div>
    </div>
  );
};