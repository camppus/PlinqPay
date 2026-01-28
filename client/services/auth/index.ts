import constants from "@/constants";
import { isArrayMappble } from "@/lib/utils";
import { ITenant } from "@/types";

export interface ICreateCompanieDto {
  email: string;
  title: string;
  phone: string;
  password: string;
}
export default class AuthService {
  private readonly server = constants.SERVER_PATH;

  public async login(email: string, password: string): Promise<ILogin> {
    try {
      const data = await fetch(`${this.server}/auth/login`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const response = await data.json();
      const message = isArrayMappble(response?.message)
        ? response?.message[0]
        : (response?.message ?? "Erro ao acesssar a conta");
      return {
        message: message,
        user: response?.data,
        token: response?.acessToken ?? "",
      };
    } catch (error: any) {
      return {
        message: "Erro ao fazer login",
        user: undefined,
        token: "",
      };
    }
  }
  public async signIng(body: ICreateCompanieDto): Promise<ILogin> {
    try {
      const res = await fetch(`${this.server}/tenants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const responseAPi = await res.json();
      const message = isArrayMappble(responseAPi?.message)
        ? responseAPi?.message[0]
        : (responseAPi?.message ?? "Erro ao criar a conta");
      return {
        message: message,
        user: responseAPi?.data,
        token: responseAPi?.acessToken ?? "",
      };
    } catch (error) {
      return {
        message: "Erro ao criar conta",
        user: undefined,
        token: "",
      };
    }
  }
}

export interface ILogin {
  user?: ITenant;
  message: string;
  token: string;
}
