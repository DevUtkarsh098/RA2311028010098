import { apiClient } from './client';

export interface RegistrationData {
  email: string;
  name: string;
  mobileNo: string;
  githubUsername: string;
  rollNo: string;
  accessCode: string;
}

export interface RegistrationResponse {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}

export interface AuthData {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}

export interface AuthResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
}

export const registerUser = async (data: RegistrationData): Promise<RegistrationResponse> => {
  const response = await apiClient.post('/evaluation-service/register', data);
  return response.data;
};

export const authenticateUser = async (data: AuthData): Promise<AuthResponse> => {
  const response = await apiClient.post('/evaluation-service/auth', data);
  return response.data;
};
