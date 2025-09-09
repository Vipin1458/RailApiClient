import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import AvailableTrainsPage from "../src/Pages/availableTrain";
import BookTrainPage from "./Pages/bookingPage";
import LoginPage from "./components/Login";
import SignupPage from "./Pages/SignUp";
import MyBookings from "./Pages/MyBookings";
import { useAuth } from "./context/AuthContext";
import MyProfile from "./Pages/Myprofile";
import Navbar from "./components/Navbar";
import Train3D from "./Pages/Train3D";



function App() {
  const {auth}=useAuth()
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
      <Navbar/>

        <Routes>
          <Route
            path="/"
            element={<Train3D/>}
          />
          <Route path="/trains" element={<AvailableTrainsPage />} />
          <Route path="/book/:tripId" element={<BookTrainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/SignUp" element={<SignupPage />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/my-profile" element={<MyProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
