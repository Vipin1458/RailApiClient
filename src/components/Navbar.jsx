import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';

function Navbar() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <div className="flex gap-6">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/trains" className="hover:underline">
          Available Trains
        </Link>
      </div>

      {auth ? (
        <AccountCircleIcon onClick={() => navigate("/my-profile")} />
      ) : (
        <NoAccountsIcon onClick={() => navigate("/my-profile")} />
      )}
    </nav>
  );
}

export default Navbar
