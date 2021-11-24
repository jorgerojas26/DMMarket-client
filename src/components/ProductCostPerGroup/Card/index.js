import { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { fetchCostPerGroup } from "../../../api/products";

const ProductCostPerGroupCard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const response = await fetchCostPerGroup();
      if (response && response.length) {
        const chartData = response.reduce(
          (acc, current) => [
            ...acc,
            {
              id: current.group_name,
              label: current.product,
              value: current.total_cost,
            },
          ],
          []
        );
        console.log(response, chartData);
        setData(chartData);
      }
    };
    fetch();
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <h3>Inversión por categoría</h3>
      </div>
      <div className="card-body">
        {data.length > 0 && (
          <ResponsivePie
            data={data}
            margin={{ top: 30, right: 20, bottom: 20, left: 20 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            valueFormat={(value) => value.toLocaleString()}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
              from: "color",
              modifiers: [["darker", 2]],
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProductCostPerGroupCard;
