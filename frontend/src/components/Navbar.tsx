import { Youtube, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { AuthModal } from './auth/AuthModal';
import { SignInForm } from './auth/SignInForm';
import { SignUpForm } from './auth/SignUpForm';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { isAuthenticated, openSignIn, openSignUp } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Youtube className="h-6 w-6 text-purple-600" />
              <span className="font-bold text-xl text-gray-800">YT Summarizer</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              <a href="#" className="text-gray-600 hover:text-purple-600 transition">About</a>
              <a href="#" className="text-gray-600 hover:text-purple-600 transition">Contact</a>
              <div className="h-6 w-px bg-gray-200 mx-2" />
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={openSignIn}
                    className="text-gray-600 hover:text-purple-600 transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={openSignUp}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {}} // TODO: Implement sign out
                  className="text-gray-600 hover:text-purple-600 transition"
                >
                  Sign Out
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-purple-600 hover:bg-gray-50 transition"
              >
                About
              </a>
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-purple-600 hover:bg-gray-50 transition"
              >
                Contact
              </a>
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={openSignIn}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-purple-600 hover:bg-gray-50 transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={openSignUp}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {}} // TODO: Implement sign out
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-purple-600 hover:bg-gray-50 transition"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}