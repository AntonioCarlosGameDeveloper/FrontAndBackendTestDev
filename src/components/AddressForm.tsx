import { useState } from "react";

interface AddressFormProps {
  onSubmit: (data: {
    userId: string;
    displayName: string;
    cep: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export function AddressForm({ onSubmit, isLoading }: AddressFormProps) {
  const [formData, setFormData] = useState({
    userId: "",
    displayName: "",
    cep: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      setFormData({ userId: "", displayName: "", cep: "" });
    } catch (error) {
      // O erro é tratado no componente pai
    }
  };

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue.length > 8) return;
    setFormData({
      ...formData,
      cep: formatCep(rawValue),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="address-form">
      <div className="form-group">
        <label htmlFor="userId">Nome de Usuário:</label>
        <input
          id="userId"
          type="text"
          value={formData.userId}
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
          required
          minLength={3}
          placeholder="Ex: SeuNomeESobrenome"
        />
      </div>

      <div className="form-group">
        <label htmlFor="displayName">Nome de Exibição:</label>
        <input
          id="displayName"
          type="text"
          value={formData.displayName}
          onChange={(e) =>
            setFormData({ ...formData, displayName: e.target.value })
          }
          required
          minLength={3}
          placeholder="Ex: Minha Casa"
        />
      </div>

      <div className="form-group">
        <label htmlFor="cep">CEP:</label>
        <input
          id="cep"
          type="text"
          value={formData.cep}
          onChange={handleCepChange}
          required
          pattern="\d{5}-?\d{3}"
          title="Digite um CEP válido (8 dígitos)"
          placeholder="00000-000"
          maxLength={9}
        />
      </div>

      <button type="submit" disabled={isLoading} aria-busy={isLoading}>
        {isLoading ? (
          <span className="loading-indicator">Processando...</span>
        ) : (
          "Adicionar Endereço"
        )}
      </button>
    </form>
  );
}
