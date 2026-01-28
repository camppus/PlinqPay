import api from "../api";

export default class NotificationService {
  constructor(private readonly token: string) {
    api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
  }

  public async getAlls(page: number) {
    try {
      const res = await api.get(`/notifications?page=${page}`);
      return res.data;
    } catch (error: any) {
      return {
        message: error?.response?.data?.message,
      };
    }
  }

  public async read() {
    try {
      const res = await api.put(`notifications/read`);
      return res.data;
    } catch (error: any) {
      return {
        message: error?.response?.data?.message,
      };
    }
  }
  public async getUnread() {
    try {
      const res = await api.get(`/notifications/unread`);
      return res.data;
    } catch (error: any) {
      return {
        message: error?.response?.data?.message || "Erro ao actualizar ",
      };
    }
  }
}
