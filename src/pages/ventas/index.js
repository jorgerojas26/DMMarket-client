import { fetchInvoiceReport } from "api/invoice";
import GroupSales from "components/Cards/GroupSales";
import SaleReportCard from "components/Cards/SaleReport";
import DateRangePicker from "components/DateRangePicker";
import { ShowNoeContext } from "context/show_noe";
import debounce from "lodash.debounce";
import { DateTime } from "luxon";
import { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";

const VentasPage = () => {
    const [data, setData] = useState({
        filtered_invoices_report: [],
        invoices_report: [],
        group_sales_chart: [],
    });
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState({
        from: DateTime.now().startOf("month").toISODate(),
        to: DateTime.now().toISODate(),
    });

    const { showNoe } = useContext(ShowNoeContext);

    const onFilter = debounce((searchTerm) => {
        const filteredData = data.invoices_report.filter((f) =>
            f.product.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        setData({ ...data, filtered_invoices_report: filteredData });
    }, 500);

    const handleDateRangeChange = async ({ from, to }) => {
        setLoading(true);
        setDateRange({ from, to });
        const response = await fetchInvoiceReport({ from, to, showNoe });
        const chartData = response.group_sales_chart_data.reduce(
            (acc, current) => [
                ...acc,
                {
                    id: current.categoria,
                    label: current.categoria,
                    value: current.rawProfit,
                    netProfit: current.netProfit,
                },
            ],
            [],
        );
        setData((prev) => ({
            ...prev,
            invoices_report: response.sales_report,
            group_sales_chart: chartData,
        }));
        setLoading(false);
    };

    useEffect(() => {
        handleDateRangeChange(dateRange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container fluid className="p-4">
            <div className="d-flex justify-content-center mb-4">
                <DateRangePicker
                    initialFrom={DateTime.now().startOf("month").toISODate()}
                    initialTo={DateTime.now().toISODate()}
                    onChange={handleDateRangeChange}
                />
            </div>

            <div className="d-flex flex-column flex-xl-row justify-content-center gap-3">
                <div className="col-12 col-xl-6">
                    <SaleReportCard
                        data={
                            data.filtered_invoices_report.length > 0
                                ? data.filtered_invoices_report
                                : data.invoices_report
                        }
                        onFilter={onFilter}
                        loading={loading}
                    />
                </div>
                <div className="col-12 col-xl-6">
                    <GroupSales
                        chartData={data.group_sales_chart}
                        loading={loading}
                    />
                </div>
            </div>
        </Container>
    );
};

export default VentasPage;
