import { createContext, useEffect, useState, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { AuthState, Tokens, DecodedToken } from "@/types/types";
import { baseURL } from "@/api/api";

interface AuthContextType {
  authState: AuthState;
  loginModal: boolean;
  setLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export let refreshAccessToken: () => Promise<Tokens | null>;
export let logout: () => void;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const tokens: Tokens | null = JSON.parse(
      localStorage.getItem("tokens") || "null"
    );
    if (tokens) {
      const { access } = tokens;
      const decodedToken: DecodedToken = jwtDecode(access);
      return { accessToken: access, userId: decodedToken.user_id };
    }
    return { accessToken: null, userId: null };
  });
  const [loginModal, setLoginModal] = useState<boolean>(false);

  useEffect(() => {
    refreshAccessToken();
  }, []);

  refreshAccessToken = async (): Promise<Tokens | null> => {
    const tokens: Tokens | null = JSON.parse(
      localStorage.getItem("tokens") || "null"
    );
    if (tokens?.refresh) {
      try {
        const response = await axios.post(`${baseURL}/api/token/refresh/`, {
          refresh: tokens.refresh,
        });
        const newTokens = { ...tokens, access: response.data.access };
        setTokens(newTokens);
        const decodedToken: DecodedToken = jwtDecode(newTokens.access);
        setAuthState({
          userId: decodedToken.user_id,
          accessToken: newTokens.access,
        });
        console.log("Access token refreshed :)");
        return newTokens;
      } catch (error) {
        console.error("Error refreshing access token:", error);
        logout();
        return null;
      }
    } else {
      console.log("No refresh token set to refresh");
      return null;
    }
  };

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await axios.post(`${baseURL}/api/token/`, {
        username,
        password,
      });
      const tokens: Tokens = {
        access: response.data.access,
        refresh: response.data.refresh,
      };
      const decodedToken: DecodedToken = jwtDecode(tokens.access);
      setAuthState({
        accessToken: tokens.access,
        userId: decodedToken.user_id,
      });
      setTokens(tokens);
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed");
    }
  };

  logout = (): void => {
    setAuthState({ userId: null, accessToken: null });
    localStorage.removeItem("tokens");
  };

  const setTokens = (tokens: Tokens): void => {
    localStorage.setItem("tokens", JSON.stringify(tokens));
  };

  return (
    <AuthContext.Provider
      value={{ authState, loginModal, setLoginModal, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
