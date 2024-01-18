import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  username: string;
  userId: string;
}

interface AuthContextProps {
  user: User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const username = localStorage.getItem("username") || "";
    const userId = localStorage.getItem("userId") || "";

    if (token) {
      setUser({ username: username, userId: userId });
    }
  }, []);

  const contextValue: AuthContextProps = { user, logout };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
