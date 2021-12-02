import { useState } from 'react';
import EmployeeSearch from 'employees/Search';
import { Button } from 'react-bootstrap';
import DatePicker from 'components/DatePicker';
import CommissionModal from 'employees/Modal/Commission';
import { getEmployeeSales } from 'api/employees';

const EmployeeActions = ({ onDateSubmit }) => {
  const [employeeSales, setEmployeeSales] = useState([]);
  const [employeeSalesLoading, setEmployeeSalesLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showCommissionModal, setShowCommissionModal] = useState(false);

  const submitDateHandler = (event, dateRange) => {
    event.preventDefault();
    if (selectedEmployee) {
      setEmployeeSalesLoading(true);
      getEmployeeSales(selectedEmployee.id, dateRange).then((response) => {
        setEmployeeSales(response);
        setEmployeeSalesLoading(false);
        onDateSubmit(response);
      });
    }
  };

  return (
    <>
      <div className='col-12 mb-4'>
        <div className='row justify-content-end'>
          <div className='col-6 mb-2'>
            <EmployeeSearch onSelect={setSelectedEmployee} />
          </div>
          <div className='col-4'>
            <Button variant='primary' disabled={!selectedEmployee} onClick={() => setShowCommissionModal(true)}>
              Asignar comisión
            </Button>
          </div>
        </div>
        <DatePicker onSubmit={submitDateHandler} loading={employeeSalesLoading} submitDisabled={!selectedEmployee} />
      </div>
      {showCommissionModal && (
        <CommissionModal
          show={showCommissionModal}
          onClose={() => setShowCommissionModal(false)}
          employee={selectedEmployee}
        />
      )}
    </>
  );
};

export default EmployeeActions;
