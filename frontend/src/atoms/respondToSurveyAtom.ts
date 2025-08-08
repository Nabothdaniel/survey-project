// atoms/respondToSurveyAtom.js
import { atom } from 'jotai';
import api from '../utils/api'; 

export const respondToSurveyAtom = atom(null);

export const submitSurveyResponseAtom = atom(
  null,
  async (get, set, responsePayload) => {
    try {
      const res = await api.post('/response/respond', responsePayload);
      console.log('Survey submitted successfully:', res.data);
    } catch (error) {
      console.error('Failed to submit survey:', error);
      throw error?.response?.data || error.message || 'Unknown error';
    }
  }
);
