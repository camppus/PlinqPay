import constants from "@/constants";
import axios from "axios";

const api = axios.create({
  baseURL: constants.SERVER_PATH,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      window.location.href = "/auth";
    }
    if (error.response?.status >= 500) {
      console.error("Erro no servidor", error.response.status);
    }
    return Promise.reject(error);
  },
);
export default api;
