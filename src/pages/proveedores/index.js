import { fetchBestProviders } from "api/providers";
import DateRangePicker from "components/DateRangePicker";
import ProviderDashboardModal from "components/ProviderDashboardModal";
import ProviderReportCard from "components/ProviderReportCard";
import ProvidersTable from "components/ProvidersTable";
import { ShowNoeContext } from "context/show_noe";
import debounce from "lodash.debounce";
import { DateTime } from "luxon";
import { useCallback, useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

const ProveedoresPage = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [dateRange, setDateRange] = useState({
        from: DateTime.now().startOf("month").toISODate(),
        to: DateTime.now().toISODate(),
    });
    const [loading, setLoading] = useState(false);
    const [activeView, setActiveView] = useState("reports");
    const [mode, setMode] = useState("ventas");
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const { showNoe } = useContext(ShowNoeContext);

    const onFilter = debounce((searchTerm) => {
        if (!searchTerm) {
            setFilteredData(data);
            return;
        }
        const filtered = data.filter((f) =>
            f.proveedor.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        setFilteredData(filtered);
    }, 500);

    const handleDateRangeChange = useCallback(
        async ({ from, to }) => {
            setLoading(true);
            const response = await fetchBestProviders(
                { from, to },
                showNoe,
                mode,
            );
            setDateRange({ from, to });
            setData(response);
            setFilteredData(response);
            setLoading(false);
        },
        [showNoe, mode],
    );

    useEffect(() => {
        handleDateRangeChange(dateRange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    const handleModeChange = useCallback((newMode) => {
        setMode(newMode);
    }, []);

    const onFilterCallback = useCallback(
        (searchTerm) => {
            onFilter(searchTerm);
        },
        [onFilter],
    );

    const handleProviderSelect = useCallback((provider) => {
        setSelectedProvider(provider);
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
                            <Nav.Link eventKey="providers">
                                Proveedores
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
                <div className="clientes-content p-4">
                    <div className={activeView === "providers" ? "" : "d-none"}>
                        <div className="clients-content-wrapper">
                            <ProvidersTable
                                onRowSelect={handleProviderSelect}
                            />
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
                                Reportes de proveedores
                            </h4>
                            <DateRangePicker
                                initialFrom={DateTime.now()
                                    .startOf("month")
                                    .toISODate()}
                                initialTo={DateTime.now().toISODate()}
                                onChange={handleDateRangeChange}
                            />
                        </div>
                        <div className="clients-content-wrapper">
                            <div className="row justify-content-center g-3">
                                <div className="col-12">
                                    <ProviderReportCard
                                        data={filteredData}
                                        onFilter={onFilterCallback}
                                        loading={loading}
                                        mode={mode}
                                        onModeChange={handleModeChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            {showModal && (
                <ProviderDashboardModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    provider={selectedProvider}
                />
            )}
        </Container>
    );
};

export default ProveedoresPage;
