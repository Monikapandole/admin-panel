
import axiosInstance from '../axiosInstance';

export const getPrivacyPolicy = async () => {
  try {
    const response = await axiosInstance.get('/pandp');
    return response?.data || 'No privacy policy found.';
  } catch (error) {
    throw new Error('Failed to load privacy policy.');
  }
};

export const getTermsAndConditions = async () => {
  try {
    const response = await axiosInstance.get('/tandc');
    return response?.data || 'No terms and conditions found.';
  } catch (error) {
    throw new Error('Failed to load terms and conditions.');
  }
};
