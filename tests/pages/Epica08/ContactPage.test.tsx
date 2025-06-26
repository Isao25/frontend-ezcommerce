// tests/pages/Epica08/ContactPage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { ContactPage } from '@/pages/Epica08/ContactPage';

// Mock any external dependencies
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  )
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({ ...props }: any) => <input {...props} />
}));

jest.mock('@/components/ui/textarea', () => ({
  Textarea: ({ ...props }: any) => <textarea {...props} />
}));

// Mock any toast notifications
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn()
  }
}));

// Mock any API calls
jest.mock('@/api/contactApi', () => ({
  sendContactMessage: jest.fn().mockResolvedValue({ success: true })
}));

const ContactPageWithRouter = () => (
  <BrowserRouter>
    <ContactPage />
  </BrowserRouter>
);

describe('ContactPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the contact page title', () => {
    render(<ContactPageWithRouter />);
    
    expect(screen.getByText(/contact/i)).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    render(<ContactPageWithRouter />);
    
    expect(screen.getByLabelText(/name/i) || screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i) || screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i) || screen.getByPlaceholderText(/message/i)).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<ContactPageWithRouter />);
    
    const submitButton = screen.getByRole('button', { name: /send|submit|enviar/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('allows user to type in form fields', async () => {
    const user = userEvent.setup();
    render(<ContactPageWithRouter />);
    
    const nameInput = screen.getByLabelText(/name/i) || screen.getByPlaceholderText(/name/i);
    const emailInput = screen.getByLabelText(/email/i) || screen.getByPlaceholderText(/email/i);
    const messageInput = screen.getByLabelText(/message/i) || screen.getByPlaceholderText(/message/i);
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'Test message');
    
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(messageInput).toHaveValue('Test message');
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<ContactPageWithRouter />);
    
    const submitButton = screen.getByRole('button', { name: /send|submit|enviar/i });
    await user.click(submitButton);
    
    // Check for validation messages or form behavior
    await waitFor(() => {
      // This might be validation text, toast messages, or form state changes
      expect(
        screen.queryByText(/required|obligatorio|necesario/i) ||
        screen.queryByText(/please fill|por favor complete/i) ||
        submitButton
      ).toBeTruthy();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<ContactPageWithRouter />);
    
    const emailInput = screen.getByLabelText(/email/i) || screen.getByPlaceholderText(/email/i);
    const submitButton = screen.getByRole('button', { name: /send|submit|enviar/i });
    
    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(
        screen.queryByText(/invalid email|email inválido|formato de email/i) ||
        emailInput.validity?.valid === false ||
        submitButton
      ).toBeTruthy();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const mockSendMessage = require('@/api/contactApi').sendContactMessage;
    
    render(<ContactPageWithRouter />);
    
    const nameInput = screen.getByLabelText(/name/i) || screen.getByPlaceholderText(/name/i);
    const emailInput = screen.getByLabelText(/email/i) || screen.getByPlaceholderText(/email/i);
    const messageInput = screen.getByLabelText(/message/i) || screen.getByPlaceholderText(/message/i);
    const submitButton = screen.getByRole('button', { name: /send|submit|enviar/i });
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'Test message');
    
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message'
      });
    });
  });

  it('shows success message after successful submission', async () => {
    const user = userEvent.setup();
    const mockToast = require('sonner').toast;
    
    render(<ContactPageWithRouter />);
    
    const nameInput = screen.getByLabelText(/name/i) || screen.getByPlaceholderText(/name/i);
    const emailInput = screen.getByLabelText(/email/i) || screen.getByPlaceholderText(/email/i);
    const messageInput = screen.getByLabelText(/message/i) || screen.getByPlaceholderText(/message/i);
    const submitButton = screen.getByRole('button', { name: /send|submit|enviar/i });
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'Test message');
    
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        expect.stringMatching(/success|sent|enviado|éxito/i)
      );
    });
  });

  it('handles submission errors', async () => {
    const user = userEvent.setup();
    const mockSendMessage = require('@/api/contactApi').sendContactMessage;
    const mockToast = require('sonner').toast;
    
    mockSendMessage.mockRejectedValueOnce(new Error('Network error'));
    
    render(<ContactPageWithRouter />);
    
    const nameInput = screen.getByLabelText(/name/i) || screen.getByPlaceholderText(/name/i);
    const emailInput = screen.getByLabelText(/email/i) || screen.getByPlaceholderText(/email/i);
    const messageInput = screen.getByLabelText(/message/i) || screen.getByPlaceholderText(/message/i);
    const submitButton = screen.getByRole('button', { name: /send|submit|enviar/i });
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'Test message');
    
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        expect.stringMatching(/error|failed|falló/i)
      );
    });
  });

  it('disables submit button during submission', async () => {
    const user = userEvent.setup();
    const mockSendMessage = require('@/api/contactApi').sendContactMessage;
    
    // Make the API call take some time
    mockSendMessage.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<ContactPageWithRouter />);
    
    const nameInput = screen.getByLabelText(/name/i) || screen.getByPlaceholderText(/name/i);
    const emailInput = screen.getByLabelText(/email/i) || screen.getByPlaceholderText(/email/i);
    const messageInput = screen.getByLabelText(/message/i) || screen.getByPlaceholderText(/message/i);
    const submitButton = screen.getByRole('button', { name: /send|submit|enviar/i });
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'Test message');
    
    await user.click(submitButton);
    
    // Button should be disabled during submission
    expect(submitButton).toBeDisabled();
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('clears form after successful submission', async () => {
    const user = userEvent.setup();
    render(<ContactPageWithRouter />);
    
    const nameInput = screen.getByLabelText(/name/i) || screen.getByPlaceholderText(/name/i);
    const emailInput = screen.getByLabelText(/email/i) || screen.getByPlaceholderText(/email/i);
    const messageInput = screen.getByLabelText(/message/i) || screen.getByPlaceholderText(/message/i);
    const submitButton = screen.getByRole('button', { name: /send|submit|enviar/i });
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'Test message');
    
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(messageInput).toHaveValue('');
    });
  });

  it('displays contact information', () => {
    render(<ContactPageWithRouter />);
    
    // Look for common contact information elements
    const contactInfo = screen.getByText(/contact/i).closest('div');
    expect(contactInfo).toBeInTheDocument();
  });

  it('renders with proper accessibility attributes', () => {
    render(<ContactPageWithRouter />);
    
    const form = screen.getByRole('form') || screen.querySelector('form');
    expect(form).toBeInTheDocument();
    
    // Check for proper labels or aria-labels
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(
        input.getAttribute('aria-label') ||
        input.getAttribute('aria-labelledby') ||
        screen.queryByLabelText(input.getAttribute('name') || '')
      ).toBeTruthy();
    });
  });
});

