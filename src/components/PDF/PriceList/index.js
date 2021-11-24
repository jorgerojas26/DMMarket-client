const PriceListPDF = ({ data = [], group = "" }) => {
  return (
    <table id="price-list-table">
      <thead>
        <tr>
          <th>Categoría</th>
          <th>Producto</th>
          <th>Precio (USD)</th>
          <th>DISPONIBLE</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => {
          if (row.stock > 0) {
            return (
              <tr key={row.productId}>
                <td>{group}</td>
                <td>{row.product}</td>
                <td>{row.price}</td>
                <td>EN STOCK</td>
              </tr>
            );
          }
        })}
      </tbody>
    </table>
  );
};

export default PriceListPDF;
