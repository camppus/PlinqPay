import api from "../api";

export default class WithdrawlsSevice {
  constructor(private readonly token: string) {
    api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
  }
  public async getAlls(page: number) {
    try {
      const res = await api.get(`/withdrawals/my?page=${page}`);
      return res.data;
    } catch (error: any) {
      return {
        message: error?.response?.data?.message,
      };
    }
  }

  public async create(amount: number) {
    try {
      const res = await api.post(`/withdrawals`, {
        amount,
      });
      return res.data;
    } catch (error: any) {
      return {
        message: error?.response?.data?.message,
      };
    }
  }
}
