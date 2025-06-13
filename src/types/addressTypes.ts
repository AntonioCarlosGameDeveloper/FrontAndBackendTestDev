export interface Address {
  id: string;
  userId: string;
  displayName: string;
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export interface Filters {
  userId: string;
  localidade: string;
  uf: string;
  displayName: string;
}
