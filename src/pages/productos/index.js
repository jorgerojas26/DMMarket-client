import { useState } from "react";
import Container from "react-bootstrap/Container";
import CostFluctuationCard from "../../components/Cards/CostFluctuation";
import GroupStock from "../../components/Cards/GroupStock";
import DatePicker from "../../components/DatePicker";
import ProductCostPerGroup from "../../components/ProductCostPerGroup/Card";
import { DateTime } from "luxon";
import debounce from "lodash.debounce";

const ProductosPage = () => {
  const [data, setData] = useState({
    filtered_best_clients: [],
    best_clients: [],
    group_sales_chart: [],
  });
  const [dateRange, setDateRange] = useState({
    from: DateTime.now().toISODate(),
    to: DateTime.now().toISODate(),
  });

  const onFilter = debounce((searchTerm) => {
    const filteredData = data.best_clients.filter((f) => f.client.toLowerCase().includes(searchTerm.toLowerCase()));
    setData({ ...data, filtered_best_clients: filteredData });
  }, 500);

  return (
    <Container fluid className="px-5 pt-3 pb-5">
      <div className=""></div>
      <div className="d-flex flex-column flex-xl-row content-center gap-3">
        <div className="col-12 col-xl-4">
          <CostFluctuationCard />
        </div>
        <div className="col-12 col-xl-4">
          <GroupStock />
        </div>
        <div className="col-12 col-xl-4">
          <ProductCostPerGroup />
        </div>
      </div>
    </Container>
  );
};

export default ProductosPage;
