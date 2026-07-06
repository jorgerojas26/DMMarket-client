import { render, screen } from '@testing-library/react';
import PurchaseDetailModal from './PurchaseDetailModal';

const mockPurchase = {
  idFactura: 'FAC-001',
  fecha: '2024-06-15',
  productos: [
    { descripcion: 'Producto A', cantidad: 10, precio: 50, subtotal: 500 },
    { descripcion: 'Producto B', cantidad: 5, precio: 100, subtotal: 500 },
  ],
  total: 1000,
};

const mockPurchaseUnique = {
  idFactura: 'FAC-002',
  fecha: '2024-06-20',
  productos: [
    { descripcion: 'Producto C', cantidad: 3, precio: 75, subtotal: 225 },
    { descripcion: 'Producto D', cantidad: 7, precio: 45, subtotal: 315 },
  ],
  total: 540,
};

describe('PurchaseDetailModal', () => {
  it('renders nothing when show is false', () => {
    const { container } = render(
      <PurchaseDetailModal show={false} onClose={jest.fn()} purchase={mockPurchase} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders modal with purchase info when show is true', () => {
    render(
      <PurchaseDetailModal show={true} onClose={jest.fn()} purchase={mockPurchase} />
    );

    expect(screen.getByText('Factura #FAC-001')).toBeInTheDocument();
  });

  it('renders date in the subtitle', () => {
    render(
      <PurchaseDetailModal show={true} onClose={jest.fn()} purchase={mockPurchase} />
    );

    // Should show formatted date: "15 jun. 2024" (Spanish locale)
    expect(screen.getByText(/jun\.?\s*2024/)).toBeInTheDocument();
  });

  it('renders product rows in the table', () => {
    render(
      <PurchaseDetailModal show={true} onClose={jest.fn()} purchase={mockPurchase} />
    );

    expect(screen.getByText('Producto A')).toBeInTheDocument();
    expect(screen.getByText('Producto B')).toBeInTheDocument();
  });

  it('rendorrect product quantities and prices', () => {
    render(
      <PurchaseDetailModal show={true} onClose={jest.fn()} purchase={mockPurchase} />
    );

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders subtotals for each product', () => {
    render(
      <PurchaseDetailModal show={true} onClose={jest.fn()} purchase={mockPurchaseUnique} />
    );

    expect(screen.getByText('$225.00')).toBeInTheDocument();
    expect(screen.getByText('$315.00')).toBeInTheDocument();
  });

  it('renders total amount at the bottom', () => {
    render(
      <PurchaseDetailModal show={true} onClose={jest.fn()} purchase={mockPurchase} />
    );

    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
  });

  it('shows loading spinner when purchase is null', () => {
    render(
      <PurchaseDetailModal show={true} onClose={jest.fn()} purchase={null} />
    );

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('shows empty state when purchase has no products', () => {
    const emptyPurchase = {
      idFactura: 'FAC-002',
      fecha: '2024-06-20',
      productos: [],
      total: 0,
    };

    render(
      <PurchaseDetailModal show={true} onClose={jest.fn()} purchase={emptyPurchase} />
    );

    expect(screen.getByText('Sin productos en esta factura')).toBeInTheDocument();
  });

  it('renders table headers correctly', () => {
    render(
      <PurchaseDetailModal show={true} onClose={jest.fn()} purchase={mockPurchase} />
    );

    expect(screen.getByText('Descripción')).toBeInTheDocument();
    expect(screen.getByText('Cantidad')).toBeInTheDocument();
    expect(screen.getByText('Precio')).toBeInTheDocument();
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
  });
});
