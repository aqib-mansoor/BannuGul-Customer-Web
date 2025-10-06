import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, HelpCircle } from "lucide-react";
import { FaUser } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { POST } from "../api/httpMethods";   // ✅ use httpMethods
import URLS from "../api/urls";             // ✅ import urls

export default function Register() {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const showAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(""), 5000); // ✅ 5 seconds
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 6; // Minimum 6 characters
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!validateEmail(email)) {
      showAlert("Please enter a valid email address.", "error");
      return;
    }
    if (!validatePassword(password)) {
      showAlert("Password must be at least 6 characters long.", "error");
      return;
    }
    if (password !== passwordConfirmation) {
      showAlert("Passwords do not match.", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("password_confirmation", passwordConfirmation);
      formData.append("login_type", "MANUAL");
      formData.append("user_type", "USER");
      if (profileImage) formData.append("profile_image", profileImage);

      const res = await POST(URLS.REGISTER, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && !res.data.error) {
        showAlert("Registration successful! Please login to continue.", "success");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        showAlert("Registration failed. Please try again.", "error");
      }
    } catch (err) {
      console.error("Register failed", err);
      showAlert("Registration failed. Please check your details.", "error");
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
            Create your account to enjoy fast food delivery.
          </p>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 p-14 flex flex-col justify-center bg-gray-50">
          <div className="flex items-center gap-2 mb-6">
            <User className="text-green-600 w-6 h-6" />
            <h2 className="text-2xl font-bold text-gray-800">Create Your Account</h2>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="text-gray-400 w-5 h-5" />
            <p className="text-gray-500 text-sm">
              Fill in the details below to register and start ordering.
            </p>
          </div>

          {/* ✅ Alert */}
          {alertMessage && (
            <div
              className={`mb-4 p-3 rounded text-center font-medium ${
                alertType === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {alertMessage}
            </div>
          )}

          {/* Profile Upload */}
          <div className="flex justify-center mb-6">
            <label className="cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-green-300 hover:border-green-500 transition">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <FaUser className="text-green-400 w-10 h-10" />
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-green-600 shadow-sm"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-green-600 shadow-sm"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-green-600 shadow-sm"
              required
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-green-600 shadow-sm w-full pr-12"
                required
              />
              <span
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="border border-gray-300 p-4 rounded-2xl focus:ring-2 focus:ring-green-600 shadow-sm w-full pr-12"
                required
              />
              <span
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
              </span>
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white py-3 rounded-2xl hover:bg-green-700 transition font-semibold shadow-md"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-gray-500 text-sm text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-green-600 cursor-pointer font-semibold hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>

      {/* ✅ Mobile View */}
      <div className="md:hidden flex flex-col items-center w-full">
        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-xl mb-4 border-4 border-green-400">
          <img src="/logo.png" alt="Project Logo" className="w-16 h-16 object-contain" />
        </div>

        <h1 className="text-2xl font-bold text-green-700">Create Your Account</h1>
        <p className="text-gray-500 mt-2 mb-6 text-center text-sm">
          Fill in your details to get started.
        </p>

        <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-6">
          {/* Profile Upload */}
          <div className="flex justify-center mb-6">
            <label className="cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-green-300 hover:border-green-500 transition">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <FaUser className="text-green-400 w-10 h-10" />
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          {alertMessage && (
            <div
              className={`mb-4 p-3 rounded text-center font-medium ${
                alertType === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {alertMessage}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 p-3 rounded-2xl focus:ring-2 focus:ring-green-600 shadow-sm"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-3 rounded-2xl focus:ring-2 focus:ring-green-600 shadow-sm"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 p-3 rounded-2xl focus:ring-2 focus:ring-green-600 shadow-sm"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 p-3 rounded-2xl focus:ring-2 focus:ring-green-600 shadow-sm w-full pr-12"
                required
              />
              <span
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
              </span>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="border border-gray-300 p-3 rounded-2xl focus:ring-2 focus:ring-green-600 shadow-sm w-full pr-12"
                required
              />
              <span
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
              </span>
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white py-3 rounded-2xl hover:bg-green-700 transition font-semibold shadow-md"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-gray-500 text-sm text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-green-600 cursor-pointer font-semibold hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
