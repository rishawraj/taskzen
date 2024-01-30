import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface DarkModeContextProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const DarkModeContext = createContext<DarkModeContextProps | undefined>(
  undefined
);

interface DarkModeProviderProps {
  children: ReactNode;
}

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({
  children,
}) => {
  const intialDarkMode = localStorage.getItem("darkMode") === "true" || false;
  const [isDarkMode, setDarkMode] = useState(intialDarkMode);

  useEffect(() => {
    const prefersDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode((prev) => (prefersDarkMode ? prev : intialDarkMode));
  }, [intialDarkMode]);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
    localStorage.setItem("darkMode", `${isDarkMode}`);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setDarkMode(!isDarkMode);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = (): DarkModeContextProps => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};
