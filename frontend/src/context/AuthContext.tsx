import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '../types';
import { authApi } from '../api/auth.api';
import { tokenUtils } from '../utils/token';
import { toast } from 'react-toastify';

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  loading: true,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      const token = tokenUtils.getToken();
      // TODO: In production, verify the token with the backend by calling a /me endpoint
      // For now, we rely on the 401 interceptor to handle invalid tokens
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authApi.login(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
      toast.success('Login successful!');
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authApi.register(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
      toast.success('Registration successful!');
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    dispatch({ type: 'LOGOUT' });
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