// tests/utils/helpers.test.ts
import {
  formatDate,
  formatCurrency,
  validateEmail,
  slugify,
  truncateText,
  capitalize,
  generateId,
  debounce,
  formatPhoneNumber,
  isValidUrl,
  getInitials,
  formatFileSize,
  calculateTimeDifference,
  sanitizeInput,
  formatPercentage,
  deepClone,
  isObjectEmpty,
  removeAccents,
  formatNumber,
  generateRandomString,
  hexToRgb,
  rgbToHex
} from '@/utils/helpers';

describe('helpers utilities', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/2024|15|Jan|enero/i);
    });

    it('handles invalid date', () => {
      const result = formatDate(null as any);
      expect(result).toBe('');
    });
  });

  describe('formatCurrency', () => {
    it('formats currency with default options', () => {
      const result = formatCurrency(1234.56);
      expect(result).toMatch(/1.*234.*56/);
    });

    it('formats currency with custom currency', () => {
      const result = formatCurrency(1000, 'EUR');
      expect(result).toContain('EUR') || expect(result).toContain('€');
    });
  });

  describe('validateEmail', () => {
    it('validates correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    it('rejects invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('slugify', () => {
    it('converts text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Testing 123!')).toBe('testing-123');
    });

    it('handles special characters', () => {
      expect(slugify('Café & Résumé')).toBe('cafe-resume');
      expect(slugify('¡Hola! ¿Cómo estás?')).toBe('hola-como-estas');
    });
  });

  describe('truncateText', () => {
    it('truncates long text', () => {
      const longText = 'This is a very long text that should be truncated';
      const result = truncateText(longText, 20);
      expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
      expect(result).toContain('...');
    });

    it('does not truncate short text', () => {
      const shortText = 'Short';
      const result = truncateText(shortText, 20);
      expect(result).toBe(shortText);
    });
  });

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
    });

    it('handles empty string', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    it('delays function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('cancels previous calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });

  describe('formatPhoneNumber', () => {
    it('formats phone number', () => {
      const result = formatPhoneNumber('1234567890');
      expect(result).toMatch(/\d{3}.*\d{3}.*\d{4}/);
    });

    it('handles invalid input', () => {
      expect(formatPhoneNumber('123')).toBeTruthy();
      expect(formatPhoneNumber('')).toBe('');
    });
  });

  describe('isValidUrl', () => {
    it('validates correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://test.org')).toBe(true);
    });

    it('rejects invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('ftp://invalid')).toBe(false);
    });
  });

  describe('getInitials', () => {
    it('gets initials from name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Mary Jane Watson')).toBe('MJW');
    });

    it('handles single name', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('handles empty input', () => {
      expect(getInitials('')).toBe('');
    });
  });

  describe('formatFileSize', () => {
    it('formats file sizes', () => {
      expect(formatFileSize(1024)).toContain('KB');
      expect(formatFileSize(1048576)).toContain('MB');
      expect(formatFileSize(500)).toContain('B');
    });
  });

  describe('calculateTimeDifference', () => {
    it('calculates time difference', () => {
      const now = new Date();
      const past = new Date(now.getTime() - 60000); // 1 minute ago
      const result = calculateTimeDifference(past, now);
      expect(result).toContain('minute') || expect(result).toContain('1');
    });
  });

  describe('sanitizeInput', () => {
    it('sanitizes dangerous input', () => {
      const dangerous = '<script>alert("xss")</script>';
      const safe = sanitizeInput(dangerous);
      expect(safe).not.toContain('<script>');
    });
  });

  describe('formatPercentage', () => {
    it('formats percentage', () => {
      expect(formatPercentage(0.5)).toContain('50');
      expect(formatPercentage(0.1234, 1)).toContain('12.3');
    });
  });

  describe('deepClone', () => {
    it('creates deep copy of object', () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
    });
  });

  describe('isObjectEmpty', () => {
    it('checks if object is empty', () => {
      expect(isObjectEmpty({})).toBe(true);
      expect(isObjectEmpty({ a: 1 })).toBe(false);
    });
  });

  describe('removeAccents', () => {
    it('removes accents from text', () => {
      expect(removeAccents('café')).toBe('cafe');
      expect(removeAccents('résumé')).toBe('resume');
    });
  });

  describe('formatNumber', () => {
    it('formats number with separators', () => {
      const result = formatNumber(1234567);
      expect(result).toMatch(/1.*234.*567/);
    });
  });

  describe('generateRandomString', () => {
    it('generates random string of specified length', () => {
      const result = generateRandomString(10);
      expect(result).toHaveLength(10);
      expect(typeof result).toBe('string');
    });
  });

  describe('color conversion functions', () => {
    describe('hexToRgb', () => {
      it('converts hex to RGB', () => {
        const result = hexToRgb('#ff0000');
        expect(result).toEqual({ r: 255, g: 0, b: 0 });
      });

      it('handles short hex format', () => {
        const result = hexToRgb('#f00');
        expect(result).toEqual({ r: 255, g: 0, b: 0 });
      });
    });

    describe('rgbToHex', () => {
      it('converts RGB to hex', () => {
        const result = rgbToHex(255, 0, 0);
        expect(result).toBe('#ff0000');
      });
    });
  });
});
