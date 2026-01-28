import api from "../api";

export default class TransactionSevice {
  constructor(private readonly token: string) {
    api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
  }
  public async getAlls(page: number) {
    try {
      const res = await api.get(`/transaction/my?page=${page}`);
      return res.data;
    } catch (error: any) {
      return {
        message: error?.response?.data?.message,
      };
    }
  }

  public async getById(id: string) {
    try {
      const res = await api.get(`/transaction/${id}/details`);
      return res.data;
    } catch (error: any) {
      return {
        message: error?.response?.data?.message,
      };
    }
  }
}
