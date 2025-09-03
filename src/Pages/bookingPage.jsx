import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { axiosPrivate } from "../api/AxiosInstance";

const BookTrainPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    tripId,
    sourceStopId,
    destinationStopId,
    fromCode,
    toCode,
    travelDate,
    availableSeats,
  } = state || {};

  const [seats, setSeats] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!state) {
    return (
      <p className="text-red-600 text-center mt-10">No booking data passed.</p>
    );
  }

  const handleBooking = async (e) => {
    e.preventDefault();

    if (seats > availableSeats) {
      setError(`You cannot book more than ${availableSeats} seats.`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axiosPrivate.post("http://127.0.0.1:8000/api/bookings/", {
        trip_id: tripId,
        source_stop_id: sourceStopId,
        destination_stop_id: destinationStopId,
        travel_date: travelDate,
        seats,
      });

      setSuccess("Booking successful!");
      setTimeout(() => navigate("/my-bookings"), 1500);
    } catch (err) {
      console.error(err);
      setError("Booking failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Confirm Booking</h1>

      <div className="max-w-lg mx-auto bg-white p-6 shadow rounded-xl">
        <p>
          <strong>Trip ID:</strong> {tripId}
        </p>
        <p>
          <strong>From:</strong> {fromCode}
        </p>
        <p>
          <strong>To:</strong> {toCode}
        </p>
        <p>
          <strong>Date:</strong> {travelDate}
        </p>
        <p>
          <strong>Available Seats:</strong> {availableSeats}
        </p>

        <form onSubmit={handleBooking} className="mt-4 flex flex-col gap-4">
          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}

          <input
            type="number"
            min="1"
            max={availableSeats}
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            className="border p-2 rounded"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookTrainPage;
