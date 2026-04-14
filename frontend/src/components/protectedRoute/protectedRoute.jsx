import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/UserLoginContext";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";

const ProtectedRoute = () => {
  const { isAuthenticated, authResolved } = useAuth();

  if (!authResolved) {
    return <div>Verifying session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <Header />
      <div className="main-content-wrapper">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
