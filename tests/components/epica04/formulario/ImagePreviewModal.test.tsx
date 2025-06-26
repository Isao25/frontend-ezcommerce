import { render, screen, fireEvent } from '@testing-library/react';
import { ImagePreviewModal } from '@/components/Epica04/formulario/ImagePreviewModal';

describe('ImagePreviewModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when imageUrl is null', () => {
    const { container } = render(
      <ImagePreviewModal imageUrl={null} onClose={mockOnClose} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  test('renders modal when imageUrl is provided', () => {
    render(
      <ImagePreviewModal 
        imageUrl="test-image.jpg" 
        onClose={mockOnClose} 
      />
    );

    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'test-image.jpg');
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Preview');
  });

  test('closes modal when close button clicked', () => {
    render(
      <ImagePreviewModal 
        imageUrl="test-image.jpg" 
        onClose={mockOnClose} 
      />
    );

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  test('closes modal when overlay clicked', () => {
    render(
      <ImagePreviewModal 
        imageUrl="test-image.jpg" 
        onClose={mockOnClose} 
      />
    );

    const overlay = screen.getByRole('img').closest('.fixed');
    if (overlay) {
      fireEvent.click(overlay);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  test('does not close modal when image clicked', () => {
    render(
      <ImagePreviewModal 
        imageUrl="test-image.jpg" 
        onClose={mockOnClose} 
      />
    );

    const image = screen.getByRole('img');
    fireEvent.click(image);

    expect(mockOnClose).not.toHaveBeenCalled();
  });
});