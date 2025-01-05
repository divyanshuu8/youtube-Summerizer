import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import nhost from "./nhost";

type SignInFormProps = {
  onClose: () => void;
};

export function SignInForm({ onClose, handleSignIn }: SignInFormProps) {
  const { setIsAuthenticated, openSignUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Check if the user is already signed in
    const currentUser = nhost.auth.getUser();
    if (currentUser) {
      alert(`You are already signed in as ${currentUser.email}.`);
      return;
    }
    try {
      // Sign in the user
      const { error, session, user } = await nhost.auth.signIn({
        email,
        password,
      });

      if (error) {
        console.error("Login failed:", error.message);
        alert(`Login failed: ${error.message}`);
        return;
      }

      // Store JWT token in localStorage for session persistence
      const jwtToken = session?.accessToken;
      if (jwtToken) {
        localStorage.setItem("jwtToken", jwtToken);
      }

      // Update authentication state and close modal
      setIsAuthenticated(true);
      alert(`Welcome back, ${user?.email}!`);
      onClose();
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
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
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition"
      >
        Sign In
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
