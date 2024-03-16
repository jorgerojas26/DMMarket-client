import { useState, useMemo } from 'react';

import DatePicker from 'components/DatePicker';
import SaleReportCard from '../../components/Cards/SaleReport';
import GroupSearch from '../../components/GroupSearch';

import { fetchSalesByGroup } from '../../api/groups';
import ProductChart from '../../components/Cards/ProductGraph';

import debounce from 'lodash.debounce';

const Categories = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState();
    console.log('filteredData', filteredData);

    console.log('selectedGroup', selectedGroup);

    const chartData = useMemo(() => {
        const data_to_use = filteredData?.length ? filteredData : data;

        return data_to_use.reduce(
            (acc, current) => [
                ...acc,
                {
                    id: current.product,
                    label: current.product,
                    value: current.rawProfit,
                    netProfit: current.netProfit,
                },
            ],
            []
        );
    }, [data, filteredData]);

    const onFilter = debounce((searchTerm) => {
        const filteredData = data.filter((f) => f.product.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredData(filteredData);
    }, 500);

    const onDateChange = async (event, dateRange) => {
        event.preventDefault();

        if (selectedGroup) {
            try {
                setLoading(true);
                const response = await fetchSalesByGroup({
                    from: dateRange.from,
                    to: dateRange.to,
                    categoryId: selectedGroup?.groupId,
                });

                setData(response);
            } catch (error) {
                console.log('error', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div>
            <div className='d-flex justify-content-center w-100'>
                <div className='d-flex align-items-center mb-2 gap-3'>
                    <span className='text-white'>Categoría</span>
                    <GroupSearch onSelect={setSelectedGroup} />
                </div>
            </div>
            <div>
                <DatePicker onSubmit={onDateChange} loading={loading} submitDisabled={!selectedGroup} />
            </div>

            <div className='d-flex flex-column flex-lg-row justify-content-center align-items-center gap-5 mt-5'>
                <div className='w-100'>
                    <SaleReportCard
                        data={filteredData?.length ? filteredData : data}
                        loading={loading}
                        onFilter={onFilter}
                    />
                </div>
                <div className='w-100'>
                    <ProductChart chartData={chartData} loading={loading} />
                </div>
            </div>
        </div>
    );
};

export default Categories;
