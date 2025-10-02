import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, HelpCircle } from "lucide-react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { POST } from "../api/httpMethods";
import URLS from "../api/urls";

export default function Login() {
  const [activeTab, setActiveTab] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (activeTab === "email" && (!email || !password)) {
      return setError("Please enter email and password.");
    }
    if (activeTab === "phone" && (!phone || !password)) {
      return setError("Please enter phone number and password.");
    }

    try {
      setLoading(true);
      let res;
      if (activeTab === "email") {
        const payload = { email, password, login_type: "MANUAL", user_type: "USER" };
        res = await POST(URLS.LOGIN_EMAIL, payload);
      } else {
        const payload = { phone, password, login_type: "MANUAL", user_type: "USER" };
        res = await POST(URLS.LOGIN_PHONE, payload);
      }
      if (!res.data.error) {
        const userData = {
          ...res.data.records,
          token: res.data.token,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/");
      } else {
        setError(res.data.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-50 to-green-100 px-4">
      {/* ✅ Desktop View */}
      <div className="hidden md:flex bg-white shadow-2xl rounded-3xl w-full max-w-6xl overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 bg-green-600 flex flex-col items-center justify-center p-12 relative">
          <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center shadow-xl mb-4 border-4 border-green-400">
            <img src="/logo.png" alt="Project Logo" className="w-36 h-36 object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-white text-center mt-4">
            BANNU GUL BP RESTAURANT
          </h1>
          <p className="text-green-100 mt-6 text-center px-6 text-lg">
            Welcome back! Login to continue your order experience.
          </p>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 p-14 flex flex-col justify-center bg-gray-50">
          <div className="flex items-center gap-2 mb-6">
            <User className="text-green-600 w-6 h-6" />
            <h2 className="text-2xl font-bold text-gray-800">Login to Your Account</h2>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="text-gray-400 w-5 h-5" />
            <p className="text-gray-500 text-sm">
              Enter your credentials to access your account securely.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex mb-6 border border-gray-300 rounded-full overflow-hidden shadow-sm">
            <button
              className={`flex-1 py-3 font-semibold ${activeTab === "email" ? "bg-green-600 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}
              onClick={() => setActiveTab("email")}
            >
              Email
            </button>
            <button
              className={`flex-1 py-3 font-semibold ${activeTab === "phone" ? "bg-green-600 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}
              onClick={() => setActiveTab("phone")}
            >
              Phone
            </button>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {activeTab === "email" ? (
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-green-600 shadow-sm"
              />
            ) : (
              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-green-600 shadow-sm"
              />
            )}

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-green-600 shadow-sm w-full pr-12"
              />
              <span
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
              </span>
            </div>

            <div className="text-right mb-3">
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-green-600 text-sm cursor-pointer hover:underline"
              >
                Forgot Password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white py-4 rounded-2xl hover:bg-green-700 transition font-semibold shadow-md"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-gray-500 text-sm text-center">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-green-600 cursor-pointer font-semibold hover:underline"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>

      {/* ✅ Mobile View */}
      <div className="md:hidden flex flex-col items-center w-full">
        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-xl mb-4 border-4 border-green-400">
          <img src="/logo.png" alt="Project Logo" className="w-16 h-16 object-contain" />
        </div>

        <h1 className="text-2xl font-bold text-green-700">Login to Your Account</h1>
        <p className="text-gray-500 mt-2 mb-6 text-center text-sm">
          Enter your credentials to access your account securely.
        </p>

        <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-6">
          {/* Tabs */}
          <div className="flex mb-6 border border-gray-300 rounded-full overflow-hidden shadow-sm">
            <button
              className={`flex-1 py-2 font-semibold ${activeTab === "email" ? "bg-green-600 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}
              onClick={() => setActiveTab("email")}
            >
              Email
            </button>
            <button
              className={`flex-1 py-2 font-semibold ${activeTab === "phone" ? "bg-green-600 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}
              onClick={() => setActiveTab("phone")}
            >
              Phone
            </button>
          </div>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {activeTab === "email" ? (
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 p-3 rounded-2xl focus:ring-2 focus:ring-green-600 shadow-sm"
              />
            ) : (
              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-gray-300 p-3 rounded-2xl focus:ring-2 focus:ring-green-600 shadow-sm"
              />
            )}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 p-3 rounded-2xl focus:ring-2 focus:ring-green-600 shadow-sm w-full pr-12"
              />
              <span
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
              </span>
            </div>

            <div className="text-right -mt-2">
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-green-600 text-sm cursor-pointer hover:underline"
              >
                Forgot Password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white py-3 rounded-2xl hover:bg-green-700 transition font-semibold shadow-md"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-gray-500 text-sm text-center">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-green-600 cursor-pointer font-semibold hover:underline"
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
