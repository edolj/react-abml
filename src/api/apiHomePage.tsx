import apiClient from "./apiClient";

export interface LearningObjectResponse {
  name?: string;
  iteration?: number;
  expert_attributes?: string[];
  display_names?: Record<string, string>;
  attr_descriptions?: Record<string, string>;
  attr_tooltips?: Record<string, string>;
}

export const getObject = async (): Promise<LearningObjectResponse | null> => {
  const response = await apiClient.get<LearningObjectResponse>(
    "/get-learning-object/"
  );
  return Object.keys(response.data).length > 0 ? response.data : null;
};
