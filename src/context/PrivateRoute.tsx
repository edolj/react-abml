import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isLoggedIn, checkSession } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession().finally(() => {
      setLoading(false);
    });
  }, [checkSession]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isLoggedIn ? children : <Navigate to="/" />;
};

export default PrivateRoute;
