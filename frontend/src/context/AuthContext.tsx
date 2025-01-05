import { createContext, useContext, ReactNode, useState } from 'react';
import { AuthModal } from '../components/auth/AuthModal';
import { SignInForm } from '../components/auth/SignInForm';
import { SignUpForm } from '../components/auth/SignUpForm';

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  openSignIn: () => void;
  openSignUp: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const openSignIn = () => {
    setIsSignUpOpen(false);
    setIsSignInOpen(true);
  };

  const openSignUp = () => {
    setIsSignInOpen(false);
    setIsSignUpOpen(true);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, openSignIn, openSignUp }}>
      {children}
      {isSignInOpen && (
        <AuthModal isOpen={true} onClose={() => setIsSignInOpen(false)} title="Sign In">
          <SignInForm onClose={() => setIsSignInOpen(false)} />
        </AuthModal>
      )}
      {isSignUpOpen && (
        <AuthModal isOpen={true} onClose={() => setIsSignUpOpen(false)} title="Sign Up">
          <SignUpForm onClose={() => setIsSignUpOpen(false)} />
        </AuthModal>
      )}
    </AuthContext.Provider>
  );
}