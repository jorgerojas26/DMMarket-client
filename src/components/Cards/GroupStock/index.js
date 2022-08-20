import { useState, useEffect, useRef, useContext } from 'react';
import { CurrencyRateContext } from '../../../context/currency_rate';
import GroupSearch from 'components/GroupSearch';
import { fetchProductPriceList } from 'api/products';
import PriceListTable from 'components/PriceListTable';
import { useReportFilter } from 'hooks/useReportFilter';
import { DateTime } from 'luxon';
import PriceListPDF from 'components/PDF/PriceList';
import { renderToStaticMarkup } from 'react-dom/server';
import { fetchProductsByGroup } from 'api/products';
import { Button } from 'react-bootstrap';
import CurrencyModal from 'components/Modals/CurrencyModal';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

const GroupStock = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [data, setData] = useState([]);
  const { filteredData, setFilteredData, onFilterDebounced } = useReportFilter(data);
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const { currencyRate } = useContext(CurrencyRateContext);

  useEffect(() => {
    if (selectedGroup) {
      const fetch_stock_by_group = async () => {
        setLoading(true);
        const data = await fetchProductPriceList(selectedGroup.groupId);
        setFilteredData([]);
        inputRef.current.value = '';
        setData([...data]);
        setLoading(false);
      };

      fetch_stock_by_group();
    } else if (!selectedGroup) {
      setData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup]);

  return (
    <div className='card'>
      <div className='card-header'>
        <h3>Lista de precios por categoría</h3>
        <Button variant='primary' onClick={() => setShowCurrencyModal(true)}>
          <span>Imprimir</span>
        </Button>
      </div>
      <div className='card-body'>
        <div
          style={{
            display: 'flex',
            gap: '20%',
          }}
        >
          <GroupSearch onSelect={setSelectedGroup} />

          <input
            ref={inputRef}
            className='input-filter'
            placeholder='Buscar...'
            type='search'
            onChange={(event) => {
              onFilterDebounced(event.target.value, 'product');
            }}
          />
        </div>
        <PriceListTable data={filteredData.length > 0 ? filteredData : data} loading={loading} />
      </div>
      {showCurrencyModal && (
        <CurrencyModal
          show={showCurrencyModal}
          onClose={() => setShowCurrencyModal(false)}
          onSubmit={async (currency) => {
            console.log('currency', currency);
            const groups = await fetchProductsByGroup();
            var div = document.createElement('div');

            const doc = new jsPDF('p', 'pt', 'a4');
            const pdfName = `LISTA-DE-PRECIOS-${DateTime.fromISO(new Date().toISOString())
              .toLocaleString()
              .replaceAll('/', '-')}.pdf`;
            doc.setProperties({
              title: pdfName,
            });
            doc.setFontSize(16);
            doc.text('ALIMENTOS DM MARKET, C.A.', 300, 25, { align: 'center' });
            doc.setFontSize(6);
            doc.text(
              'CALLE ILUSTRES PROCERES LOCAL NRO S/N SECTOR CENTRO ALTAGRACIA DE ORITUCO DE ORITUCO ZONA POSTAL 2320.',
              300,
              35,
              { align: 'center' }
            );
            doc.setFontSize(8);
            doc.text('R.I.F.: J-41270446-0', 300, 45, { align: 'center' });
            doc.text('Teléfono:', 300, 55, { align: 'center' });

            doc.setFontSize(9);
            doc.text(`LISTA DE PRECIOS AL ${DateTime.fromISO(new Date().toISOString()).toLocaleString()}`, 300, 70, {
              align: 'center',
            });

            Object.keys(groups).forEach((key) => {
              let products = groups[key];

              products = products.map((product) => {
                if (currency === 'Bs') {
                  console.log('yes currency is Bs');
                  return {
                    ...product,
                    price: Number(product.price * currencyRate?.Cambio).toFixed(2),
                  };
                }

                return product;
              });

              div.innerHTML = renderToStaticMarkup(<PriceListPDF data={products} group={key} currency={currency} />);
              doc.autoTable({
                html: div.firstChild,
                styles: { cellPadding: 2 },
                didParseCell: (data) => {
                  if (data.section === 'body' && data.cell.raw && data.cell.raw.nodeName === 'TH') {
                    data.cell.styles.fillColor = 'gray';
                    data.cell.styles.color = 'white';
                    data.cell.styles.cellWidth = 'wrap';
                  }
                },
                margin: { top: 80 },
              });
              doc.addPage();
            });
            doc.save(pdfName);
          }}
        />
      )}
    </div>
  );
};

export default GroupStock;
