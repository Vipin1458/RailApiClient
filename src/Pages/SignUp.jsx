import React, { useState } from "react";
import axios from "axios";
import { axiosPublic } from "../api/AxiosInstance";
import { Navigate } from "react-router-dom";

const SignupPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const requestOtp = async () => {
    try {
      const res = await axiosPublic.post("/api/auth/register/request-otp/", form);
      setOtpSent(true);
      setMessage(res.data.detail);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axiosPublic.post("/api/auth/register/verify-otp/", {
        email: form.email,
        code: otp,
      });
      setMessage(res.data.detail);
      setOtpSent(false);
      Navigate('/login')
    } catch (err) {
      setMessage(err.response?.data?.detail || "Error verifying OTP");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        {message && <p className="mb-3 text-sm text-blue-600">{message}</p>}

        {!otpSent ? (
          <>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={form.first_name}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={form.last_name}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full mb-2 p-2 border rounded"
            />
            <button
              onClick={requestOtp}
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Request OTP
            </button>
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

export default SignupPage;
