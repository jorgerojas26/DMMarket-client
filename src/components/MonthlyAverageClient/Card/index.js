import { useState, useEffect } from "react";
import { fetchMonthlyAverage } from "../../../api/clients";
import ClientSearch from "../../ClientSearch";
import { ResponsiveLine } from "@nivo/line";

const MonthlyAverageClient = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (selectedClient) {
      const fetch_monthly_average = async () => {
        const response = await fetchMonthlyAverage(selectedClient.IdCliente);
        setData([response]);
      };

      fetch_monthly_average();
    } else {
      setData([]);
    }
  }, [selectedClient]);

  return (
    <div className="card">
      <div className="card-header">
        <h3>Promedio mensual</h3>
      </div>
      <div className="card-body">
        <ClientSearch onSelect={setSelectedClient} />
        {data && (
          <ResponsiveLine
            data={data}
            margin={{ top: 20, right: 30, bottom: 80, left: 40 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: true,
              reverse: false,
            }}
            axisTop={null}
            axisRight={null}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
          />
        )}
      </div>
    </div>
  );
};

export default MonthlyAverageClient;
