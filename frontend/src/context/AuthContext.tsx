import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { AuthModal } from "../components/auth/AuthModal";
import { SignInForm } from "../components/auth/SignInForm";
import { SignUpForm } from "../components/auth/SignUpForm";
import nhost from "../components/auth/nhost"; // Update path based on your project structure

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  openSignIn: () => void;
  openSignUp: () => void;
  handleSignOut: () => void; // Add a method for handling sign-out
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  // Check for JWT token in localStorage when the component mounts
  useEffect(() => {
    const checkSession = async () => {
      const jwtToken = localStorage.getItem("jwtToken");
      const user = await nhost.auth.getUser(); // Get the user from the current session
      if (user) {
        setIsAuthenticated(true); // User is authenticated
      }
      if (jwtToken) {
        try {
        } catch (err) {
          console.error("Error verifying session:", err);
          setIsAuthenticated(false);
          localStorage.removeItem("jwtToken"); // Clear invalid token
        }
      }
    };
    checkSession();
  }, []);

  const openSignIn = () => {
    setIsSignUpOpen(false);
    setIsSignInOpen(true);
  };

  const openSignUp = () => {
    setIsSignInOpen(false);
    setIsSignUpOpen(true);
  };

  const handleSignOut = async () => {
    try {
      await nhost.auth.signOut(); // Sign out from nhost
      localStorage.removeItem("jwtToken"); // Remove JWT from localStorage
      setIsAuthenticated(false); // Update the authentication state
      alert("You have been logged out");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        openSignIn,
        openSignUp,
        handleSignOut,
      }}
    >
      {children}
      {isSignInOpen && (
        <AuthModal
          isOpen={true}
          onClose={() => setIsSignInOpen(false)}
          title="Sign In"
        >
          <SignInForm onClose={() => setIsSignInOpen(false)} />
        </AuthModal>
      )}
      {isSignUpOpen && (
        <AuthModal
          isOpen={true}
          onClose={() => setIsSignUpOpen(false)}
          title="Sign Up"
        >
          <SignUpForm onClose={() => setIsSignUpOpen(false)} />
        </AuthModal>
      )}
    </AuthContext.Provider>
  );
}
