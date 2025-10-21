import api from '../lib/api';



export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Create Session
export const createSession = async (): Promise<ApiResponse> => {
  try {
    const response = await api.post('/sessions/create');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
};

// Sessions List
export const sessionList = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get('/sessions/list');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
};

// Delete Session
export const deleteSession = async (sessionId:string): Promise<ApiResponse> => {
  try {
    const response = await api.delete(`/sessions/${sessionId}/delete`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Signup failed');
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