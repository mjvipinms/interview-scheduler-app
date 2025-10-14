import axios from './axios';

export const login = async (username, password) => {
  const resp = await axios.post("/auth/login", { username, password });
  return resp.data;
};
