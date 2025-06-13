import { useState } from "react";
import { Address } from "../types/addressTypes";

interface AddressItemProps {
  address: Address;
  onUpdate: (id: string, updates: Partial<Address>) => void;
  onDelete: (id: string) => void;
}

export const AddressItem = ({
  address,
  onUpdate,
  onDelete,
}: AddressItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(address.displayName);

  const handleUpdate = () => {
    onUpdate(address.id, { displayName: editedName });
    setIsEditing(false);
  };

  return (
    <li className="address-item">
      <div className="address-header">
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="edit-input"
          />
        ) : (
          <h3>{address.displayName}</h3>
        )}
        <span className="user-id">({address.userId})</span>
      </div>

      <div className="address-details">
        <p>{address.logradouro}</p>
        {address.complemento && <p>Complemento: {address.complemento}</p>}
        <p>Bairro: {address.bairro}</p>
        <p>
          {address.localidade}/{address.uf} - CEP: {address.cep}
        </p>
      </div>

      <div className="address-actions">
        {isEditing ? (
          <>
            <button onClick={handleUpdate}>Salvar</button>
            <button onClick={() => setIsEditing(false)}>Cancelar</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)}>Editar</button>
            <button onClick={() => onDelete(address.id)}>Excluir</button>
          </>
        )}
      </div>
    </li>
  );
};
