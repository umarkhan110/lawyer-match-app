import React from 'react';
import { Scale, Menu, LogOut } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuthStore } from '@/store/useAuthStore';

interface HeaderProps {
  onAuthClick?: (type: 'signin' | 'signup') => void;
  onNavClick?: (sectionId: string) => void;
  onAttorneyClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAuthClick, onNavClick, onAttorneyClick }) => {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavClick?.('top')}>
            <Scale className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">LawyerMatch</span>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => onNavClick?.('how-it-works')}
              className="text-gray-700 hover:text-blue-600"
            >
              How It Works
            </button>
            <button 
              onClick={onAttorneyClick}
              className="text-gray-700 hover:text-blue-600"
            >
              For Attorneys
            </button>
            <button 
              onClick={() => onNavClick?.('case-types')}
              className="text-gray-700 hover:text-blue-600"
            >
              Case Types
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, 
                  {/* {user?.fullName} */}
                  </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAuthClick?.('signin')}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => onAuthClick?.('signup')}
                >
                  Get Started
                </Button>
              </>
            )}
            <button className="md:hidden">
              <Menu className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};