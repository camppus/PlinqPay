import api from "../api";

export interface ICreateCompanieDto {
  title: string;
}

export default class ApiKeyService {
  constructor(private readonly token: string) {
    api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
  }
  public async create(body: ICreateCompanieDto) {
    try {
      const res = await api.post("/apikeys", {
        title: body.title,
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
      const res = await api.get(`/apikeys?page=${page}`);
      return res.data;
    } catch (error: any) {
      return {
        message: error?.response?.data?.message,
      };
    }
  }

  public async toogle(id: string) {
    try {
      const res = await api.patch(`/apikeys/${id}`);
      return res.data;
    } catch (error: any) {
      return {
        message: error?.response?.data?.message,
      };
    }
  }
}
