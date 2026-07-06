import DateRangePicker from "components/DateRangePicker";
import debounce from "lodash.debounce";
import { useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { fetchSalesByGroup } from "../../api/groups";
import ProductChart from "../../components/Cards/ProductGraph";
import SaleReportCard from "../../components/Cards/SaleReport";
import GroupSearch from "../../components/GroupSearch";

const Categories = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState();
    const [dateRange, setDateRange] = useState({
        from: DateTime.now().startOf('month').toISODate(),
        to: DateTime.now().toISODate(),
    });

    const chartData = useMemo(() => {
        const data_to_use = filteredData?.length ? filteredData : data;

        if (!Array.isArray(data_to_use)) return [];

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
            [],
        );
    }, [data, filteredData]);

    const onFilter = debounce((searchTerm) => {
        const filteredData = data.filter((f) =>
            f.product.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        setFilteredData(filteredData);
    }, 500);

    const handleDateRangeChange = async ({ from, to }) => {
        if (selectedGroup) {
            try {
                setLoading(true);
                setDateRange({ from, to });
                const response = await fetchSalesByGroup({
                    from,
                    to,
                    categoryId: selectedGroup?.groupId,
                });
                setData(Array.isArray(response) ? response : []);
            } catch (error) {
                console.log("error", error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (selectedGroup) {
            handleDateRangeChange(dateRange);
        }
    }, [selectedGroup]);

    return (
        <div className="p-4">
            <div className="d-flex justify-content-center w-100">
                <div className="d-flex align-items-center mb-2 gap-3">
                    <span className="text-white">Categoría</span>
                    <GroupSearch onSelect={setSelectedGroup} />
                </div>
            </div>
            <div className="d-flex justify-content-end">
                <DateRangePicker
                    initialFrom={DateTime.now().startOf('month').toISODate()}
                    initialTo={DateTime.now().toISODate()}
                    onChange={handleDateRangeChange}
                />
            </div>

            <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center gap-5 mt-5">
                <div className="w-100">
                    <SaleReportCard
                        data={filteredData?.length ? filteredData : data}
                        loading={loading}
                        onFilter={onFilter}
                    />
                </div>
                <div className="w-100">
                    <ProductChart chartData={chartData} loading={loading} />
                </div>
            </div>
        </div>
    );
};

export default Categories;
