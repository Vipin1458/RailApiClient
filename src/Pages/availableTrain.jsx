import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { axiosPublic } from "../api/AxiosInstance";

const AvailableTrainsPage = () => {
  const [stations, setStations] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await axiosPublic.get("/api/stations/");
        setStations(res.data.results || res.data);
      } catch (err) {
        console.error("Failed to load stations", err);
      }
    };
    fetchStations();
  }, []);

  useEffect(() => {
    if (from && to && date) {
      handleSearch(new Event("submit"));
    }
  }, [date]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!from || !to) {
      setError("Please fill all fields");
      return;
    }
    if (from === to) {
      setError("Source and destination cannot be the same");
      setTrips([]);
      return;
    }

    setLoading(true);
    setError("");
    setTrips([]);

    try {
      const res = await axiosPublic.get("/api/trips/search/", {
        params: { from, to, date },
      });
      setTrips(res.data.results || res.data);
    } catch (err) {
      setError("Failed to fetch trips. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Search Available Trains
      </h1>

      <form
        onSubmit={handleSearch}
        className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 flex flex-col gap-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="flex-1 border p-2 rounded-lg"
            required
          >
            <option value="">From Station</option>
            {stations.map((s) => (
              <option key={s.id} value={s.code}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>

          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="flex-1 border p-2 rounded-lg"
            required
          >
            <option value="">To Station</option>
            {stations.map((s) => (
              <option key={s.id} value={s.code}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 border p-2 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="max-w-4xl mx-auto mt-8">
        {error && <p className="text-red-600">{error}</p>}

        {trips.length > 0 ? (
          <table className="w-full border-collapse bg-white shadow-md rounded-xl overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Train</th>
                {date && (
                  <>
                    <th className="p-3 text-left">Available Seats</th>
                  </>
                )}
                <th className="p-3 text-left">Running Days</th>
                {date && <th className="p-3 text-left">Book</th>}
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    {trip.train.number} - {trip.train.name}
                  </td>
                  {date ? (
                    <>
                      <td
                        className={`p-3 font-semibold ${
                          trip.can_book ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {trip.available_seats ?? "N/A"}
                      </td>
                    </>
                  ) : (
                    ""
                  )}
                  <td className="p-3">
                    {trip.effective_running_days.join(", ")}
                  </td>
                  {date && (
                    <>
                      {" "}
                      <td className="p-3">
                        <Link
                          to={`/book/${trip.id}`}
                          state={{
                            tripId: trip.id,
                            sourceStopId: trip.stops_detail.find(
                              (s) => s.station.code === from
                            )?.id,
                            destinationStopId: trip.stops_detail.find(
                              (s) => s.station.code === to
                            )?.id,
                            fromCode: from,
                            toCode: to,
                            travelDate: date,
                            availableSeats: trip.available_seats,
                          }}
                          className={`py-1 px-3 rounded text-white transition ${
                            trip.can_book
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-red-900 cursor-not-allowed opacity-70"
                          }`}
                        >
                          <button disabled={!trip.can_book}>Book</button>
                        </Link>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading &&
          !error && (
            <p className="text-center text-gray-600">
              No results yet. Please search.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default AvailableTrainsPage;
