import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { subscribeToAuthChanges, getCurrentUser } from "../firebase/auth";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(getCurrentUser());

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
