import DateRangePicker from "components/DateRangePicker";
import InvoicesTable from "components/InvoicesTable";
import ProductsTable from "components/ProductsTable";
import { ShowNoeContext } from "context/show_noe";
import { DateTime } from "luxon";
import { useContext, useEffect, useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { fetchInvoiceList } from "../../api/invoice";

const InvoicesPage = () => {
    const [loading, setLoading] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [dateRange, setDateRange] = useState({
        from: DateTime.now().startOf("month").toISODate(),
        to: DateTime.now().toISODate(),
    });
    const { showNoe } = useContext(ShowNoeContext);

    const productsSummary = useMemo(() => {
        if (!selectedRows || selectedRows.length === 0) return [];

        const products = {};

        selectedRows.forEach((row) => {
            row.products.forEach((product) => {
                if (!products[product.productId]) {
                    products[product.productId] = {
                        ...product,
                        quantity: 0,
                    };
                }

                products[product.productId].quantity += product.quantity;
                products[product.productId].total =
                    products[product.productId].quantity *
                    products[product.productId].price;
                products[product.productId].total =
                    products[product.productId].total.toFixed(2);
            });
        });
        //convert products to an array
        return Object.values(products);
    }, [selectedRows]);

    const invoicesTotalSummary = useMemo(() => {
        if (!selectedRows || selectedRows.length === 0) return 0;

        return selectedRows.reduce(
            (total, invoice) => total + invoice?.total,
            0,
        );
    }, [selectedRows]);

    const handleDateRangeChange = async ({ from, to }) => {
        setLoading(true);
        setDateRange({ from, to });
        const response = await fetchInvoiceList({ from, to, showNoe });
        setInvoices(response);
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
                    <InvoicesTable
                        data={invoices}
                        loading={loading}
                        onRowSelect={setSelectedRows}
                    />
                </div>
                <div className="col-12 col-xl-6">
                    <ProductsTable
                        data={productsSummary}
                        loading={loading}
                        totalSummary={invoicesTotalSummary}
                    />
                </div>
            </div>
        </Container>
    );
};

export default InvoicesPage;
