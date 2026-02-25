import { useState } from "react";
import AuthStyle from "../components/AuthStyle";
import { ChevronLeft, EyeOff } from "lucide-react"; // Optional: lucide-react for icons
import { useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative flex ">
      <div className="w-1/2 h-screen">
        <div className="full h-screen flex flex-col items-center justify-center px-20">
          <div className="w-full max-w-md">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-[#F1F1F1] rounded-xl mb-8 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <ChevronLeft size={24} className="text-[#262626]" />
            </button>

            {/* Header */}
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sign in</h1>
            <p className="text-gray-400 mb-10">
              Please login to continue to your account.
            </p>

            <form className="space-y-6">
              {/* Email Field */}
              <div className="relative group">
                <label className="absolute -top-3 left-4 bg-white px-1 text-sm font-medium text-gray-400 z-10 transition-colors group-focus-within:text-blue-500">
                  Email
                </label>

                <input
                  type="text"
                  placeholder="Email or phone number"
                  className="w-full px-4 py-4 border border-[#9A9A9A] rounded-xl 
                 focus:outline-none focus:border-blue-500 
                 text-gray-700 placeholder-[#9A9A9A]"
                />
              </div>

              {/* Password Field */}
              <div className="relative group">
                <label className="absolute -top-3 left-4 bg-white px-1 text-sm font-medium text-gray-400 z-10 transition-colors group-focus-within:text-blue-500">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full px-4 py-4 border border-[#9A9A9A] rounded-xl 
                 focus:outline-none focus:border-blue-500 
                 text-gray-700 placeholder-[#9A9A9A]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <EyeOff size={22} className="cursor-pointer" />
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer text-gray-600">
                  <input
                    type="checkbox"
                    className="w-4 h-4 r border-gray-300 text-secondary focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-gray-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Sign In Button */}
              <button className="w-full bg-secondary text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-200 cursor-pointer">
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
      <AuthStyle />
    </div>
  );
}

export default SignIn;
