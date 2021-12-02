import { ResponsivePie } from '@nivo/pie';

const GroupSales = ({ chartData = [], loading }) => {
  return (
    <div className='card'>
      <div className='card-header'>
        <h3>Gráfico de categorías</h3>
      </div>
      <div className='card-body'>
        {chartData.length > 0 && (
          <ResponsivePie
            data={chartData}
            margin={{ top: 30, right: 20, bottom: 20, left: 20 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            arcLabel={function (e) {
              return `${e.value} (${e.data.netProfit})`;
            }}
            borderWidth={1}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor='#333333'
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
              from: 'color',
              modifiers: [['darker', 2]],
            }}
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
        )}
        {loading && (
          <div className='position-absolute top-50 start-50 translate-middle'>
            <span className='spinner-border spinner-border-md' role='status' aria-hidden='true' />
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupSales;
