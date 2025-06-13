import { Address } from "../types/addressTypes";

const STORAGE_KEY = "addressBookData";

export const loadAddresses = (): Address[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveAddresses = (addresses: Address[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
};
