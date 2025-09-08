import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AvailableTrainsPage from "../src/Pages/availableTrain";
import BookTrainPage from "./Pages/bookingPage";
import LoginPage from "./Pages/login";
import SignupPage from "./Pages/SignUp";
import MyBookings from "./Pages/MyBookings";
import { useAuth } from "./context/AuthContext";



function App() {
  const {auth}=useAuth()
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
          <div className="flex gap-6">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/trains" className="hover:underline">
              Available Trains
            </Link>
          </div>

          {auth ? <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="bg-red-500  px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>:''}
        </nav>

        <Routes>
          <Route
            path="/"
            element={<h1 className="text-center mt-10 text-2xl">Welcome!</h1>}
          />
          <Route path="/trains" element={<AvailableTrainsPage />} />
          <Route path="/book/:tripId" element={<BookTrainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/SignUp" element={<SignupPage />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
