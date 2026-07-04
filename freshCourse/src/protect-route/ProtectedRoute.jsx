import { Navigate } from "react-router-dom";
import { useUser } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, userLoading } = useUser();

  if (userLoading) return null; // or a loading spinner

  if (!user) return <Navigate to="/auth" replace />;

  return children;
}

export default ProtectedRoute;