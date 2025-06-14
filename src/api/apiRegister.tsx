import apiClient from "./apiClient";

interface RegisterRequest {
  username: string;
  password: string;
  password_confirm: string;
}

interface RegisterResponse {
  user: {
    username: string;
  };
}

export const register = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>("/register/", data);
  return response.data;
};
