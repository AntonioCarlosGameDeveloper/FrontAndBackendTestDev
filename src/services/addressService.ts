import httpClient from "./httpClient";
import { Address } from "../types/addressTypes";

class AddressService {
  private readonly BASE_URL = "https://viacep.com.br/ws";

  async findByCep(
    cep: string
  ): Promise<Omit<Address, "id" | "userId" | "displayName">> {
    const data = await httpClient.get<any>(`${this.BASE_URL}/${cep}/json/`);
    if (data.erro) throw new Error("CEP não encontrado");
    return data;
  }
}

export const addressService = new AddressService();
