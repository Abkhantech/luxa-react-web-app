import axios from 'axios';

export const apiCall = async (url: string, method: any, data?: any, params?: any) => {
  const jwt = await localStorage.getItem('jwtToken');
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${jwt}`,
  };
  if (!(data instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: headers,
  });

  const res = await api({ url, method, data, params })
  return res.data
}