import axiosInstance from "../axiosInstance";
import { getToken } from "./categoryService";

export const getTerms = async () => {
  const token = getToken();
  const response = await axiosInstance.get("/viewTerms", {
    headers: {
      Authorization: `Bearer ${token}`,
      'Cookie': `Admin_token=${token}`,
    },
  });
  return response.data;
};

export const saveTerms = async (termsData) => {
  const token = getToken();
  const formData = new FormData();
  if (termsData.id) {
    formData.append("id", termsData.id);
  }
  formData.append("terms", termsData.terms);
  const response = await axiosInstance.post("/saveTerms", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Cookie': `Admin_token=${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteTerms = async (id) => {
  const token = getToken();
  const formData = new FormData();
  formData.append("id", id);
  const response = await axiosInstance.post(`/deleteTerms`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Cookie': `Admin_token=${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}; 