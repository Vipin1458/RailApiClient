import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AvailableTrainsPage from "../src/Pages/availableTrain"; 
import BookTrainPage from "./Pages/bookingPage";
import LoginPage from "./Pages/login";
import SignupPage from "./Pages/SignUp";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4 text-white flex gap-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/trains" className="hover:underline">
            Available Trains
          </Link>
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
