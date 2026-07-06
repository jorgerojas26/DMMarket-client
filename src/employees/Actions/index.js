import { getEmployeeSales } from "api/employees";
import DateRangePicker from "components/DateRangePicker";
import { ShowNoeContext } from "context/show_noe";
import CommissionModal from "employees/Modal/Commission";
import EmployeeSearch from "employees/Search";
import { DateTime } from "luxon";
import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const EmployeeActions = ({ onDateSubmit }) => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showCommissionModal, setShowCommissionModal] = useState(false);
    const [dateRange, setDateRange] = useState({
        from: DateTime.now().startOf("month").toISODate(),
        to: DateTime.now().toISODate(),
    });
    const { showNoe } = useContext(ShowNoeContext);

    const handleDateRangeChange = ({ from, to }) => {
        setDateRange({ from, to });
        if (selectedEmployee) {
            getEmployeeSales(selectedEmployee.id, { from, to }, showNoe).then(
                (response) => {
                    onDateSubmit(response);
                },
            );
        }
    };

    useEffect(() => {
        if (selectedEmployee) {
            handleDateRangeChange(dateRange);
        }
    }, [selectedEmployee]);

    return (
        <>
            <div className="col-12 mb-4">
                <div className="row justify-content-end">
                    <div className="d-flex flex-column flex-md-row justify-content-center gap-4">
                        <div className="d-flex flex-grow-1 gap-4">
                            <div className="flex-grow-1">
                                <EmployeeSearch
                                    onSelect={setSelectedEmployee}
                                />
                            </div>
                            <Button
                                variant="primary"
                                disabled={!selectedEmployee}
                                onClick={() => setShowCommissionModal(true)}
                            >
                                Asignar comisión
                            </Button>
                        </div>

                        <div className="d-flex justify-content-center">
                            <DateRangePicker
                                initialFrom={DateTime.now()
                                    .startOf("month")
                                    .toISODate()}
                                initialTo={DateTime.now().toISODate()}
                                onChange={handleDateRangeChange}
                            />
                        </div>
                    </div>
                </div>
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
