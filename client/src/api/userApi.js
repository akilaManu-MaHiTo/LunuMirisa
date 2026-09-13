import axios from 'axios';

export async function validateUser() {
  const res = await axios.get("/api/user");
  return res.data;
}