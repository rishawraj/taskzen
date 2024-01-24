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
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const VITE_BASE_BACKEND_URL = import.meta.env.VITE_BASE_BACKEND_URL;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const respsone = await fetch(`${VITE_BASE_BACKEND_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (respsone.ok) {
        const userData = (await respsone.json()) as {
          token: string;
          userId: string;
          username: string;
        };

        console.log(userData);

        setUser({ username: userData.username, userId: userData.userId });

        localStorage.setItem("jwtToken", userData.token);
        localStorage.setItem("username", userData.username);
        localStorage.setItem("userId", userData.userId);
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error Logging in", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const contextValue: AuthContextProps = { user, isLoading, login, logout };

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
