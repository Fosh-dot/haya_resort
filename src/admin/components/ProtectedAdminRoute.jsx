import { Navigate, Outlet } from "react-router-dom";
import { isAdminAuthenticated } from "../services/adminAuth";

function ProtectedAdminRoute() {
  const authenticated = isAdminAuthenticated();

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedAdminRoute;
