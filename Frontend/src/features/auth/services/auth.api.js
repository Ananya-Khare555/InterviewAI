import axios from "axios";

const api = axios.create({
  baseURL: "https://interviewai-7uyo.onrender.com/api",
  withCredentials: true
});

// ✅ ADD THIS BLOCK HERE
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("TOKEN:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ REGISTER
export async function register({ username, email, password }) {
  try {
    const response = await api.post('/auth/register', {
      username,
      email,
      password
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

// ✅ LOGIN
export async function login({ email, password }) {
  try {
    const response = await api.post("/auth/login", {
      email,
      password
    });

    // ✅ STORE TOKEN
    localStorage.setItem("token", response.data.token);

    return response.data;

  } catch (err) {
    console.log(err);
  }
}

// ✅ LOGOUT
export async function logout() {
  try {
    const response = await api.post('/auth/logout'); // ⚠️ backend uses POST
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

// ✅ GET CURRENT USER
export async function getMe() {
  try {
    const response = await api.get('/auth/profile'); // ⚠️ FIXED
    return response.data;
  } catch (err) {
    console.log(err);
  }
}