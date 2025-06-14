import apiClient from "./apiClient";

export interface LearningObjectResponse {
  name?: string;
}

export const getObject = async (): Promise<LearningObjectResponse | null> => {
  const response = await apiClient.get<LearningObjectResponse>(
    "/get-learning-object/"
  );
  return Object.keys(response.data).length > 0 ? response.data : null;
};
