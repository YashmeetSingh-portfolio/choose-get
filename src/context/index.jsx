import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase"; 
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // << New loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserLoggedIn(user);
      setAuthLoading(false); // << Set loading false when checked
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ userLoggedIn, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
