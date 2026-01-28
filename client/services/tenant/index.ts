import api from "../api";

export interface ICreateCompanieDto {
  email: string;
  title: string;
  phone: string;
}

export default class TenantService {
  constructor(private readonly token: string) {
    api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
  }
  public async update(body: ICreateCompanieDto) {
    try {
      const res = await api.patch("/tenants", {
        email: body.email,
        title: body.title,
        phone: body.phone,
      });
      return res.data;
    } catch (error: any) {
      return {
        message: error?.response?.data?.message,
      };
    }
  }
  public async getAlls(page: number) {
    try {
      const res = await api.get(`/tenants?cursor=${page}`);
      return res.data;
    } catch (error: any) {
      return {
        message: error?.response?.data?.message || "Erro ao listar contas",
      };
    }
  }
  public async toogle(id: string) {
    try {
      const res = await api.put(`/tenants/${id}`);
      return res.data;
    } catch (error: any) {
      return {
        message:
          error?.response?.data?.message || "Erro ao alterar status da conta",
      };
    }
  }
  public async getMe() {
    try {
      const res = await api.get("/tenants/me");
      return res.data;
    } catch (error: any) {
      return {
        message:
          error?.response?.data?.message || "Erro ao buscar dados do usuário",
      };
    }
  }
  public async createWallet(body: {
    walletHolder: string;
    iban: string;
    bank: string;
  }) {
    try {
      const res = await api.post("/wallets", body);
      return res.data;
    } catch (error: any) {
      return {
        message: error?.response?.data?.message || "Erro ao atualizar conta",
      };
    }
  }
  public async getAllsnotifcatio(page: number) {
    try {
      const res = await api.get(`/tenants?cursor=${page}`);
      return res.data;
    } catch (error: any) {
      return {
        message: error?.response?.data?.message || "Erro ao listar contas",
      };
    }
  }
  public async resetPassword(body: {
    oldPassword: string;
    newPassword: string;
    confirmNewPasword: string;
  }) {
    try {
      const res = await api.put("/auth/reset", body);
      return res.data;
    } catch (error: any) {
      return {
        message: error?.response?.data?.message,
      };
    }
  }
}
