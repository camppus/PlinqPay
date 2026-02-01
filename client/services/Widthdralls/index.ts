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
  public async getAll(page: number) {
    try {
      const res = await api.get(`/withdrawals?page=${page}`);
      return res.data;
    } catch (error: any) {
      return {
        message: error?.response?.data?.message,
      };
    }
  }
  public async update(body: {
    id: string;
    status: string;
    fileUrl: string;
    notes: string;
  }) {
    try {
      const res = await api.put(`/withdrawals`, {
        ...body,
      });
      return res.data;
    } catch (error: any) {
      return {
        message: error?.response?.data?.message,
      };
    }
  }

  public async getTax() {
    try {
      const res = await api.get(`/tax`);
      return res.data;
    } catch (error: any) {
      return {
        message: error?.response?.data?.message,
      };
    }
  }
}
