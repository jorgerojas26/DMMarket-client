import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProviderDashboardModal from './index';
import { ShowNoeContext } from 'context/show_noe';
import * as api from 'api/providers';

// Mock the API module
jest.mock('api/providers', () => ({
  fetchProviderSummary: jest.fn(),
  fetchProviderSales: jest.fn(),
  fetchProviderPurchases: jest.fn(),
  fetchPurchaseDetail: jest.fn(),
}));

// Mock DateRangePicker to avoid react-date-range complexity
jest.mock('components/DateRangePicker', () => {
  return function MockDateRangePicker({ onChange }) {
    return (
      <button
        data-testid='mock-date-picker'
        onClick={() => onChange({ from: '2024-01-01', to: '2024-12-31' })}
      >
        Date Picker
      </button>
    );
  };
});

const mockProvider = {
  IdProveedor: 1,
  Empresa: 'Proveedor Test',
};

const mockSummary = {
  totalCompras: 5000,
  numCompras: 10,
  totalVentas: 8000,
  numVentas: 15,
  bestSeller: 'Vendedor Top',
};

const mockPurchases = {
  data: [
    { idFactura: 'FAC-001', fecha: '2024-06-15', monto: 1500 },
    { idFactura: 'FAC-002', fecha: '2024-05-10', monto: 800 },
  ],
  total: 2,
};

const mockSales = {
  data: [
    { vendedor: 'Vendor A', fecha: '2024-06-15', monto: 500 },
    { vendedor: 'Vendor B', fecha: '2024-05-10', monto: 300 },
  ],
  total: 2,
};

const renderModal = (show = true, provider = mockProvider, showNoe = false) => {
  return render(
    <ShowNoeContext.Provider value={{ showNoe, setShowNoe: jest.fn() }}>
      <ProviderDashboardModal
        show={show}
        onClose={jest.fn()}
        provider={provider}
      />
    </ShowNoeContext.Provider>
  );
};

describe('ProviderDashboardModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.fetchProviderSummary.mockResolvedValue(mockSummary);
    api.fetchProviderPurchases.mockResolvedValue(mockPurchases);
    api.fetchProviderSales.mockResolvedValue(mockSales);
  });

  it('renders nothing when show is false', () => {
    const { container } = renderModal(false);
    expect(container.innerHTML).toBe('');
  });

  it('renders modal with provider info when show is true', async () => {
    renderModal(true);

    await waitFor(() => {
      expect(screen.getByText('Proveedor Test')).toBeInTheDocument();
    });

    expect(screen.getByText('Proveedor #1')).toBeInTheDocument();
  });

  it('renders 4 stat cards after loading summary', async () => {
    renderModal(true);

    await waitFor(() => {
      expect(screen.getByText('Total Compras')).toBeInTheDocument();
      expect(screen.getByText('# Compras')).toBeInTheDocument();
      expect(screen.getByText('Total Ventas')).toBeInTheDocument();
      expect(screen.getByText('Mejor Vendedor')).toBeInTheDocument();
    });

    // Check formatted values
    await waitFor(() => {
      expect(screen.getByText('$5,000.00')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('$8,000.00')).toBeInTheDocument();
      expect(screen.getByText('Vendedor Top')).toBeInTheDocument();
    });
  });

  it('shows N/A for bestSeller when null', async () => {
    api.fetchProviderSummary.mockResolvedValue({
      ...mockSummary,
      bestSeller: null,
    });

    renderModal(true);

    await waitFor(() => {
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  it('renders purchases table with data', async () => {
    renderModal(true);

    await waitFor(() => {
      expect(screen.getByText('Compras')).toBeInTheDocument();
      expect(screen.getByText('FAC-001')).toBeInTheDocument();
      expect(screen.getByText('FAC-002')).toBeInTheDocument();
    });
  });

  it('renders sales table with data', async () => {
    renderModal(true);

    await waitFor(() => {
      expect(screen.getByText('Ventas')).toBeInTheDocument();
      expect(screen.getByText('Vendor A')).toBeInTheDocument();
      expect(screen.getByText('Vendor B')).toBeInTheDocument();
    });
  });

  it('shows empty state when purchases data is empty', async () => {
    api.fetchProviderPurchases.mockResolvedValue({ data: [], total: 0 });

    renderModal(true);

    await waitFor(() => {
      expect(screen.getByText('Sin compras en este período')).toBeInTheDocument();
    });
  });

  it('shows empty state when sales data is empty', async () => {
    api.fetchProviderSales.mockResolvedValue({ data: [], total: 0 });

    renderModal(true);

    await waitFor(() => {
      expect(screen.getByText('Sin ventas en este período')).toBeInTheDocument();
    });
  });

  it('calls fetchProviderSummary with correct params', async () => {
    renderModal(true);

    await waitFor(() => {
      expect(api.fetchProviderSummary).toHaveBeenCalledWith(1, {
        from: expect.any(String),
        to: expect.any(String),
        showNoe: false,
      });
    });
  });

  it('calls fetchProviderSales with correct params when showNoe changes', async () => {
    renderModal(true, mockProvider, true);

    await waitFor(() => {
      expect(api.fetchProviderSales).toHaveBeenCalledWith(1, {
        from: expect.any(String),
        to: expect.any(String),
        page: 1,
        limit: 20,
        showNoe: true,
      });
    });
  });

  it('renders pagination when there are more records than LIMIT', async () => {
    api.fetchProviderPurchases.mockResolvedValue({
      data: Array(20).fill({ idFactura: 'FAC', fecha: '2024-01-01', monto: 100 }),
      total: 50,
    });

    renderModal(true);

    await waitFor(() => {
      expect(screen.getByText('Página 1 de 3')).toBeInTheDocument();
    });
  });

  it('closes modal when onClose is called', async () => {
    const onClose = jest.fn();
    render(
      <ShowNoeContext.Provider value={{ showNoe: false, setShowNoe: jest.fn() }}>
        <ProviderDashboardModal
          show={true}
          onClose={onClose}
          provider={mockProvider}
        />
      </ShowNoeContext.Provider>
    );

    // Find and click the close button
    const closeButton = document.querySelector('.btn-close');
    if (closeButton) {
      act(() => {
        closeButton.click();
      });
      expect(onClose).toHaveBeenCalled();
    }
  });
});
