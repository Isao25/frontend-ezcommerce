import { render, screen, fireEvent } from '@testing-library/react';
import { PlanCard } from '@/components/Epica5/PlanCard';
import { BrowserRouter } from 'react-router-dom';

// Mock the trademark hook
const mockUseTrademark = jest.fn();
jest.mock('@/hooks/useTrademark', () => ({
  useTrademark: () => mockUseTrademark()
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    info: jest.fn()
  }
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PlanCard', () => {
  const mockPlan = {
    id: 1,
    nombre: 'plan premium',
    precio: 29.99,
    duracion: 1,
    espacio_extra: 50,
    descripcion: 'Plan premium con todas las funcionalidades',
    beneficios: [
      'Beneficio 1',
      'Beneficio 2',
      'Beneficio 3'
    ]
  };

  const mockPlanGratuito = {
    id: 0,
    nombre: 'plan gratuito',
    precio: 0,
    duracion: 0,
    espacio_extra: 0,
    descripcion: 'Plan gratuito básico',
    beneficios: [
      'Beneficio básico 1',
      'Beneficio básico 2'
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTrademark.mockReturnValue({
      marca: null,
      plan: null,
      setGratisModal: jest.fn()
    });
  });

  test('renders plan information correctly', () => {
    renderWithRouter(<PlanCard planCard={mockPlan} />);

    expect(screen.getByText('Plan Premium')).toBeInTheDocument();
    expect(screen.getByText('S/29.99.00')).toBeInTheDocument();
    expect(screen.getByText('por 1 mes')).toBeInTheDocument();
    expect(screen.getByText('Plan premium con todas las funcionalidades')).toBeInTheDocument();
    expect(screen.getByText('Seleccionar plan')).toBeInTheDocument();
  });

  test('renders free plan correctly', () => {
    renderWithRouter(<PlanCard planCard={mockPlanGratuito} />);

    expect(screen.getByText('Plan Gratuito')).toBeInTheDocument();
    expect(screen.getByText('S/0.00')).toBeInTheDocument();
    expect(screen.queryByText('por')).not.toBeInTheDocument(); // No duration text for free plan
  });

  test('displays beneficios correctly', () => {
    renderWithRouter(<PlanCard planCard={mockPlan} />);

    expect(screen.getByText('Beneficios:')).toBeInTheDocument();
    expect(screen.getByText('Beneficio 1')).toBeInTheDocument();
    expect(screen.getByText('Beneficio 2')).toBeInTheDocument();
    expect(screen.getByText('Beneficio 3')).toBeInTheDocument();
  });

  test('handles plan selection without marca', () => {
    renderWithRouter(<PlanCard planCard={mockPlan} />);

    const selectButton = screen.getByText('Seleccionar plan');
    fireEvent.click(selectButton);

    // Should navigate to register trademark for non-free plans without marca
    expect(mockNavigate).toHaveBeenCalledWith('/register-trademark');
    expect(localStorage.getItem('planSeleccionado')).toBe(JSON.stringify(mockPlan));
  });

  test('handles plan selection with existing marca', () => {
    const { toast } = require('sonner');
    
    mockUseTrademark.mockReturnValue({
      marca: { id: 1, nombre: 'Mi Marca' },
      plan: null,
      setGratisModal: jest.fn()
    });

    renderWithRouter(<PlanCard planCard={mockPlan} />);

    const selectButton = screen.getByText('Seleccionar plan');
    fireEvent.click(selectButton);

    // Should navigate to payment for non-free plans with existing marca
    expect(mockNavigate).toHaveBeenCalledWith('/pay-plan');
    expect(toast.info).toHaveBeenCalledWith('Usted cuenta con una marca previamente registrada');
    expect(localStorage.getItem('planSeleccionado')).toBe(JSON.stringify(mockPlan));
  });

  test('handles free plan selection', () => {
    const mockSetGratisModal = jest.fn();
    
    mockUseTrademark.mockReturnValue({
      marca: null,
      plan: null,
      setGratisModal: mockSetGratisModal
    });

    renderWithRouter(<PlanCard planCard={mockPlanGratuito} />);

    const selectButton = screen.getByText('Seleccionar plan');
    fireEvent.click(selectButton);

    // Should open gratis modal for free plan
    expect(mockSetGratisModal).toHaveBeenCalledWith(true);
  });

  test('disables button for current free plan', () => {
    mockUseTrademark.mockReturnValue({
      marca: null,
      plan: null, // User has no plan (is on free plan)
      setGratisModal: jest.fn()
    });

    renderWithRouter(<PlanCard planCard={mockPlanGratuito} />);

    const selectButton = screen.getByText('Seleccionar plan');
    expect(selectButton).toBeDisabled();
  });

  test('handles plans with multiple month duration', () => {
    const multiMonthPlan = {
      ...mockPlan,
      duracion: 3,
      precio: 79.99,
      espacio_extra: 100
    };

    renderWithRouter(<PlanCard planCard={multiMonthPlan} />);

    expect(screen.getByText('S/79.99.00')).toBeInTheDocument();
    expect(screen.getByText('por 3 meses')).toBeInTheDocument();
  });

  test('capitalizes plan name correctly', () => {
    renderWithRouter(<PlanCard planCard={mockPlan} />);

    // Should capitalize first letter of plan name
    expect(screen.getByText('Plan Premium')).toBeInTheDocument();
  });

  test('renders without beneficios gracefully', () => {
    const planWithoutBeneficios = {
      ...mockPlan,
      beneficios: undefined,
      espacio_extra: 25
    };

    renderWithRouter(<PlanCard planCard={planWithoutBeneficios} />);

    expect(screen.getByText('Plan Premium')).toBeInTheDocument();
    // Should not crash when beneficios is undefined
  });
});
