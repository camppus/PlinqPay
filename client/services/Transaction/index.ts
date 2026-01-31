import constants from "@/constants";
import api from "../api";
import { ITenant } from "@/types";

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

  public async getAll(page: number) {
    try {
      const res = await api.get(`/transaction?page=${page}`);
      return res.data;
    } catch (error: any) {
      return {
        message: error?.response?.data?.message,
      };
    }
  }

  public async create(amount: string, apikey: string, user: ITenant) {
    try {
      const data = await api.post(constants.SERVER_PATH + "/transaction", {
        headers: {
          "Content-Type": "application/json",
          "api-key": apikey,
        },
        body: JSON.stringify({
          externalId: "trx_123456",
          callbackUrl: "https://meusite.com/webhook",
          method: "REFERENCE",
          client: {
            name: user.title,
            email: user.email,
            phone: user.phone,
          },
          items: [
            {
              title: "Teste de pagamento",
              price: amount,
              quantity: 1,
            },
          ],
          amount,
        }),
      });
      return data.data;
    } catch (error) {
      return {
        error: true,
      };
    }
  }
}
