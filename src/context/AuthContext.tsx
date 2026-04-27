import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from 'react';
import { type User } from '../types';
import { type SignUpp } from '../types/signup';
// ---- BACKEND: imported getCurrentUser and getToken from api service ----
import { getCurrentUser,removeToken,getToken } from '../services/api';
interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  user: User;
  setUser: (user: User) => void;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  isSignedUp: SignUpp;
  setIsSignedUp: (val: SignUpp) => void;
  isAdmin: boolean; 
  setIsAdmin: (val: boolean) => void;
  isCheckingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User>({ name: '', email: '' });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isSignedUp, setIsSignedUp] = useState<SignUpp>({ email: '', password: '' });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // ---- BACKEND REMOVED: isSignedUp state no longer needed ----
  // const [isSignedUp, setIsSignedUp] = useState<SignUpp>({ email: '', password: '' });

  // ---- BACKEND ADDED: loading state while checking token on refresh ----
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
   

  // ---- BACKEND ADDED: check token on every page refresh ----
  // ---- This keeps the user logged in after refresh ----
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();

      if (!token) {
        // No token found — user is not logged in
        setIsCheckingAuth(false);
        return;
      }

      try {
        // ---- BACKEND CALL: verify token and get user data ----
        const result = await getCurrentUser();

        if (result.success) {
          // Token is valid — restore auth state
          setIsLoggedIn(true);
          setUser({ name: result.user.name, email: result.user.email });
          setIsAdmin(result.user.role === "admin");
        } else {
          // Token is invalid or expired — clear it
          removeToken();
          setIsLoggedIn(false);
        }
      } catch (error) {
        // Network error — clear token
        removeToken();
        setIsLoggedIn(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn, setIsLoggedIn,
        user, setUser,
        showModal, setShowModal,
        isSignedUp, setIsSignedUp,
        isAdmin, setIsAdmin,isCheckingAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};