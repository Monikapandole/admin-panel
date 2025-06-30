import axiosInstance from "../axiosInstance";
import { getToken } from "./categoryService";

export const getPolicy = async () => {
  const token = getToken();
  const response = await axiosInstance.get("/viewPolicy", {
    headers: {
      Authorization: `Bearer ${token}`,
      'Cookie': `Admin_token=${token}`,
    },
  });
  return response.data;
};

export const savePolicy = async (policyData) => {
  const token = getToken();
  const formData = new FormData();
  if (policyData.id) {
    formData.append("id", policyData.id);
  }
  formData.append("policy", policyData.policy);
  const response = await axiosInstance.post("/savePolicy", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Cookie': `Admin_token=${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deletePolicy = async (id) => {
  const token = getToken();
  const formData = new FormData();
  formData.append("id", id);
  const response = await axiosInstance.post(`/deletePolicy`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Cookie': `Admin_token=${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}; 