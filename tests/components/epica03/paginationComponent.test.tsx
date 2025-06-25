// tests/components/PaginationComp.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { PaginationComp } from '../../../src/components/Epica03/paginationComponent';

describe('PaginationComp', () => {
  const mockOnPageChange = jest.fn();

  const renderComponent = (currentPage: number, totalPages: number, maxVisiblePages = 5) =>
    render(
      <PaginationComp
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={mockOnPageChange}
        maxVisiblePages={maxVisiblePages}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza los botones de paginación correctamente', () => {
    renderComponent(2, 5);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    expect(screen.getByLabelText(/página anterior/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/página siguiente/i)).toBeInTheDocument();
  });

  it('dispara onPageChange al hacer clic en una página', () => {
    renderComponent(2, 5);
    fireEvent.click(screen.getByText('3'));

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('dispara onPageChange al hacer clic en "Anterior"', () => {
    renderComponent(3, 5);
    const previous = screen.getByLabelText(/página anterior/i);
    fireEvent.click(previous);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('no llama a onPageChange al hacer clic en "Anterior" en la primera página', () => {
    renderComponent(1, 5);
    const previous = screen.getByLabelText(/página anterior/i);
    fireEvent.click(previous);

    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('dispara onPageChange al hacer clic en "Siguiente"', () => {
    renderComponent(2, 5);
    const next = screen.getByLabelText(/página siguiente/i);
    fireEvent.click(next);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('no llama a onPageChange al hacer clic en "Siguiente" en la última página', () => {
    renderComponent(5, 5);
    const next = screen.getByLabelText(/página siguiente/i);
    fireEvent.click(next);

    expect(mockOnPageChange).not.toHaveBeenCalled();
  });
});
