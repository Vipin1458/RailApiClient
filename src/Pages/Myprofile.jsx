
import { useAuth } from "../context/AuthContext";
import {
  Card,
  Typography,
  CardContent,
  Divider,
  Button,
  Stack,
   RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginPage from "../components/Login";

const MyProfile = () => {
  const { auth, logout } = useAuth(); 
  const user = auth?.user;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Card
      elevation={5}
      sx={{
        maxWidth: 400,
        margin: "20px auto",
        padding: 3,
        textAlign: "center",
      }}
    >
     {auth ? ( <CardContent>
        <Typography variant="h5" gutterBottom>
          {user.firstname} {user.lastname}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body1">
          <strong>Username:</strong> {user.username}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {user.email}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {user.is_staff ? "Admin / Staff" : "Regular User"}
        </Typography>
        <Typography
          variant="body2"
          color={user.is_blocked ? "error" : "success.main"}
          sx={{ mb: 2 }}
        >
          {user.is_blocked ? "Blocked" : "Active"}
        </Typography>

        <Stack spacing={2} direction="column">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/my-bookings")}
          >
            My Bookings
          </Button>
          <Button  variant="outlined" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
      </CardContent>):(
         <CardContent sx={{maxHeight:500}}>
        <Typography gutterBottom variant="h6">
          You are currently logged out
          <Divider sx={{my:2}}/>
        </Typography>
        <LoginPage embedded />
      </CardContent>
      )}
    </Card>
  );
};

export default MyProfile;
