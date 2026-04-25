import { fetchAsyncLogoutUser } from "../api/ApiAuth";
import { useNavigate } from "react-router";
import { useAuthContext } from "../api/AuthContext";

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    await fetchAsyncLogoutUser();
    logout();
    navigate("/login");
  };

  return (
    <a href="" onClick={handleLogout}>Logout</a>
  );
};

export default Logout;