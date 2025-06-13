import { Address, Filters } from "../types/addressTypes";
import { addressService } from "../services/addressService";
import { useState, useEffect } from "react";

interface AddressInput {
  userId: string;
  displayName: string;
  cep: string;
}

const loadAddresses = (): Address[] => {
  const data = localStorage.getItem("addresses");
  return data ? JSON.parse(data) : [];
};

const saveAddresses = (addresses: Address[]) => {
  localStorage.setItem("addresses", JSON.stringify(addresses));
};

export const useAddressBook = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [filters, setFilters] = useState<Filters>({
    userId: "",
    localidade: "",
    uf: "",
    displayName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAddresses(loadAddresses());
  }, []);

  const filteredAddresses = addresses.filter((address) => {
    return (
      address.userId.toLowerCase().includes(filters.userId.toLowerCase()) &&
      address.localidade
        .toLowerCase()
        .includes(filters.localidade.toLowerCase()) &&
      address.uf.toLowerCase().includes(filters.uf.toLowerCase()) &&
      address.displayName
        .toLowerCase()
        .includes(filters.displayName.toLowerCase())
    );
  });

  const addAddress = async (newAddress: AddressInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const addressData = await addressService.findByCep(newAddress.cep);
      const completeAddress: Address = {
        id: crypto.randomUUID(),
        ...newAddress,
        ...addressData,
      };

      setAddresses((prev) => {
        const newList = [...prev, completeAddress];
        saveAddresses(newList);
        return newList;
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar CEP");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  const updateAddress = (id: string, updates: Partial<Address>) => {
    setAddresses((prev) => {
      const newList = prev.map((addr) =>
        addr.id === id ? { ...addr, ...updates } : addr
      );
      saveAddresses(newList);
      return newList;
    });
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => {
      const newList = prev.filter((addr) => addr.id !== id);
      saveAddresses(newList);
      return newList;
    });
  };

  return {
    addresses: filteredAddresses,
    isLoading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    setFilters,
  };
};
