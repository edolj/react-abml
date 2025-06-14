import apiClient from "./apiClient";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  user: {
    username: string;
  };
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/login/", data);
  return response.data;
};
