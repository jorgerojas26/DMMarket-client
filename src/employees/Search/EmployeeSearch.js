import { getAllEmployees } from 'api/employees';
import SearchInput from 'components/SearchInput';

const EmployeeSearch = ({ onSelect }) => {
  const loadEmployees = async (inputValue) => {
    let employees = await getAllEmployees({ filter: inputValue });

    if (employees && employees.length > 0) {
      const records = employees.map((record) => {
        const employee = {
          key: record.id,
          label: record.name,
          value: record,
        };
        return employee;
      });

      return records;
    }
  };

  const handleSelect = (option, { action }) => {
    if (action === 'select-option') {
      onSelect && onSelect(option.value, action);
    } else if (action === 'clear') {
      onSelect && onSelect(null, action);
    }
  };

  return <SearchInput loadOptions={loadEmployees} placeholder='Buscar vendedor...' onSelect={handleSelect} />;
};

export default EmployeeSearch;
