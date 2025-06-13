import { useAddressBook } from "../hooks/useAddressBook";
import { AddressForm } from "./AddressForm";
import { AddressList } from "./AddressList";
import { AddressFilters } from "./AddressFilters";
import { ToastNotification } from "./ToastNotification";
import { useEffect, useState } from "react";

export const AddressBook = () => {
  const {
    addresses,
    isLoading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    setFilters,
  } = useAddressBook();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setToastMessage(error);
    }
  }, [error]);

  const handleAddAddress = async (data: {
    userId: string;
    displayName: string;
    cep: string;
  }) => {
    try {
      await addAddress(data);
      setToastMessage("Endereço adicionado com sucesso!");
    } catch {
      //Erro já sendo trabalhado no hook
    }
  };

  return (
    <div className="address-book-container">
      <h1>Agenda de Endereços</h1>

      <AddressForm onSubmit={handleAddAddress} isLoading={isLoading} />

      <AddressFilters onFilterChange={setFilters} />

      <AddressList
        addresses={addresses}
        onUpdate={updateAddress}
        onDelete={deleteAddress}
      />

      <ToastNotification
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};
