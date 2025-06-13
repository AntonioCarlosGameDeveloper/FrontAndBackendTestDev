import { Address } from "../types/addressTypes";
import { AddressItem } from "./AddressItem";

interface AddressListProps {
  addresses: Address[];
  onUpdate: (id: string, updates: Partial<Address>) => void;
  onDelete: (id: string) => void;
}

export const AddressList = ({
  addresses,
  onUpdate,
  onDelete,
}: AddressListProps) => {
  if (addresses.length === 0) {
    return <p className="no-addresses">Nenhum endereço cadastrado</p>;
  }

  return (
    <div className="address-list">
      <h2>Endereços Cadastrados</h2>
      <ul>
        {addresses.map((address) => (
          <AddressItem
            key={address.id}
            address={address}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
};
