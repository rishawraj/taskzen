import { Navigate } from "react-router-dom";
// import { useAuth } from "../Context/AuthContext";
import { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // const { user } = useAuth();

  const userId = localStorage.getItem("userId");

  if (userId) {
    return <>{children}</>;
  }

  return <Navigate to="/login" />;
};

export { PrivateRoute };
