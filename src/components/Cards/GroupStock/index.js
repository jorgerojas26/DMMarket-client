import { useState, useEffect, useRef } from 'react';
import GroupSearch from 'components/GroupSearch';
import { fetchProductPriceList } from 'api/products';
import PriceListTable from 'components/PriceListTable';
import { useReportFilter } from 'hooks/useReportFilter';
import { DateTime } from 'luxon';
import PriceListPDF from 'components/PDF/PriceList';
import { renderToStaticMarkup } from 'react-dom/server';
import { fetchProductsByGroup } from 'api/products';
import { Button } from 'react-bootstrap';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

const doc = new jsPDF('p', 'pt', 'a4');

const pdfName = `LISTA-DE-PRECIOS-${DateTime.fromISO(new Date().toISOString())
  .toLocaleString()
  .replaceAll('/', '-')}.pdf`;

doc.setProperties({
  title: pdfName,
});

const GroupStock = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [data, setData] = useState([]);
  const { filteredData, setFilteredData, onFilterDebounced } = useReportFilter(data);
  const inputRef = useRef(null);
  const [printPDF, setPrintPDF] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (printPDF) {
      const fetch_product_data = async () => {
        setPdfLoading(true);
        const groups = await fetchProductsByGroup();
        var div = document.createElement('div');
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

        Object.keys(groups).forEach((key, index) => {
          const products = groups[key];
          div.innerHTML = renderToStaticMarkup(<PriceListPDF data={products} group={key} />);
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
        setPrintPDF(false);
        setPdfLoading(false);
      };
      fetch_product_data();
    }
  }, [printPDF]);

  return (
    <div className='card'>
      <div className='card-header'>
        <h3>Lista de precios por categoría</h3>
        <Button variant='primary' disabled={pdfLoading} onClick={() => setPrintPDF(true)}>
          {pdfLoading && (
            <div className='d-flex gap-1 align-items-center'>
              <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>
              <span>Imprimir</span>
              <span className='visually-hidden'>Loading...</span>
            </div>
          )}
          {!pdfLoading && <span>Imprimir</span>}
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
    </div>
  );
};

export default GroupStock;
