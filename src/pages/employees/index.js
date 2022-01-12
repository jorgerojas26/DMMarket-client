import { useState } from 'react';
import EmployeeSalesTable from 'employees/Table/Sales';
import EmployeeActions from 'employees/Actions';

const EmployeesPage = () => {
  const [employeeSales, setEmployeeSales] = useState([]);

  const onSubmit = (sales) => {
    setEmployeeSales(sales);
  };

  return (
    <>
      <div className='row justify-content-center'>
        <div className='col-sm-12 col-xl-8'>
          <EmployeeActions onDateSubmit={onSubmit} />
          <EmployeeSalesTable data={employeeSales} />
        </div>
      </div>
    </>
  );
};

export default EmployeesPage;
