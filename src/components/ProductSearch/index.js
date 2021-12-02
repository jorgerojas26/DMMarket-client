import SearchInput from 'components/SearchInput';
import { fetchProducts } from 'api/products';

const ProductSearch = ({ onSelect }) => {
    const loadProductVariants = async (inputValue) => {
        let products = await fetchProducts({ filter: inputValue });

        if (products && products.length > 0) {
            const records = products.map((record) => {
                let product_name = record.Descripcion;

                const product = {
                    key: record.id,
                    label: product_name,
                    value: record,
                };
                return product;
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
        <SearchInput
            loadOptions={loadProductVariants}
            defaultOptions={false}
            placeholder='Buscar producto...'
            onSelect={handleSelect}
        />
    );
};

export default ProductSearch;
