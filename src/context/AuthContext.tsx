import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  username: string | null;
  setAuthUsername: (value: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setAuthUsername] = useState<string | null>(null);

  useEffect(() => {
    // Check if the session is still valid by calling an endpoint
    axios
      .get("http://localhost:8000/api/check-session/", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.is_authenticated) {
          setIsLoggedIn(true);
          setAuthUsername(response.data.username);
        } else {
          setIsLoggedIn(false);
          setAuthUsername(null);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setAuthUsername(null);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, username, setAuthUsername }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
