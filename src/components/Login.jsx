import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosPublic } from "../api/AxiosInstance";
import { useAuth } from "../context/AuthContext";

const LoginPage = ({ embedded = false }) => {
  const [loginType, setLoginType] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const location = useLocation();
  const fromBooking = location.state?.fromBooking;
  const tripId=location.state?.tripId

  const navigate = useNavigate();

  const requestOtp = async () => {
    try {
      setOtpSending(true);
      const res = await axiosPublic.post("/api/auth/login/request-otp/", {
        email,
      });
      setOtpSent(true);
      setOtpSending(false);
      setMessage(res.data.detail);
    } catch (err) {
      setOtpSending(false);
      setMessage(err.response?.data?.detail || "Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axiosPublic.post("/api/auth/login/verify-otp/", {
        email,
        code: otp,
      });
      const { access, refresh, user } = res.data;
      login({ user, access, refresh });
      setMessage("Login successful!");
        if (fromBooking) {
    navigate(`/book/${tripId}`, { state: fromBooking });
  } else {
    navigate("/trains");
  }
    } catch (err) {
      setMessage(err.response?.data?.detail || "Error verifying OTP");
    }
  };

  const loginWithPassword = async () => {
    try {
      const res = await axiosPublic.post("/api/token/", {
        username: email,
        password,
      });
      const { access, refresh, user } = res.data;
      login({ user, access, refresh });
      setMessage("Login successful!");
      if (fromBooking) {
    navigate(`/book/${tripId}`, { state: fromBooking });
  } else {
    navigate("/trains");
  }
    } catch (err) {
      setMessage(err.response?.data?.detail || "Invalid username or password");
    }
  };

  return (
    <div
      className={`${
        embedded ? "" : "flex items-center justify-center h-screen bg-gray-100"
      }`}
    >
     
      <div
        className={`bg-white p-8 rounded-2xl shadow-md ${
          embedded ? "w-full" : "w-96"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {message && <p className="mb-3 text-sm text-red-600">{message}</p>}

        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="password"
              checked={loginType === "password"}
              onChange={() => setLoginType("password")}
            />
            Password
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="otp"
              checked={loginType === "otp"}
              onChange={() => setLoginType("otp")}
            />
            OTP
          </label>
        </div>

        {loginType === "password" ? (
          <>
            <input
              type="email"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <button
              onClick={loginWithPassword}
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Login
            </button>
            <Link to="/SignUp">
              <span className="text-sm text-gray-600 hover:underline">
                No account? SignUp
              </span>
            </Link>
          </>
        ) : (
          <>
            {!otpSent ? (
              <>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                />
                <button
                  disabled={otpSending}
                  onClick={requestOtp}
                  className="w-full bg-blue-500 text-white py-2 rounded"
                >
                  {otpSending ? "Sending..." : "Request OTP"}
                </button>
                <Link to="/SignUp">
                  <span className="text-sm text-gray-600 hover:underline">
                    No account? SignUp
                  </span>
                </Link>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                />
                <button
                  onClick={verifyOtp}
                  className="w-full bg-green-500 text-white py-2 rounded"
                >
                  Verify OTP
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
