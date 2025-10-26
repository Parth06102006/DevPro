import api from '../lib/api';
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Create a new suggestion
export const createSuggestion = async (sessionId: string,projectId:string): Promise<ApiResponse> => {
  try {
    const response = await api.post(`/recommendations/${sessionId}/create?projectId=${projectId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create suggestion');
  }
};

// Create an answer for a chat question
export const createAnswer = async (sessionId: string, question: string,projectId:string): Promise<ApiResponse> => {
  try {
    const response = await api.post(`/recommendations/${sessionId}/chat?projectId=${projectId}`, { question });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create answer');
  }
};

export const createResponse = async (question:string): Promise<ApiResponse> => {
  try {
    const response = await api.post(`/recommendations/response`,{question});
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error Generating Response');
  }
};

// Get all chats for a session
export const getChats = async (sessionId: string,projectId:string): Promise<ApiResponse> => {
  try {
    const response = await api.get(`/recommendations/${sessionId}/retrieveMessages?projectId=${projectId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to retrieve chats');
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