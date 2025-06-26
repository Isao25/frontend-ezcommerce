import { render, screen } from '@testing-library/react';
import { GratisModal } from '@/components/Epica5/GratisModal';

// Mock the trademark hook
const mockUseTrademark = jest.fn();
jest.mock('@/hooks/useTrademark', () => ({
  useTrademark: () => mockUseTrademark()
}));

// Mock the ModalMessage component
jest.mock('@/components/Epica1/ModalMessage', () => ({
  ModalMessage: ({ isOpen, title, children }: any) => 
    isOpen ? (
      <div data-testid="modal-message">
        <h2>{title}</h2>
        <div>{children}</div>
      </div>
    ) : null
}));

describe('GratisModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal when gratisModal is true', () => {
    mockUseTrademark.mockReturnValue({
      membresia: {
        fecha_final: '2024-12-31'
      },
      gratisModal: true,
      setGratisModal: jest.fn()
    });

    render(<GratisModal />);

    expect(screen.getByTestId('modal-message')).toBeInTheDocument();
    expect(screen.getByText('Cancelar suscripción')).toBeInTheDocument();
    expect(screen.getByText(/¿Estás seguro de que deseas cancelar tu sucripcion?/)).toBeInTheDocument();
  });

  test('does not render modal when gratisModal is false', () => {
    mockUseTrademark.mockReturnValue({
      membresia: {
        fecha_final: '2024-12-31'
      },
      gratisModal: false,
      setGratisModal: jest.fn()
    });

    render(<GratisModal />);

    expect(screen.queryByTestId('modal-message')).not.toBeInTheDocument();
  });

  test('displays membership information', () => {
    mockUseTrademark.mockReturnValue({
      membresia: {
        fecha_final: '2024-12-31'
      },
      gratisModal: true,
      setGratisModal: jest.fn()
    });

    render(<GratisModal />);

    expect(screen.getByText('Tu plan actual')).toBeInTheDocument();
    expect(screen.getByText('Marcas')).toBeInTheDocument();
    expect(screen.getByText('Fecha de activación')).toBeInTheDocument();
    expect(screen.getByText('2024-12-31')).toBeInTheDocument();
  });

  test('handles missing membresia gracefully', () => {
    mockUseTrademark.mockReturnValue({
      membresia: null,
      gratisModal: true,
      setGratisModal: jest.fn()
    });

    render(<GratisModal />);

    expect(screen.getByTestId('modal-message')).toBeInTheDocument();
    // Should still render the modal content without crashing
  });
});
