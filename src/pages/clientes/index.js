import { fetchBestClients } from "api/clients";
import ClientReportCard from "components/Cards/ClientReport";
import ClientDashboardModal from "components/ClientDashboardModal";
import ClientPerProductCard from "components/ClientPerProduct/Card";
import ClientsTable from "components/ClientsTable";
import DateRangePicker from "components/DateRangePicker";
import MonthlyAverageClientCard from "components/MonthlyAverageClient/Card";
import { ShowNoeContext } from "context/show_noe";
import debounce from "lodash.debounce";
import { DateTime } from "luxon";
import { useCallback, useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

const ClientesPage = () => {
    const [data, setData] = useState({
        filtered_best_clients: [],
        best_clients: [],
        group_sales_chart: [],
    });
    const [dateRange, setDateRange] = useState({
        from: DateTime.now().startOf('month').toISODate(),
        to: DateTime.now().toISODate(),
    });
    const [loading, setLoading] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeView, setActiveView] = useState("reports");

    const { showNoe } = useContext(ShowNoeContext);

    const onFilter = debounce((searchTerm) => {
        const filteredData = data.best_clients.filter((f) =>
            f.client.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        setData({ ...data, filtered_best_clients: filteredData });
    }, 500);

    const handleDateRangeChange = useCallback(async ({ from, to }) => {
        setLoading(true);
        const response = await fetchBestClients({ from, to }, showNoe);
        setDateRange({ from, to });
        setData((prev) => ({ ...prev, best_clients: response }));
        setLoading(false);
    }, [showNoe]);

    useEffect(() => {
        handleDateRangeChange(dateRange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRowSelect = useCallback((client) => {
        setSelectedClient(client);
        setShowModal(true);
    }, []);

    return (
        <Container fluid className="clientes-layout p-0">
            <div className="clientes-row">
                <div className="clients-sidebar mb-3 mb-md-0">
                    <Nav
                        variant="pills"
                        className="flex-row flex-md-column"
                        activeKey={activeView}
                        onSelect={setActiveView}
                    >
                        <Nav.Item>
                            <Nav.Link eventKey="reports">Reportes</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="clients">Clientes</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
                <div className="clientes-content p-4">
                    <div className={activeView === "clients" ? "" : "d-none"}>
                        <div className="clients-content-wrapper">
                            <ClientsTable onRowSelect={handleRowSelect} />
                        </div>
                    </div>
                    <section
                        className={
                            activeView === "reports"
                                ? "d-flex flex-column gap-3"
                                : "d-none"
                        }
                    >
                        <div className="clients-content-wrapper d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
                            <h4 className="m-0 text-light">
                                Reportes de clientes
                            </h4>
                            <DateRangePicker
                                initialFrom={DateTime.now().startOf('month').toISODate()}
                                initialTo={DateTime.now().toISODate()}
                                onChange={handleDateRangeChange}
                            />
                        </div>
                        <div className="clients-content-wrapper">
                            <div className="row justify-content-center g-3">
                                <div className="col-12 col-lg-6">
                                    <ClientReportCard
                                        data={
                                            data.filtered_best_clients.length >
                                            0
                                                ? data.filtered_best_clients
                                                : data.best_clients
                                        }
                                        onFilter={onFilter}
                                        loading={loading}
                                    />
                                </div>
                                <div className="col-12 col-lg-6">
                                    <ClientPerProductCard
                                        dateRange={dateRange}
                                    />
                                </div>
                            </div>
                            <div className="row justify-content-center g-3 mt-0">
                                <div className="col-12 col-lg-6">
                                    <MonthlyAverageClientCard />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <ClientDashboardModal
                show={showModal}
                onClose={() => setShowModal(false)}
                client={selectedClient}
            />
        </Container>
    );
};

export default ClientesPage;
