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


describe('PaginationComp', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: jest.fn(),
    maxVisiblePages: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pagination with correct current page', () => {
    render(<PaginationComp {...defaultProps} />);

    // Check if current page is marked as active
    const currentPageButton = screen.getByText('1');
    expect(currentPageButton.closest('a')).toHaveAttribute('aria-current', 'page');
  });

  it('calls onPageChange when clicking next page', () => {
    render(<PaginationComp {...defaultProps} />);

    const nextButton = screen.getByText('2');
    fireEvent.click(nextButton);

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when clicking previous button', () => {
    const props = { ...defaultProps, currentPage: 5 };
    render(<PaginationComp {...props} />);

    const prevButton = screen.getByLabelText('Página anterior');
    fireEvent.click(prevButton);

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange when clicking next button', () => {
    const props = { ...defaultProps, currentPage: 5 };
    render(<PaginationComp {...props} />);

    const nextButton = screen.getByLabelText('Página siguiente');
    fireEvent.click(nextButton);

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(6);
  });

  it('disables previous button on first page', () => {
    render(<PaginationComp {...defaultProps} />);

    const prevButton = screen.getByLabelText('Página anterior');
    fireEvent.click(prevButton);

    // Should not call onPageChange when on first page
    expect(defaultProps.onPageChange).not.toHaveBeenCalled();
  });

  it('disables next button on last page', () => {
    const props = { ...defaultProps, currentPage: 10 };
    render(<PaginationComp {...props} />);

    const nextButton = screen.getByLabelText('Página siguiente');
    fireEvent.click(nextButton);

    // Should not call onPageChange when on last page
    expect(defaultProps.onPageChange).not.toHaveBeenCalled();
  });

  it('shows correct page numbers based on maxVisiblePages', () => {
    const props = { ...defaultProps, currentPage: 5, maxVisiblePages: 3 };
    render(<PaginationComp {...props} />);

    // Should show pages 4, 5, 6 (current page 5 with 3 visible pages)
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.queryByText('3')).not.toBeInTheDocument();
    expect(screen.queryByText('7')).not.toBeInTheDocument();
  });

  it('handles edge case when current page is near the beginning', () => {
    const props = { ...defaultProps, currentPage: 2, maxVisiblePages: 5 };
    render(<PaginationComp {...props} />);

    // Should show pages 1, 2, 3, 4, 5
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('handles edge case when current page is near the end', () => {
    const props = { ...defaultProps, currentPage: 9, maxVisiblePages: 5 };
    render(<PaginationComp {...props} />);

    // Should show pages 6, 7, 8, 9, 10
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('handles single page scenario', () => {
    const props = { ...defaultProps, totalPages: 1 };
    render(<PaginationComp {...props} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    
    // Previous and next buttons should not navigate anywhere
    const prevButton = screen.getByLabelText('Página anterior');
    const nextButton = screen.getByLabelText('Página siguiente');
    
    fireEvent.click(prevButton);
    fireEvent.click(nextButton);
    
    expect(defaultProps.onPageChange).not.toHaveBeenCalled();
  });

  it('handles maxVisiblePages larger than totalPages', () => {
    const props = { ...defaultProps, totalPages: 3, maxVisiblePages: 10 };
    render(<PaginationComp {...props} />);

    // Should only show pages 1, 2, 3
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.queryByText('4')).not.toBeInTheDocument();
  });

  it('prevents default behavior on link clicks', () => {
    render(<PaginationComp {...defaultProps} />);

    const pageLink = screen.getByText('2');
    const mockPreventDefault = jest.fn();
    
    fireEvent.click(pageLink, { preventDefault: mockPreventDefault });
    
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('renders with correct ARIA labels', () => {
    render(<PaginationComp {...defaultProps} />);

    expect(screen.getByLabelText('Página anterior')).toBeInTheDocument();
    expect(screen.getByLabelText('Página siguiente')).toBeInTheDocument();
  });
});
