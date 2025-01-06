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
import toast from "react-hot-toast";

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
      console.log("Checking for session on app load...");
      const jwtToken = localStorage.getItem("jwtToken");
      if (jwtToken) {
        console.log("JWT token found:", jwtToken);
        setIsAuthenticated(true);
      } else {
        console.log("No JWT token found. User is not authenticated.");
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
      await nhost.auth.signOut();
      localStorage.removeItem("jwtToken");
      setIsAuthenticated(false);
      toast.success("You have been logged out.");
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
