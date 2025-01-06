import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Send } from "lucide-react";
import nhost from "./nhost";
import toast from "react-hot-toast";

type SignInFormProps = {
  onClose: () => void;
};

export function SignInForm({ onClose }: SignInFormProps) {
  const { setIsAuthenticated, openSignUp } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if user is already signed in
      const currentUser = nhost.auth.getUser();
      if (currentUser) {
        toast.success(`You are already signed in as ${currentUser.email}.`);
        setLoading(false);
        return;
      }

      // Attempt to sign in
      console.log("Attempting to sign in user...");
      const { error, session, user } = await nhost.auth.signIn({
        email,
        password,
      });

      // Handle error during sign-in
      if (error) {
        toast.error(`Login failed: ${error.message}`);
        setLoading(false);
        return;
      }

      // Store JWT token in localStorage for session persistence
      const jwtToken = session?.accessToken;
      if (jwtToken) {
        localStorage.setItem("jwtToken", jwtToken);
      }

      // Update authentication state and close modal
      setIsAuthenticated(true);
      toast.success(`Login success.`);
      onClose();
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // Ensure loading state is always reset
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          required
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
        ) : (
          <>
            <Send size={18} />
            <span>Sign In</span>
          </>
        )}
      </button>
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={openSignUp}
          className="text-purple-600 hover:text-purple-700 font-medium"
        >
          Sign Up
        </button>
      </p>
    </form>
  );
}
