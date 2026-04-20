import api from "./AxiosInstance";

export const apiClient = {
  get: <T>(url: string, params?: object) =>
    api.get<T>(url, params).then((res) => res.data),

  post: <T>(url: string, data?: any) =>
    api.post<T>(url, data).then((res) => res.data),

  put: <T>(url: string, data?: any) =>
    api.put<T>(url, data).then((res) => res.data),

  patch: <T>(url: string, data?: any) =>
    api.patch<T>(url, data).then((res) => res.data),

  delete: <T>(url: string) => api.delete<T>(url).then((res) => res.data),
};
