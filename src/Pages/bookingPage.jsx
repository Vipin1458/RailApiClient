import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosPrivate } from "../api/AxiosInstance";
import {
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Divider,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const BookTrainPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
 const {
  tripId,
  train,
  train_number,
  sourceStopId,
  destinationStopId,
  fromCode,
  toCode,
  travelDate,
  availableSeats,
  passengers: prefilledPassengers, 
} = state || {};


 const [passengers, setPassengers] = useState(
  prefilledPassengers?.length ? prefilledPassengers : [{ name: "", age: "", gender: "M" }]
);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();

  if (!state) {
    return (
      <Typography color="error" align="center" sx={{ mt: 6 }}>
        No booking data passed.
      </Typography>
    );
  }

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const addPassenger = () => {
    if (passengers.length >= availableSeats) {
      setError(`You cannot book more than ${availableSeats} seats.`);
      return;
    }
    setPassengers([...passengers, { name: "", age: "", gender: "M" }]);
  };

  const removePassenger = (index) => {
    const updated = passengers.filter((_, i) => i !== index);
    setPassengers(updated);
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (passengers.length === 0) {
      setError("You must add at least one passenger.");
      return;
    }

    if (passengers.length > availableSeats) {
      setError(`You cannot book more than ${availableSeats} seats.`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (auth) {
        await axiosPrivate.post("http://127.0.0.1:8000/api/bookings/", {
          trip_id: tripId,
          source_stop_id: sourceStopId,
          destination_stop_id: destinationStopId,
          travel_date: travelDate,
          passengers,
        });

        setSuccess("Booking successful!");
        setTimeout(() => navigate("/my-bookings"), 1500);
      }
      else {
        const bookingData = {
          tripId,
          train,
          train_number,
          sourceStopId,
          destinationStopId,
          fromCode,
          toCode,
          travelDate,
          availableSeats,
          passengers,
        };

        navigate("/login", {
          state: { fromBooking: bookingData, tripId: tripId },
        });
      }
    } catch (err) {
      console.error(err);
      setError("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.800", py: 6 }}>
      <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
        Confirm Your Booking
      </Typography>

      <Paper
        elevation={4}
        sx={{
          maxWidth: 700,
          mx: "auto",
          p: 4,
          borderRadius: 3,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Trip Details
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Train
            </Typography>
            <Typography>
              {train} ({train_number})
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Date
            </Typography>
            <Typography>{travelDate}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              From
            </Typography>
            <Typography>{fromCode}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              To
            </Typography>
            <Typography>{toCode}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Available Seats
            </Typography>
            <Typography>{availableSeats}</Typography>
          </Grid>
        </Grid>

        <Box component="form" onSubmit={handleBooking} sx={{ mt: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Typography variant="h6" gutterBottom>
            Passenger Details
          </Typography>

          {passengers.map((p, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                mb: 2,
                bgcolor: "grey.50",
                borderRadius: 2,
                border: "1px solid #ddd",
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <TextField
                    label="Name"
                    value={p.name}
                    onChange={(e) =>
                      handlePassengerChange(index, "name", e.target.value)
                    }
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    type="number"
                    label="Age"
                    value={p.age}
                    onChange={(e) =>
                      handlePassengerChange(index, "age", e.target.value)
                    }
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    select
                    label="Gender"
                    value={p.gender}
                    onChange={(e) =>
                      handlePassengerChange(index, "gender", e.target.value)
                    }
                    fullWidth
                    SelectProps={{ native: true }}
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </TextField>
                </Grid>

                <Grid item xs={1}>
                  {index > 0 && (
                    <IconButton
                      onClick={() => removePassenger(index)}
                      color="error"
                    >
                      <Remove />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Button
            startIcon={<Add />}
            onClick={addPassenger}
            sx={{ mb: 3 }}
            disabled={passengers.length >= availableSeats}
          >
            Add Passenger
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default BookTrainPage;
