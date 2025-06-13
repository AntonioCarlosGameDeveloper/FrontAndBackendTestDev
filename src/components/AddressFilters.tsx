import { useEffect, useState } from "react";
import { Filters } from "../types/addressTypes";

interface AddressFiltersProps {
  onFilterChange: (filters: Filters) => void;
}

export const AddressFilters = ({ onFilterChange }: AddressFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<Filters>({
    userId: "",
    localidade: "",
    uf: "",
    displayName: "",
  });

  useEffect(() => {
    onFilterChange(localFilters);
  }, [localFilters, onFilterChange]);

  return (
    <div className="address-filters">
      <input
        type="text"
        placeholder="Filtrar por usuário"
        value={localFilters.userId}
        onChange={(e) =>
          setLocalFilters({ ...localFilters, userId: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Filtrar por cidade"
        value={localFilters.localidade}
        onChange={(e) =>
          setLocalFilters({ ...localFilters, localidade: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Filtrar por estado (UF)"
        value={localFilters.uf}
        onChange={(e) =>
          setLocalFilters({
            ...localFilters,
            uf: e.target.value.toUpperCase().slice(0, 2),
          })
        }
      />
      <input
        type="text"
        placeholder="Buscar por nome de exibição"
        value={localFilters.displayName}
        onChange={(e) =>
          setLocalFilters({ ...localFilters, displayName: e.target.value })
        }
      />
    </div>
  );
};
