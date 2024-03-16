import SearchInput from 'components/SearchInput';
import { fetchGroups } from 'api/groups';
import { useContext } from 'react';
import { ShowNoeContext } from 'context/show_noe';

const GroupSearch = ({ onSelect }) => {
    const { showNoe } = useContext(ShowNoeContext);

    const loadGroups = async (inputValue) => {
        let groups = await fetchGroups({ filter: inputValue, showNoe });

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
