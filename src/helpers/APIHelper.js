import axios from 'axios';
import { serverUrl } from '@/helpers/URLHelper';

export const initData = async (hash) => {
  try {
    const res = await axios.get(`${serverUrl}/init`, {
      params: {
        hash: hash,
      },
    });
    return res;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
