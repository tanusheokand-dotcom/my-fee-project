import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  getUsers,
  saveUsers,
  getSessionUserId,
  setSessionUserId,
  seedDemoData,
} from "../utils/storage";

// FRONTEND DEMO ONLY: not secure. Passwords are kept in LocalStorage as plain text.
// A real app needs a backend that hashes passwords and issues secure sessions or tokens.

const AuthContext = createContext(null);

// Never keep the password in React state
const publicUser = ({ password, ...rest }) => rest;

function readInitialUser() {
  seedDemoData();
  const id = getSessionUserId();
  if (!id) return null;
  const found = getUsers().find((u) => u.id === id);
  return found ? publicUser(found) : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readInitialUser);

  const login = useCallback(({ email, password }) => {
    const found = getUsers().find((u) => u.email === email.trim().toLowerCase());
    if (!found || found.password !== password) {
      return { ok: false, error: "Incorrect email or password." };
    }
    setSessionUserId(found.id);
    setUser(publicUser(found));
    return { ok: true };
  }, []);

  const signup = useCallback(({ name, email, password }) => {
    const users = getUsers();
    const normalized = email.trim().toLowerCase();
    if (users.some((u) => u.email === normalized)) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const newUser = {
      id: `u_${Date.now().toString(36)}`,
      name: name.trim(),
      email: normalized,
      password,
      createdAt: new Date().toISOString(),
    };
    if (!saveUsers([...users, newUser])) {
      return { ok: false, error: "Could not save your account. Is browser storage disabled?" };
    }
    setSessionUserId(newUser.id);
    setUser(publicUser(newUser));
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setSessionUserId(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, login, signup, logout }),
    [user, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);