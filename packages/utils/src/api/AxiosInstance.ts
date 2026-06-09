import axios from "axios";
import { applyInterceptors } from "./Interceptors";

const api = axios.create({
  baseURL: "http://10.0.2.2:9000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

applyInterceptors(api);

export default api;
