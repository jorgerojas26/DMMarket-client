import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProviderReportCard from '../index';

const mockData = [
  { proveedor: 'Proveedor A', monto: 15000.5 },
  { proveedor: 'Proveedor B', monto: 12000.0 },
  { proveedor: 'Proveedor C', monto: 8000.75 },
];

describe('ProviderReportCard', () => {
  it('renders the card title', () => {
    render(
      <ProviderReportCard
        loading={false}
        data={mockData}
        onFilter={jest.fn()}
        mode='ventas'
        onModeChange={jest.fn()}
      />
    );

    expect(screen.getByText('Mejores Proveedores')).toBeInTheDocument();
  });

  it('renders the toggle pills for Ventas and Compras', () => {
    render(
      <ProviderReportCard
        loading={false}
        data={mockData}
        onFilter={jest.fn()}
        mode='ventas'
        onModeChange={jest.fn()}
      />
    );

    expect(screen.getByText('Ventas')).toBeInTheDocument();
    expect(screen.getByText('Compras')).toBeInTheDocument();
  });

  it('renders the ranked list of providers', () => {
    render(
      <ProviderReportCard
        loading={false}
        data={mockData}
        onFilter={jest.fn()}
        mode='ventas'
        onModeChange={jest.fn()}
      />
    );

    expect(screen.getByText('Proveedor A')).toBeInTheDocument();
    expect(screen.getByText('Proveedor B')).toBeInTheDocument();
    expect(screen.getByText('Proveedor C')).toBeInTheDocument();
  });

  it('shows formatted monto values', () => {
    render(
      <ProviderReportCard
        loading={false}
        data={mockData}
        onFilter={jest.fn()}
        mode='ventas'
        onModeChange={jest.fn()}
      />
    );

    // 15000.5 formatted with locale
    expect(screen.getByText(/\$15,000\.5/)).toBeInTheDocument();
  });

  it('shows search input when data is present', () => {
    render(
      <ProviderReportCard
        loading={false}
        data={mockData}
        onFilter={jest.fn()}
        mode='ventas'
        onModeChange={jest.fn()}
      />
    );

    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
  });

  it('calls onFilter when typing in search', () => {
    const onFilter = jest.fn();
    render(
      <ProviderReportCard
        loading={false}
        data={mockData}
        onFilter={onFilter}
        mode='ventas'
        onModeChange={jest.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText('Buscar...');
    fireEvent.change(searchInput, { target: { value: 'Proveedor A' } });

    expect(onFilter).toHaveBeenCalledWith('Proveedor A');
  });

  it('shows spinner when loading', () => {
    render(
      <ProviderReportCard
        loading={true}
        data={[]}
        onFilter={jest.fn()}
        mode='ventas'
        onModeChange={jest.fn()}
      />
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows empty state when no data and not loading', () => {
    render(
      <ProviderReportCard
        loading={false}
        data={[]}
        onFilter={jest.fn()}
        mode='ventas'
        onModeChange={jest.fn()}
      />
    );

    expect(screen.getByText('Sin datos')).toBeInTheDocument();
  });

  it('calls onModeChange when toggling mode', () => {
    const onModeChange = jest.fn();
    render(
      <ProviderReportCard
        loading={false}
        data={mockData}
        onFilter={jest.fn()}
        mode='ventas'
        onModeChange={onModeChange}
      />
    );

    fireEvent.click(screen.getByText('Compras'));

    expect(onModeChange).toHaveBeenCalled();
    expect(onModeChange.mock.calls[0][0]).toBe('compras');
  });

  it('does not show search input when data is empty', () => {
    render(
      <ProviderReportCard
        loading={false}
        data={[]}
        onFilter={jest.fn()}
        mode='ventas'
        onModeChange={jest.fn()}
      />
    );

    expect(screen.queryByPlaceholderText('Buscar...')).not.toBeInTheDocument();
  });
});
