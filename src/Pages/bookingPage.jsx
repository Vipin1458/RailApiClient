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
} from "@mui/material";

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
  } = state || {};

  const [seats, setSeats] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!state) {
    return (
      <Typography color="error" align="center" sx={{ mt: 6 }}>
        No booking data passed.
      </Typography>
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

      setSuccess(" Booking successful!");
      setTimeout(() => navigate("/my-bookings"), 1500);
    } catch (err) {
      console.error(err);
      setError("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.100", py: 6 }}>
      <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
        Confirm Your Booking
      </Typography>

      <Paper
        elevation={4}
        sx={{
          maxWidth: 600,
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
              Trip ID
            </Typography>
            <Typography>{tripId}</Typography>
          </Grid>
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

          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Date
            </Typography>
            <Typography>{travelDate}</Typography>
          </Grid>
          <Grid item xs={6}>
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

          <TextField
            type="number"
            label="Number of Seats"
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            inputProps={{ min: 1, max: availableSeats }}
            fullWidth
            required
            sx={{ mb: 3 }}
          />

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
