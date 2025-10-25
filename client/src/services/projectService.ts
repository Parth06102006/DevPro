import api from '../lib/api';

export interface ProjectGenerationData {
  programmingLanguage: string[];
  techStack: string[];
  title: string;
  description ?: string
  difficulty ?:string
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Generate Project Ideas
export const generateProject = async (generateData:ProjectGenerationData ,sessionId:string): Promise<ApiResponse> => {
  try {
    const response = await api.post(`/projects/${sessionId}/generate`, generateData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed Generating Project');
  }
};

export const getGeneratedProjectsList = async (sessionId:string): Promise<ApiResponse> => {
  try {
    const response = await api.get(`/projects/${sessionId}/list`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed Retreiving Project List');
  }
};

export const generateProjectInfo = async (sessionId:string,projectId:string): Promise<ApiResponse> => {
  try {
    const response = await api.post(`/projects/${sessionId}/create?selectedGenProjId=${projectId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed GENERATE Project Data');
  }
};

export const getProjectInfo = async (sessionId:string,projectId:string): Promise<ApiResponse> => {
  try {
    const response = await api.get(`/projects/${sessionId}/info?selectedGenProjId=${projectId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to GET Project Data');
  }
};

export const getDashboardInfo = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get(`/projects/dashboard`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to GET Dashboard Information');
  }
};

export const saveProject = async(sessionId:string,projectId:string):Promise<ApiResponse>=>{
  try {
    const response = await api.post(`/projects/${sessionId}/save?projectId=${projectId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Unable to Save Project');
  }
}

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