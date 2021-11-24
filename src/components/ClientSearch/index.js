import SearchInput from "../SearchInput";
import { fetchClients } from "../../api/clients";

const ClientSearch = ({ onSelect }) => {
  const loadClients = async (inputValue) => {
    let clients = await fetchClients({ filter: inputValue });

    if (clients && clients.length > 0) {
      const records = clients.map((record) => {
        const client = {
          key: record.IdCliente,
          label: record.name,
          value: record,
        };
        return client;
      });

      return records;
    }
  };

  const handleSelect = (option, { action }) => {
    if (action === "select-option") {
      onSelect && onSelect(option.value, action);
    } else if (action === "clear") {
      onSelect && onSelect(null, action);
    }
  };

  return (
    <SearchInput
      loadOptions={loadClients}
      defaultOptions={false}
      placeholder="Buscar cliente..."
      onSelect={handleSelect}
    />
  );
};

export default ClientSearch;
