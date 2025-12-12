import { axiosInstance } from './axios';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../types';
import { tokenUtils } from '../utils/token';

export const authApi = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', credentials);
    tokenUtils.setToken(response.data.token);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    tokenUtils.setToken(response.data.token);
    return response.data;
  },

  logout: () => {
    tokenUtils.removeToken();
  }
};
