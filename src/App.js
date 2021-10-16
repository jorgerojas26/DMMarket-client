import { useState, useEffect, useMemo } from 'react';

import SaleReportTable from './components/SaleReportTable';
import ClientReportTable from './components/ClientReportTable';

import { DateTime } from 'luxon';

import { fetchInvoiceReport } from './api/invoice';

import { ResponsivePie } from '@nivo/pie';

import SaleReportCard from './components/Cards/SaleReport';
import ClientReportCard from './components/Cards/ClientReport';
import CostFluctuation from './components/Cards/CostFluctuation';

import { useReportFilter } from './hooks/useReportFilter';
import ClientRegistration from './components/Cards/ClientRegistration';
import GroupStock from './components/Cards/GroupStock';

function App() {
  const [dateRange, setDateRange] = useState({
    from: DateTime.now().toISODate(),
    to: DateTime.now().toISODate(),
  });
  const [reportDetails, setReportDetails] = useState({
    sale_report: [],
    categories_report: [],
    client_report: [],
    new_clients_report: [],
  });
  const [chartData, setChartData] = useState({
    sale_report: [],
    categories_report: [],
    client_report: [],
    buy_price_fluctuation: [],
    new_clients_report: [],
  });

  const { filteredData, onFilterDebounced } = useReportFilter(reportDetails, {
    sale_report: [],
    categories_report: [],
    client_report: [],
    new_clients_report: [],
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    const response = await fetchInvoiceReport(dateRange);
    setReportDetails({ ...response });
  };

  useEffect(() => {
    const categories_report_chart_data = reportDetails.categories_report.reduce((acc, current) => {
      return [...acc, { id: current.categoria, label: current.categoria, value: current.rawProfit, netProfit: current.netProfit }];
    }, []);

    const client_report_chart_data = reportDetails.client_report.reduce((acc, current) => {
      return [...acc, { id: current.client, label: current.client, value: current.total_USD }];
    }, []);

    setChartData({ ...chartData, categories_report: categories_report_chart_data, client_report: client_report_chart_data });
  }, [reportDetails]);

  return (
    <div className='App'>
      <div id='date-range-wrapper'>
        <div id='date-range-container'>
          <label>Desde:</label>
          <input type='date' value={dateRange.from} onChange={(event) => setDateRange({ ...dateRange, from: event.target.value })} />
          <label>Hasta:</label>
          <input type='date' value={dateRange.to} onChange={(event) => setDateRange({ ...dateRange, to: event.target.value })} />
          <input type='submit' onClick={onSubmit} />
        </div>
      </div>
      <main id='main'>
        <div id='left-content'>
          <SaleReportCard
            data={filteredData.sale_report.length ? filteredData.sale_report : reportDetails.sale_report}
            onFilter={onFilterDebounced}
          />
          <ClientReportCard
            data={filteredData.client_report.length ? filteredData.client_report : reportDetails.client_report}
            onFilter={(filterValue, filterKey) => onFilterDebounced(filterValue, filterKey)}
          />
          <CostFluctuation />
          <ClientRegistration
            data={filteredData.new_clients_report.length ? filteredData.new_clients_report : reportDetails.new_clients_report}
            onFilter={onFilterDebounced}
          />
          <GroupStock />
        </div>
        <div id='right-content'>
          <div className='card'>
            <div className='card-header'>
              <h2>Gráfico de categorías</h2>
            </div>
            <div className='card-body'>
              {chartData.categories_report.length > 0 && (
                <div style={{ height: '300px' }}>
                  <ResponsivePie
                    data={chartData.categories_report}
                    margin={{ top: 30, right: 20, bottom: 20, left: 20 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    arcLabel={function (e) {
                      return `${e.value} (${e.data.netProfit})`;
                    }}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor='#333333'
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                    tooltip={({ datum }) => {
                      return (
                        <div className='tooltip-container'>
                          <span className='small-square' style={{ background: datum.color }}></span>
                          <strong>{datum.label}</strong>
                          <label>Bruto: </label>
                          <span>${Number(datum.value).toLocaleString()}</span>
                          <label>Utilidad: </label>
                          <span>${Number(datum.data.netProfit).toLocaleString()}</span>
                        </div>
                      );
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className='card'>
            <div className='card-header'>
              <h2>Gráfico de clientes</h2>
            </div>
            <div className='card-body'>
              {chartData.client_report.length > 0 && (
                <div style={{ height: '300px' }}>
                  <ResponsivePie
                    data={chartData.client_report}
                    margin={{ top: 30, right: 20, bottom: 20, left: 20 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor='#333333'
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
