import {
    fetchProviderPurchases,
    fetchProviderSales,
    fetchProviderSummary,
    fetchPurchaseDetail,
    fetchSaleDetail,
} from "api/providers";
import DateRangePicker from "components/DateRangePicker";
import { ShowNoeContext } from "context/show_noe";
import { DateTime } from "luxon";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useContext, useEffect, useMemo, useState } from "react";
import { Badge, Modal, Spinner } from "react-bootstrap";
import PurchaseDetailModal from "./PurchaseDetailModal";
import SaleDetailModal from "./SaleDetailModal";
import "./styles.css";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const LIMIT = 20;

const IconSales = () => (
    <svg
        width="38"
        height="38"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);

const IconHash = () => (
    <svg
        width="38"
        height="38"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="4" y1="9" x2="20" y2="9" />
        <line x1="4" y1="15" x2="20" y2="15" />
        <line x1="10" y1="3" x2="8" y2="21" />
        <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
);

const IconTicket = () => (
    <svg
        width="38"
        height="38"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9" />
        <path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
        <line x1="12" y1="2" x2="12" y2="22" />
    </svg>
);

const IconUserStar = () => (
    <svg
        width="38"
        height="38"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <polygon points="17 3 18.2 5.5 21 5.9 19 7.9 19.4 10.7 17 9.4 14.6 10.7 15 7.9 13 5.9 15.8 5.5 17 3" />
    </svg>
);

const StatCard = ({ label, value, variant, icon: Icon, loading }) => (
    <div className={`provider-stat-card ${variant}`}>
        <div className="provider-stat-icon">
            <Icon />
        </div>
        <div className="provider-stat-label">{label}</div>
        <div className="provider-stat-value">
            {loading ? <Spinner animation="border" size="sm" /> : value}
        </div>
    </div>
);

