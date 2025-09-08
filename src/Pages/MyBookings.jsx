import React, { useEffect, useState } from "react";
import { axiosPrivate } from "../api/AxiosInstance";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
} from "@mui/material";
import { QRCodeSVG } from "qrcode.react";

const statusColors = {
  CONFIRMED: "success",
  CANCELLED: "error",
};

const MyBookings = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookingHistory = async () => {
    try {
      const res = await axiosPrivate.get("/api/bookings/");
      setHistory(res.data.results || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" mt={4}>
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: "95%", mx: "auto", mt: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Bookings
      </Typography>

      {history.length === 0 ? (
        <Typography align="center" mt={4}>
          You have no bookings yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {history.map((b) => {
            const qrData = {
              passenger: b.passenger,
              train: b.trip.train.name,
              train_number: b.trip.train.number,
              from: b.source_stop.station.code,
              to: b.destination_stop.station.code,
              travel_date: b.travel_date,
              seats: b.seats,
              status: b.status,
              booked_at: b.booked_at,
            };

            return (
              <Grid item xs={12} sm={6} md={3} key={b.id}>
                <Card elevation={3} sx={{ borderRadius: 3, height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {b.trip.train.name} ({b.trip.train.number})
                    </Typography>

                    <Divider sx={{ my: 1 }} />

                    <Typography variant="body2">
                      <strong>From:</strong> {b.source_stop.station.code}
                    </Typography>
                    <Typography variant="body2">
                      <strong>To:</strong> {b.destination_stop.station.code}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Date:</strong> {b.travel_date}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Seats:</strong> {b.seats}
                    </Typography>

                    <Box mt={1}>
                      <Chip
                        label={b.status}
                        color={statusColors[b.status] || "default"}
                        size="small"
                      />
                    </Box>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      mt={1}
                    >
                      Booked: {new Date(b.booked_at).toLocaleString()}
                    </Typography>

                    <Box mt={2} display="flex" justifyContent="center">
                      <QRCodeSVG
                        value={JSON.stringify(qrData)}
                        size={120}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="H"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default MyBookings;
