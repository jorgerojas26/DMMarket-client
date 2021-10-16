import SearchInput from '../SearchInput';
import { fetchGroups } from '../../api/groups';

const GroupSearch = ({ onSelect }) => {
  const loadGroups = async (inputValue) => {
    let groups = await fetchGroups({ filter: inputValue });

    if (groups && groups.length > 0) {
      const records = groups.map((record) => {
        const group = {
          key: record.groupId,
          label: record.name,
          value: record,
        };
        return group;
      });

      return records;
    }
  };

  const handleSelect = (option, { action }) => {
    if (action === 'select-option') {
      onSelect(option.value, action);
    } else if (action === 'clear') {
      onSelect(null, action);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <SearchInput loadOptions={loadGroups} placeholder='Buscar categoría...' onSelect={handleSelect} />
    </div>
  );
};

export default GroupSearch;
