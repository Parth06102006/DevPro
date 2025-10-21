import api from '../lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// User signup
export const signUp = async (userData: SignupData): Promise<ApiResponse<{ newUser: User }>> => {
  try {
    const response = await api.post('/users/signup', userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
};

// User login
export const login = async (loginData: LoginData): Promise<ApiResponse> => {
  try {
    const response = await api.post('/users/login', loginData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// User logout
export const logout = async (): Promise<ApiResponse> => {
  try {
    const response = await api.post('/users/logout');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};

// Check authentication status
export const checkAuth = async (): Promise<ApiResponse<{ user: User }>> => {
  try {
    const response = await api.post('/users/check');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Auth check failed');
  }
};

// Utility function to handle API errors
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};