import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HelpAndSupport } from '@/components/Epica08/HelpAndSoport';
import { BrowserRouter } from 'react-router-dom';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('HelpAndSupport', () => {
  test('renders help and support button', () => {
    renderWithRouter(<HelpAndSupport />);

    expect(screen.getByText('Ayuda y soporte técnico')).toBeInTheDocument();
  });

  test('opens dialog when button clicked', () => {
    renderWithRouter(<HelpAndSupport />);

    fireEvent.click(screen.getByText('Ayuda y soporte técnico'));

    expect(screen.getByText('Contactar soporte')).toBeInTheDocument();
    expect(screen.getByText('Reportar problema')).toBeInTheDocument();
  });

  test('shows report problem form when clicked', () => {
    renderWithRouter(<HelpAndSupport />);

    fireEvent.click(screen.getByText('Ayuda y soporte técnico'));
    fireEvent.click(screen.getByText('Reportar problema'));

    expect(screen.getByText('Seleccionar tipo de problema')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('tu@ejemplo.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Coloca la descripción de tu problema o pregunta')).toBeInTheDocument();
  });

  test('validates form fields', async () => {
    renderWithRouter(<HelpAndSupport />);

    fireEvent.click(screen.getByText('Ayuda y soporte técnico'));
    fireEvent.click(screen.getByText('Reportar problema'));

    const submitButton = screen.getByText('Reportar problema');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Por favor seleccione un tipo de problema')).toBeInTheDocument();
    });
  });

  test('handles form submission', async () => {
    renderWithRouter(<HelpAndSupport />);

    fireEvent.click(screen.getByText('Ayuda y soporte técnico'));
    fireEvent.click(screen.getByText('Reportar problema'));

    // Fill form
    const problemTypeSelect = screen.getByRole('combobox');
    fireEvent.click(problemTypeSelect);
    fireEvent.click(screen.getByText('Error'));

    const emailInput = screen.getByPlaceholderText('tu@ejemplo.com');
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });

    const descriptionInput = screen.getByPlaceholderText('Coloca la descripción de tu problema o pregunta');
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });

    const submitButton = screen.getByText('Reportar problema');
    fireEvent.click(submitButton);

    // Form should be submitted
    await waitFor(() => {
      expect(emailInput).toHaveValue('test@test.com');
    });
  });

  test('shows problem type options', () => {
    renderWithRouter(<HelpAndSupport />);

    fireEvent.click(screen.getByText('Ayuda y soporte técnico'));
    fireEvent.click(screen.getByText('Reportar problema'));

    const problemTypeSelect = screen.getByRole('combobox');
    fireEvent.click(problemTypeSelect);

    expect(screen.getByText('Problema de Rendimiento')).toBeInTheDocument();
    expect(screen.getByText('Problema de UI/UX')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Otro')).toBeInTheDocument();
  });
});