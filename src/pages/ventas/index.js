import { useState } from "react";
import Container from "react-bootstrap/Container";
import SaleReportCard from "../../components/Cards/SaleReport";
import GroupSales from "../../components/Cards/GroupSales";
import DatePicker from "../../components/DatePicker";
import { fetchInvoiceReport } from "../../api/invoice";
import debounce from "lodash.debounce";

const VentasPage = () => {
  const [data, setData] = useState({
    filtered_invoices_report: [],
    invoices_report: [],
    group_sales_chart: [],
  });

  const onFilter = debounce((searchTerm) => {
    const filteredData = data.invoices_report.filter((f) => f.product.toLowerCase().includes(searchTerm.toLowerCase()));
    setData({ ...data, filtered_invoices_report: filteredData });
  }, 500);

  const onSubmit = async (event, dateRange) => {
    event.preventDefault();

    const response = await fetchInvoiceReport(dateRange);
    const chartData = response.group_sales_chart_data.reduce(
      (acc, current) => [
        ...acc,
        { id: current.categoria, label: current.categoria, value: current.rawProfit, netProfit: current.netProfit },
      ],
      []
    );
    setData({ ...data, invoices_report: response.sales_report, group_sales_chart: chartData });
  };

  return (
    <Container fluid className="bg-dark px-5 pt-3 pb-5">
      <div className="">
        <DatePicker onSubmit={onSubmit} />
      </div>
      <div className="d-flex flex-column flex-xl-row content-center gap-3">
        <div className="col-12 col-xl-6">
          <SaleReportCard
            data={data.filtered_invoices_report.length > 0 ? data.filtered_invoices_report : data.invoices_report}
            onFilter={onFilter}
          />
        </div>
        <div className="col-12 col-xl-6">
          <GroupSales chartData={data.group_sales_chart} />
        </div>
      </div>
    </Container>
  );
};

export default VentasPage;
