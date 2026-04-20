import axios from "axios";
import { applyInterceptors } from "./Interceptors";

const api = axios.create({
  baseURL: "http://localhost:9000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

applyInterceptors(api);

export default api;
