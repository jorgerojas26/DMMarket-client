import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProvidersTable from '../index';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock the ShowNoeContext
jest.mock('context/show_noe', () => ({
  ShowNoeContext: {
    Consumer: ({ children }) => children({ showNoe: false, setShowNoe: jest.fn() }),
  },
  useContext: jest.fn(),
  useCallback: (fn) => fn,
}));

// Mock useContext to return the context value
const mockUseContext = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: () => ({ showNoe: false, setShowNoe: jest.fn() }),
}));

const mockProvidersData = {
  data: [
    {
      IdProveedor: 1,
      Empresa: 'Proveedor A',
      total_compras: 1000.50,
      num_compras: 5,
      total_ventas: 2000.75,
      num_ventas: 10,
    },
    {
      IdProveedor: 2,
      Empresa: 'Proveedor B',
      total_compras: 500.00,
      num_compras: 2,
      total_ventas: 1500.25,
      num_ventas: 8,
    },
  ],
  total: 2,
  page: 1,
  limit: 20,
};

describe('ProvidersTable', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(mockProvidersData),
    });
  });

  it('renders the table with 6 columns', async () => {
    await act(async () => {
      render(<ProvidersTable />);
    });

    await waitFor(() => {
      expect(screen.getByText('Proveedores')).toBeInTheDocument();
    });

    expect(screen.getByText('IdProveedor')).toBeInTheDocument();
    expect(screen.getByText('Empresa')).toBeInTheDocument();
    expect(screen.getByText('Total Compras')).toBeInTheDocument();
    expect(screen.getByText('# Compras')).toBeInTheDocument();
    expect(screen.getByText('Total Ventas')).toBeInTheDocument();
    expect(screen.getByText('# Ventas')).toBeInTheDocument();
  });

  it('renders provider data rows', async () => {
    await act(async () => {
      render(<ProvidersTable />);
    });

    await waitFor(() => {
      expect(screen.getByText('Proveedor A')).toBeInTheDocument();
      expect(screen.getByText('Proveedor B')).toBeInTheDocument();
    });
  });

  it('shows spinner during loading', async () => {
    // Make fetch return a promise that doesn't resolve immediately
    mockFetch.mockImplementationOnce(() => new Promise(() => {}));

    let container;
    await act(async () => {
      const renderResult = render(<ProvidersTable />);
      container = renderResult.container;
    });

    // The spinner has aria-hidden="true" so use container query
    expect(container.querySelector('.spinner-border')).toBeInTheDocument();
  });

  it('shows "Sin datos" when no data', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ data: [], total: 0, page: 1, limit: 20 }),
    });

    await act(async () => {
      render(<ProvidersTable />);
    });

    await waitFor(() => {
      expect(screen.getByText('Sin datos')).toBeInTheDocument();
    });
  });

  it('calls onRowSelect when a row is clicked', async () => {
    const onRowSelect = jest.fn();

    await act(async () => {
      render(<ProvidersTable onRowSelect={onRowSelect} />);
    });

    await waitFor(() => {
      expect(screen.getByText('Proveedor A')).toBeInTheDocument();
    });

    await act(async () => {
      userEvent.click(screen.getByText('Proveedor A'));
    });

    expect(onRowSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        IdProveedor: 1,
        Empresa: 'Proveedor A',
      })
    );
  });

  it('highlights selected row on click', async () => {
    await act(async () => {
      render(<ProvidersTable />);
    });

    await waitFor(() => {
      expect(screen.getByText('Proveedor A')).toBeInTheDocument();
    });

    const row = screen.getByText('Proveedor A').closest('tr');
    expect(row).not.toBeNull();

    await act(async () => {
      userEvent.click(screen.getByText('Proveedor A'));
    });

    expect(row).toHaveClass('providers-table__row--selected');
  });

  it('renders search input', async () => {
    await act(async () => {
      render(<ProvidersTable />);
    });

    expect(
      screen.getByPlaceholderText('Buscar por empresa...')
    ).toBeInTheDocument();
  });

  it('formats currency values correctly', async () => {
    await act(async () => {
      render(<ProvidersTable />);
    });

    await waitFor(() => {
      expect(screen.getByText('$1000.50')).toBeInTheDocument();
      expect(screen.getByText('$2000.75')).toBeInTheDocument();
      expect(screen.getByText('$500.00')).toBeInTheDocument();
      expect(screen.getByText('$1500.25')).toBeInTheDocument();
    });
  });
});