const ProviderDashboardModal = ({ show, onClose, provider }) => {
    const { showNoe } = useContext(ShowNoeContext);

    const today = DateTime.now().toISODate();
    const oneMonthAgo = DateTime.now().minus({ months: 1 }).toISODate();

    const [dateRange, setDateRange] = useState({
        from: oneMonthAgo,
        to: today,
    });
    const [summary, setSummary] = useState({
        totalCompras: 0,
        numCompras: 0,
        totalVentas: 0,
        numVentas: 0,
        bestSeller: null,
    });
    const [purchasesData, setPurchasesData] = useState({ data: [], total: 0 });
    const [salesData, setSalesData] = useState({ data: [], total: 0 });
    const [purchasesPage, setPurchasesPage] = useState(1);
    const [salesPage, setSalesPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [purchasesLoading, setPurchasesLoading] = useState(false);
    const [salesLoading, setSalesLoading] = useState(false);

    // Purchase detail sub-modal
    const [detailModalShow, setDetailModalShow] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);

    // Sale detail sub-modal
    const [saleDetailModalShow, setSaleDetailModalShow] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);

    // Reset state when modal opens
    useEffect(() => {
        if (show) {
            setDateRange({ from: oneMonthAgo, to: today });
            setPurchasesPage(1);
            setSalesPage(1);
            setSummary({
                totalCompras: 0,
                numCompras: 0,
                totalVentas: 0,
                numVentas: 0,
                bestSeller: null,
            });
            setPurchasesData({ data: [], total: 0 });
            setSalesData({ data: [], total: 0 });
            setDetailModalShow(false);
            setSelectedPurchase(null);
            setSaleDetailModalShow(false);
            setSelectedSale(null);
        }
    }, [show]);

    // Fetch summary
    useEffect(() => {
        if (!show || !provider?.IdProveedor) return;

        const doFetch = async () => {
            setLoading(true);
            try {
                const result = await fetchProviderSummary(
                    provider.IdProveedor,
                    {
                        from: dateRange.from,
                        to: dateRange.to,
                        showNoe,
                    },
                );
                setSummary({
                    totalCompras: result.totalCompras ?? 0,
                    numCompras: result.numCompras ?? 0,
                    totalVentas: result.totalVentas ?? 0,
                    numVentas: result.numVentas ?? 0,
                    bestSeller: result.bestSeller ?? null,
                });
            } catch (err) {
                console.error("Failed to fetch provider summary:", err);
                setSummary({
                    totalCompras: 0,
                    numCompras: 0,
                    totalVentas: 0,
                    numVentas: 0,
                    bestSeller: null,
                });
            } finally {
                setLoading(false);
            }
        };

        doFetch();
    }, [show, provider?.IdProveedor, dateRange, showNoe]);

    // Fetch purchases (paginated)
    useEffect(() => {
        if (!show || !provider?.IdProveedor) return;

        const doFetch = async () => {
            setPurchasesLoading(true);
            try {
                const result = await fetchProviderPurchases(
                    provider.IdProveedor,
                    {
                        from: dateRange.from,
                        to: dateRange.to,
                        page: purchasesPage,
                        limit: LIMIT,
                    },
                );
                setPurchasesData({
                    data: result.data || [],
                    total: result.total || 0,
                });
            } catch (err) {
                console.error("Failed to fetch provider purchases:", err);
                setPurchasesData({ data: [], total: 0 });
            } finally {
                setPurchasesLoading(false);
            }
        };

        doFetch();
    }, [show, provider?.IdProveedor, dateRange, purchasesPage]);

    // Fetch sales (paginated)
    useEffect(() => {
        if (!show || !provider?.IdProveedor) return;

        const doFetch = async () => {
            setSalesLoading(true);
            try {
                const result = await fetchProviderSales(provider.IdProveedor, {
                    from: dateRange.from,
                    to: dateRange.to,
                    page: salesPage,
                    limit: LIMIT,
                    showNoe,
                });
                setSalesData({
                    data: result.data || [],
                    total: result.total || 0,
                });
            } catch (err) {
                console.error("Failed to fetch provider sales:", err);
                setSalesData({ data: [], total: 0 });
            } finally {
                setSalesLoading(false);
            }
        };

        doFetch();
    }, [show, provider?.IdProveedor, dateRange, salesPage, showNoe]);

    const handleDateRangeChange = ({ from, to }) => {
        setDateRange({ from, to });
        setPurchasesPage(1);
        setSalesPage(1);
    };

    const handlePurchaseRowClick = async (purchase) => {
        try {
            const detail = await fetchPurchaseDetail(
                provider.IdProveedor,
                purchase.idFactura,
            );
            setSelectedPurchase(detail);
            setDetailModalShow(true);
        } catch (err) {
            console.error("Failed to fetch purchase detail:", err);
        }
    };

    const handleSaleRowClick = async (sale, e) => {
        try {
            const detail = await fetchSaleDetail(
                provider.IdProveedor,
                sale.idFactura,
                showNoe,
            );
            setSelectedSale(detail);
            setSaleDetailModalShow(true);
        } catch (err) {
            console.error("Failed to fetch sale detail:", err);
        }
    };

    const handlePrintPurchase = async (purchase, e) => {
        e.stopPropagation();
        try {
            const detail = await fetchPurchaseDetail(
                provider.IdProveedor,
                purchase.idFactura,
            );
            const rows = detail.productos.map((p) => [
                p.descripcion,
                String(Number(p.cantidad)),
                formatCurrency(p.precio),
                formatCurrency(p.subtotal),
            ]);
            const docDef = {
                content: [
                    { text: "ALIMENTOS DM MARKET, C.A.", style: "header" },
                    {
                        text: "CALLE ILUSTRES PROCERES LOCAL NRO S/N SECTOR CENTRO ALTAGRACIA DE ORITUCO DE ORITUCO ZONA POSTAL 2320.",
                        style: "header",
                    },
                    { text: "R.I.F.: J-41270446-0", style: "header" },
                    {
                        text: DateTime.fromISO(detail.fecha).toFormat(
                            "dd/MM/yyyy",
                        ),
                        style: "header",
                    },
                    {
                        text: `Factura de compra: ${detail.idFactura}`,
                        style: "subheader",
                    },
                    {
                        text: `Proveedor: ${provider.Empresa}`,
                        style: "subheader",
                        margin: [0, 0, 0, 12],
                    },
                    {
                        style: "table",
                        table: {
                            widths: ["*", "auto", "auto", "auto"],
                            body: [
                                [
                                    "Descripción",
                                    "Cantidad",
                                    "Precio",
                                    "Subtotal",
                                ],
                                ...rows,
                                [
                                    "",
                                    "",
                                    { text: "Total", bold: true },
                                    {
                                        text: formatCurrency(detail.total),
                                        bold: true,
                                    },
                                ],
                            ],
                        },
                    },
                ],
                styles: {
                    header: { alignment: "center", fontSize: 10 },
                    subheader: {
                        alignment: "center",
                        fontSize: 9,
                        margin: [0, 4, 0, 2],
                    },
                    table: { margin: [0, 10, 0, 0], fontSize: 8 },
                },
                pageMargins: 40,
                pageSize: "LETTER",
            };
            pdfMake.createPdf(docDef).open();
        } catch (err) {
            console.error("Failed to print purchase:", err);
        }
    };

    const handlePrintAllPurchases = async () => {
        try {
            const result = await fetchProviderPurchases(provider.IdProveedor, {
                from: dateRange.from,
                to: dateRange.to,
                page: 1,
                limit: purchasesData.total || 9999,
            });
            const invoices = result.data || [];

            const tables = [];
            for (const inv of invoices) {
                const detail = await fetchPurchaseDetail(
                    provider.IdProveedor,
                    inv.idFactura,
                );
                const rows = detail.productos.map((p) => [
                    p.descripcion,
                    String(Number(p.cantidad)),
                    formatCurrency(p.precio),
                    formatCurrency(p.subtotal),
                ]);
                tables.push(
                    {
                        text: `Factura: ${detail.idFactura} — ${DateTime.fromISO(detail.fecha).toFormat("dd/MM/yyyy")}`,
                        style: "invoiceTitle",
                        margin: [0, 14, 0, 4],
                    },
                    {
                        style: "table",
                        table: {
                            widths: ["*", "auto", "auto", "auto"],
                            body: [
                                [
                                    "Descripción",
                                    "Cantidad",
                                    "Precio",
                                    "Subtotal",
                                ],
                                ...rows,
                                [
                                    "",
                                    "",
                                    { text: "Total", bold: true },
                                    {
                                        text: formatCurrency(detail.total),
                                        bold: true,
                                    },
                                ],
                            ],
                        },
                    },
                );
            }

            const docDef = {
                content: [
                    { text: "ALIMENTOS DM MARKET, C.A.", style: "header" },
                    {
                        text: "CALLE ILUSTRES PROCERES LOCAL NRO S/N SECTOR CENTRO ALTAGRACIA DE ORITUCO DE ORITUCO ZONA POSTAL 2320.",
                        style: "header",
                    },
                    { text: "R.I.F.: J-41270446-0", style: "header" },
                    {
                        text: `Compras a: ${provider.Empresa}`,
                        style: "subheader",
                    },
                    {
                        text: `Período: ${DateTime.fromISO(dateRange.from).toFormat("dd/MM/yyyy")} — ${DateTime.fromISO(dateRange.to).toFormat("dd/MM/yyyy")}`,
                        style: "subheader",
                        margin: [0, 0, 0, 10],
                    },
                    ...tables,
                ],
                styles: {
                    header: { alignment: "center", fontSize: 10 },
                    subheader: {
                        alignment: "center",
                        fontSize: 9,
                        margin: [0, 2, 0, 2],
                    },
                    invoiceTitle: { fontSize: 9, bold: true },
                    table: { margin: [0, 4, 0, 8], fontSize: 8 },
                },
                pageMargins: 40,
                pageSize: "LETTER",
            };
            pdfMake.createPdf(docDef).open();
        } catch (err) {
            console.error("Failed to print all purchases:", err);
        }
    };

    const purchasesTotalPages = Math.ceil(purchasesData.total / LIMIT);
    const salesTotalPages = Math.ceil(salesData.total / LIMIT);

    const formatCurrency = (value) => {
        const num = Number(value);
        if (isNaN(num)) return "$0.00";
        return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const stats = useMemo(
        () => [
            {
                label: "Total Compras",
                value: formatCurrency(summary.totalCompras),
                variant: "primary",
                icon: IconSales,
            },
            {
                label: "# Compras",
                value: String(summary.numCompras || "0"),
                variant: "success",
                icon: IconHash,
            },
            {
                label: "Total Ventas",
                value: formatCurrency(summary.totalVentas),
                variant: "info",
                icon: IconTicket,
            },
            {
                label: "Mejor Vendedor",
                value: summary.bestSeller || "N/A",
                variant: "warning",
                icon: IconUserStar,
            },
        ],
        [summary],
    );

    const avatarLetter = provider?.Empresa
        ? provider.Empresa.charAt(0).toUpperCase()
        : "P";

    // Purchases table block
    const purchasesBlock = (
        <div className="provider-sales-card">
            <div className="provider-card-header">
                <h5>Compras</h5>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Badge bg="secondary" pill>
                        {purchasesData.total} registros
                    </Badge>
                    <button
                        className="btn btn-sm btn-outline-light"
                        onClick={handlePrintAllPurchases}
                        title="Imprimir todas las compras del período"
                    >
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 6 2 18 2 18 9" />
                            <path d="M6 12H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2" />
                            <rect x="6" y="14" width="12" height="8" />
                        </svg>{" "}
                        Imprimir
                    </button>
                </div>
            </div>
            <div className="provider-card-body">
                <div className="provider-table-container">
                    <table className="provider-table">
                        <thead>
                            <tr>
                                <th>IdFactura</th>
                                <th>Fecha</th>
                                <th className="text-end">Monto</th>
                                <th
                                    className="text-center"
                                    style={{ width: 50 }}
                                >
                                    Imprimir
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchasesData.data.length > 0
                                ? purchasesData.data.map((purchase) => (
                                      <tr
                                          key={purchase.idFactura}
                                          onClick={() =>
                                              handlePurchaseRowClick(purchase)
                                          }
                                          style={{ cursor: "pointer" }}
                                      >
                                          <td>{purchase.idFactura}</td>
                                          <td>
                                              {DateTime.fromISO(
                                                  purchase.fecha,
                                              ).toFormat("dd MMM yyyy", {
                                                  locale: "es",
                                              })}
                                          </td>
                                          <td className="text-end provider-amount">
                                              {formatCurrency(purchase.monto)}
                                          </td>
                                          <td className="text-center">
                                              <button
                                                  className="btn btn-sm btn-outline-light"
                                                  onClick={(e) =>
                                                      handlePrintPurchase(
                                                          purchase,
                                                          e,
                                                      )
                                                  }
                                                  title="Imprimir factura"
                                              >
                                                  <svg
                                                      width="14"
                                                      height="14"
                                                      viewBox="0 0 24 24"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      strokeWidth="2"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                  >
                                                      <polyline points="6 9 6 2 18 2 18 9" />
                                                      <path d="M6 12H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2" />
                                                      <rect
                                                          x="6"
                                                          y="14"
                                                          width="12"
                                                          height="8"
                                                      />
                                                  </svg>
                                              </button>
                                          </td>
                                      </tr>
                                  ))
                                : !purchasesLoading && (
                                      <tr>
                                          <td colSpan={4}>
                                              <div className="provider-empty-state">
                                                  <svg
                                                      width="40"
                                                      height="40"
                                                      viewBox="0 0 24 24"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      strokeWidth="1.5"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                  >
                                                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                                                      <polyline points="13 2 13 9 20 9" />
                                                  </svg>
                                                  <span>
                                                      Sin compras en este
                                                      período
                                                  </span>
                                              </div>
                                          </td>
                                      </tr>
                                  )}
                        </tbody>
                    </table>
                </div>
                {purchasesLoading && (
                    <div className="provider-loading-overlay">
                        <Spinner animation="border" variant="light" />
                    </div>
                )}
                {purchasesTotalPages > 1 && (
                    <div className="provider-pagination-bar">
                        <button
                            className="btn btn-sm btn-outline-light"
                            disabled={purchasesPage <= 1}
                            onClick={() => setPurchasesPage((p) => p - 1)}
                        >
                            Anterior
                        </button>
                        <span>
                            Página {purchasesPage} de {purchasesTotalPages}
                        </span>
                        <button
                            className="btn btn-sm btn-outline-light"
                            disabled={purchasesPage >= purchasesTotalPages}
                            onClick={() => setPurchasesPage((p) => p + 1)}
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    // Sales table block
    const salesBlock = (
        <div className="provider-sales-card">
            <div className="provider-card-header">
                <h5>Ventas</h5>
                <Badge bg="secondary" pill>
                    {salesData.total} registros
                </Badge>
            </div>
            <div className="provider-card-body">
                <div className="provider-table-container">
                    <table className="provider-table">
                        <thead>
                            <tr>
                                <th>IdFactura</th>
                                <th>Vendedor</th>
                                <th>Fecha</th>
                                <th className="text-end">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesData.data.length > 0
                                ? salesData.data.map((sale, index) => (
                                      <tr
                                          key={index}
                                          onClick={() =>
                                              handleSaleRowClick(sale)
                                          }
                                          style={{ cursor: "pointer" }}
                                      >
                                          <td>{sale.idFactura}</td>
                                          <td>{sale.vendedor}</td>
                                          <td>
                                              {DateTime.fromISO(
                                                  sale.fecha,
                                              ).toFormat("dd MMM yyyy", {
                                                  locale: "es",
                                              })}
                                          </td>
                                          <td className="text-end provider-amount">
                                              {formatCurrency(sale.monto)}
                                          </td>
                                      </tr>
                                  ))
                                : !salesLoading && (
                                      <tr>
                                          <td colSpan={4}>
                                              <div className="provider-empty-state">
                                                  <svg
                                                      width="40"
                                                      height="40"
                                                      viewBox="0 0 24 24"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      strokeWidth="1.5"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                  >
                                                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                                                      <polyline points="13 2 13 9 20 9" />
                                                  </svg>
                                                  <span>
                                                      Sin ventas en este período
                                                  </span>
                                              </div>
                                          </td>
                                      </tr>
                                  )}
                        </tbody>
                    </table>
                </div>
                {salesLoading && (
                    <div className="provider-loading-overlay">
                        <Spinner animation="border" variant="light" />
                    </div>
                )}
                {salesTotalPages > 1 && (
                    <div className="provider-pagination-bar">
                        <button
                            className="btn btn-sm btn-outline-light"
                            disabled={salesPage <= 1}
                            onClick={() => setSalesPage((p) => p - 1)}
                        >
                            Anterior
                        </button>
                        <span>
                            Página {salesPage} de {salesTotalPages}
                        </span>
                        <button
                            className="btn btn-sm btn-outline-light"
                            disabled={salesPage >= salesTotalPages}
                            onClick={() => setSalesPage((p) => p + 1)}
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <Modal
                show={show}
                size="xl"
                onHide={onClose}
                backdrop="static"
                scrollable
                className="provider-dashboard-modal"
            >
                <Modal.Header closeButton>
                    <div className="d-flex align-items-center gap-3">
                        <div className="provider-avatar">{avatarLetter}</div>
                        <div>
                            <Modal.Title>{provider?.Empresa}</Modal.Title>
                            <div className="provider-modal-subtitle">
                                Proveedor #{provider?.IdProveedor}
                            </div>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="provider-date-picker-card">
                        <div className="provider-date-picker-label">
                            Rango de fechas
                        </div>
                        <DateRangePicker
                            key={provider?.IdProveedor || "picker"}
                            initialFrom={oneMonthAgo}
                            initialTo={today}
                            onChange={handleDateRangeChange}
                        />
                    </div>

                    <div className="provider-stats-row">
                        {stats.map((stat) => (
                            <StatCard
                                key={stat.label}
                                {...stat}
                                loading={loading}
                            />
                        ))}
                    </div>

                    <div className="provider-dashboard-grid">
                        {purchasesBlock}
                        {salesBlock}
                    </div>
                </Modal.Body>
            </Modal>

            <PurchaseDetailModal
                show={detailModalShow}
                onClose={() => setDetailModalShow(false)}
                purchase={selectedPurchase}
            />

            <SaleDetailModal
                show={saleDetailModalShow}
                onClose={() => setSaleDetailModalShow(false)}
                sale={selectedSale}
            />
        </>
    );
};

export default ProviderDashboardModal;
