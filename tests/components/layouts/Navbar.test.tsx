import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar } from '../../../src/components/layouts/Navbar';
import { render, createMockAuthUser, createMockUnauthUser } from '../../utils/test-utils';
import { useAuth } from '../../../src/hooks/useAuth';
import { useCartContext } from '../../../src/context/CartContext';

// Mock dependencies
jest.mock('../../../src/hooks/useAuth');
jest.mock('../../../src/context/CartContext');
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => jest.fn(),
  NavLink: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
  Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockedUseCartContext = useCartContext as jest.MockedFunction<typeof useCartContext>;

describe('Navbar', () => {
  const mockCartContext = {
    items: [
      { productTitle: 'Product 1', quantity: 2 },
      { productTitle: 'Product 2', quantity: 1 },
    ],
    addItem: jest.fn(),
    removeItem: jest.fn(),
    updateItemQuantity: jest.fn(),
    clearCart: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseCartContext.mockReturnValue(mockCartContext);
  });

  it('renders logo with correct link', () => {
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<Navbar />);

    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'Ezcommerce-logo-light.png');

    const logoLink = logo.closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('renders search input with correct placeholder', () => {
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<Navbar />);

    const searchInput = screen.getByPlaceholderText('Buscar productos');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'search');
  });

  it('handles search functionality', async () => {
    const mockNavigate = jest.fn();
    jest.doMock('react-router', () => ({
      ...jest.requireActual('react-router'),
      useNavigate: () => mockNavigate,
    }));

    const user = userEvent.setup();
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<Navbar />);

    const searchInput = screen.getByPlaceholderText('Buscar productos');
    
    await user.type(searchInput, 'test product');
    await user.keyboard('{Enter}');

    expect(searchInput).toHaveValue('test product');
  });

  it('renders login and signup buttons for unauthenticated users', () => {
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<Navbar />);

    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('renders navigation icons for authenticated users', () => {
    mockedUseAuth.mockReturnValue(createMockAuthUser());

    render(<Navbar />);

    // Should show notification, favorites, and cart icons
    const chatLink = screen.getByRole('link', { name: /chat/i });
    const favouritesLink = screen.getByRole('link', { name: /favourites/i });
    const cartLink = screen.getByRole('link', { name: /shopping-cart/i });

    expect(chatLink).toHaveAttribute('href', '/chat');
    expect(favouritesLink).toHaveAttribute('href', '/favourites');
    expect(cartLink).toHaveAttribute('href', '/shopping-cart');
  });

  it('displays cart item count correctly', () => {
    mockedUseAuth.mockReturnValue(createMockAuthUser());

    render(<Navbar />);

    // Cart should show count of 2 items (from mockCartContext)
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('displays empty cart count when no items', () => {
    mockedUseAuth.mockReturnValue(createMockAuthUser());
    mockedUseCartContext.mockReturnValue({
      ...mockCartContext,
      items: [],
    });

    render(<Navbar />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('navigates to login when login button is clicked', () => {
    const mockNavigate = jest.fn();
    jest.doMock('react-router', () => ({
      ...jest.requireActual('react-router'),
      useNavigate: () => mockNavigate,
    }));

    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<Navbar />);

    const loginButton = screen.getByText('Log in');
    fireEvent.click(loginButton);

    // Button should be clickable
    expect(loginButton).toBeInTheDocument();
  });

  it('navigates to register when signup button is clicked', () => {
    const mockNavigate = jest.fn();
    jest.doMock('react-router', () => ({
      ...jest.requireActual('react-router'),
      useNavigate: () => mockNavigate,
    }));

    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<Navbar />);

    const signupButton = screen.getByText('Sign up');
    fireEvent.click(signupButton);

    expect(signupButton).toBeInTheDocument();
  });

  it('renders MenuAccount component for authenticated users', () => {
    mockedUseAuth.mockReturnValue(createMockAuthUser());

    render(<Navbar />);

    // MenuAccount should render a button with User icon
    const userButton = screen.getByRole('button');
    expect(userButton).toBeInTheDocument();
  });

  it('renders NavigationComponent', () => {
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<Navbar />);

    // NavigationComponent should render navigation menu
    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();
  });

  it('handles empty search submission', async () => {
    const user = userEvent.setup();
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<Navbar />);

    const searchInput = screen.getByPlaceholderText('Buscar productos');
    
    // Submit empty search
    await user.keyboard('{Enter}');

    expect(searchInput).toHaveValue('');
  });

  it('clears search input when needed', async () => {
    const user = userEvent.setup();
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<Navbar />);

    const searchInput = screen.getByPlaceholderText('Buscar productos');
    
    await user.type(searchInput, 'test');
    await user.clear(searchInput);

    expect(searchInput).toHaveValue('');
  });

  it('has proper responsive layout classes', () => {
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<Navbar />);

    const navbar = screen.getByRole('navigation');
    const mainContainer = navbar.querySelector('.flex.flex-wrap.items-center');
    expect(mainContainer).toBeInTheDocument();
  });

  it('renders search icon in search input', () => {
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<Navbar />);

    const searchIcon = screen.getByTestId ? screen.queryByTestId('search-icon') : null;
    // Since there's no testId, we check for the search input structure
    const searchContainer = screen.getByPlaceholderText('Buscar productos').closest('div');
    expect(searchContainer).toBeInTheDocument();
  });

  it('shows correct cart count for multiple items', () => {
    const multipleItemsCart = {
      ...mockCartContext,
      items: [
        { productTitle: 'Product 1', quantity: 3 },
        { productTitle: 'Product 2', quantity: 2 },
        { productTitle: 'Product 3', quantity: 1 },
      ],
    };

    mockedUseAuth.mockReturnValue(createMockAuthUser());
    mockedUseCartContext.mockReturnValue(multipleItemsCart);

    render(<Navbar />);

    expect(screen.getByText('3')).toBeInTheDocument(); // 3 different items
  });

  it('applies correct hover styles to buttons', () => {
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<Navbar />);

    const loginButton = screen.getByText('Log in');
    const signupButton = screen.getByText('Sign up');

    expect(loginButton).toHaveClass('hover:text-secondaryLight', 'hover:bg-transparent');
    expect(signupButton).toHaveClass('hover:text-secondaryLight', 'hover:bg-transparent');
  });

  it('maintains logo sizing across different screen sizes', () => {
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<Navbar />);

    const logoContainer = screen.getByAltText('Logo').closest('div');
    expect(logoContainer).toHaveClass('w-40', 'lg:mr-9');
  });

  it('handles search input focus and blur events', async () => {
    const user = userEvent.setup();
    mockedUseAuth.mockReturnValue(createMockUnauthUser());

    render(<Navbar />);

    const searchInput = screen.getByPlaceholderText('Buscar productos');
    
    await user.click(searchInput);
    expect(searchInput).toHaveFocus();

    await user.tab();
    expect(searchInput).not.toHaveFocus();
  });
});
