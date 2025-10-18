import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useEffect } from "react";
function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    navigate("/events");
  }, []);
  return null;
}

export default Logout;
