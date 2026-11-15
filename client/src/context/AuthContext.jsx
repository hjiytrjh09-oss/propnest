import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on page load
  useEffect(() => {
    if (!localStorage.getItem("propnest_token")) return setLoading(false);
    api("/auth/me")
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem("propnest_token"))
      .finally(() => setLoading(false));
  }, []);

  const handleAuth = (data) => {
    localStorage.setItem("propnest_token", data.token);
    setUser(data.user);
  };

  const login = async (email, password) =>
    handleAuth(await api("/auth/login", { method: "POST", body: { email, password }, auth: false }));

  const register = async (form) =>
    handleAuth(await api("/auth/register", { method: "POST", body: form, auth: false }));

  const logout = () => {
    localStorage.removeItem("propnest_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
