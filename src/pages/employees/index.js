import EmployeeActions from "employees/Actions";
import EmployeeSalesTable from "employees/Table/Sales";
import { useState } from "react";

const EmployeesPage = () => {
    const [employeeSales, setEmployeeSales] = useState([]);

    const onSubmit = (sales) => {
        setEmployeeSales(sales);
    };

    return (
        <>
            <div className="row justify-content-center p-4">
                <div className="col-sm-12 col-xl-8">
                    <EmployeeActions onDateSubmit={onSubmit} />
                    <EmployeeSalesTable data={employeeSales} />
                </div>
            </div>
        </>
    );
};

export default EmployeesPage;
