import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosPublic } from "../api/AxiosInstance";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const {login}=useAuth()

  const navigate= useNavigate()

  const requestOtp = async () => {
    try {
      const res = await axiosPublic.post("/api/auth/login/request-otp/", { email });
      setOtpSent(true);
      setMessage(res.data.detail);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axiosPublic.post("api/auth/login/verify-otp/", { email, code: otp });
      const { access, refresh, user } = res.data;
        login({
      user: user, 
      access: access,
      refresh:refresh,
    });
      setMessage("Login successful!");
      navigate('/trains')
    } catch (err) {
      setMessage(err.response?.data?.detail || "Error verifying OTP");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {message && <p className="mb-3 text-sm text-blue-600">{message}</p>}

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
              onClick={requestOtp}
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Request OTP
            </button>
            <Link to={'/SignUp'} ><span>No account ? SignUp</span></Link>
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
      </div>
    </div>
  );
};

export default LoginPage;
