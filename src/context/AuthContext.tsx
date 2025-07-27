import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import apiClient from "../api/apiClient";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  username: string | null;
  setAuthUsername: (value: string | null) => void;
  isSuperuser: boolean;
  setIsSuperuser: (value: boolean) => void;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setAuthUsername] = useState<string | null>(null);
  const [isSuperuser, setIsSuperuser] = useState<boolean>(false);

  const logout = () => {
    setIsLoggedIn(false);
    setAuthUsername(null);
    setIsSuperuser(false);
  };

  const checkSession = () => {
    return apiClient
      .get("/check-session/")
      .then((response) => {
        if (response.data.authenticated) {
          setIsLoggedIn(true);
          setAuthUsername(response.data.username);
          setIsSuperuser(response.data.is_superuser);
        } else {
          logout();
        }
      })
      .catch(() => {
        logout();
      });
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        username,
        setAuthUsername,
        isSuperuser,
        setIsSuperuser,
        checkSession,
      }}
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
