// AuthContext.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { act } from 'react-dom/test-utils';

// Mock utils/constants
jest.mock('@/utils/constants', () => ({
  baseURLCentralized: 'http://localhost:8000'
}));

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }))
}));

// Mock jwt-decode
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({ user_id: 1 }))
}));

// Test component
const TestComponent = () => {
  const { authState, login, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="user-id">{authState.userId || 'null'}</div>
      <div data-testid="access-token">{authState.accessToken || 'null'}</div>
      <button onClick={() => login('test@test.com', 'password')} data-testid="login">
        Login
      </button>
      <button onClick={logout} data-testid="logout">
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('provides initial auth state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user-id')).toHaveTextContent('null');
    expect(screen.getByTestId('access-token')).toHaveTextContent('null');
  });

  test('handles logout', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByTestId('logout').click();
    });

    expect(screen.getByTestId('user-id')).toHaveTextContent('null');
  });
});

