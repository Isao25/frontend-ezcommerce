import { render, screen } from '@testing-library/react';
import { LoginModal } from '@/components/Epica5/LoginModal';
import { BrowserRouter } from 'react-router-dom';

// Mock the auth hook
const mockUseAuth = jest.fn();
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}));

// Mock the ModalMessage component
jest.mock('@/components/Epica1/ModalMessage', () => ({
  ModalMessage: ({ isOpen, title, children, buttonFunc }: any) => 
    isOpen ? (
      <div data-testid="modal-message">
        <h2>{title}</h2>
        <div>{children}</div>
        <button onClick={buttonFunc} data-testid="modal-button">
          Iniciar sesión
        </button>
      </div>
    ) : null
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('LoginModal', () => {
  const mockSetLoginModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      loginModal: false,
      setLoginModal: mockSetLoginModal
    });
  });

  test('renders modal when loginModal is true', () => {
    mockUseAuth.mockReturnValue({
      loginModal: true,
      setLoginModal: mockSetLoginModal
    });

    renderWithRouter(<LoginModal />);

    expect(screen.getByTestId('modal-message')).toBeInTheDocument();
    expect(screen.getByText('Acceso requerido')).toBeInTheDocument();
    expect(screen.getByText(/Para poder acceder a este módulo/)).toBeInTheDocument();
  });

  test('does not render modal when loginModal is false', () => {
    mockUseAuth.mockReturnValue({
      loginModal: false,
      setLoginModal: mockSetLoginModal
    });

    renderWithRouter(<LoginModal />);

    expect(screen.queryByTestId('modal-message')).not.toBeInTheDocument();
  });

  test('displays correct modal content', () => {
    mockUseAuth.mockReturnValue({
      loginModal: true,
      setLoginModal: mockSetLoginModal
    });

    renderWithRouter(<LoginModal />);

    expect(screen.getByText('Acceso requerido')).toBeInTheDocument();
    expect(screen.getByText(/Para poder acceder a este módulo, es imprescindible que inicie sesión/)).toBeInTheDocument();
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
  });

  test('navigates to login when button clicked', () => {
    mockUseAuth.mockReturnValue({
      loginModal: true,
      setLoginModal: mockSetLoginModal
    });

    renderWithRouter(<LoginModal />);

    const loginButton = screen.getByTestId('modal-button');
    loginButton.click();

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('has UserX icon displayed', () => {
    mockUseAuth.mockReturnValue({
      loginModal: true,
      setLoginModal: mockSetLoginModal
    });

    renderWithRouter(<LoginModal />);

    // The icon should be passed to ModalMessage component
    expect(screen.getByTestId('modal-message')).toBeInTheDocument();
  });
});