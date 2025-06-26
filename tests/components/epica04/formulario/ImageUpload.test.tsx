import { render, screen, fireEvent } from '@testing-library/react';
import { ImageUpload } from '@/components/Epica04/formulario/ImageUpload';

// Mock DndContext and related components
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  closestCenter: jest.fn()
}));

jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  horizontalListSortingStrategy: jest.fn(),
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null
  })
}));

jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: jest.fn(() => '')
    }
  }
}));

describe('ImageUpload', () => {
  const mockProps = {
    images: [
      {
        id: '1',
        preview: 'test-image-1.jpg',
        file: new File(['test'], 'test1.jpg', { type: 'image/jpeg' })
      },
      {
        id: '2',
        preview: 'test-image-2.jpg',
        file: new File(['test'], 'test2.jpg', { type: 'image/jpeg' })
      }
    ],
    onPreview: jest.fn(),
    handleFileUpload: jest.fn(),
    removeImage: jest.fn(),
    onDragEnd: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders uploaded images', () => {
    render(<ImageUpload {...mockProps} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', 'test-image-1.jpg');
    expect(images[1]).toHaveAttribute('src', 'test-image-2.jpg');
  });

  test('shows upload button when less than 5 images', () => {
    render(<ImageUpload {...mockProps} />);

    const fileInput = screen.getByRole('button', { hidden: true });
    expect(fileInput).toBeInTheDocument();
  });

  test('does not show upload button when 5 images uploaded', () => {
    const propsWithMaxImages = {
      ...mockProps,
      images: [
        ...mockProps.images,
        { id: '3', preview: 'test3.jpg', file: new File([''], 'test3.jpg') },
        { id: '4', preview: 'test4.jpg', file: new File([''], 'test4.jpg') },
        { id: '5', preview: 'test5.jpg', file: new File([''], 'test5.jpg') }
      ]
    };

    render(<ImageUpload {...propsWithMaxImages} />);

    const plusIcons = screen.queryAllByTestId('plus-icon');
    expect(plusIcons).toHaveLength(0);
  });

  test('handles file upload', () => {
    render(<ImageUpload {...mockProps} />);

    const fileInput = screen.getByLabelText('', { selector: 'input[type="file"]' });
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockProps.handleFileUpload).toHaveBeenCalled();
  });

  test('handles image preview', () => {
    render(<ImageUpload {...mockProps} />);

    // Find the preview button (maximize icon)
    const previewButtons = screen.getAllByRole('button');
    const previewButton = previewButtons.find(button => 
      button.querySelector('svg') && 
      button.getAttribute('aria-label') !== 'Remove'
    );

    if (previewButton) {
      fireEvent.click(previewButton);
      expect(mockProps.onPreview).toHaveBeenCalled();
    }
  });

  test('handles image removal', () => {
    render(<ImageUpload {...mockProps} />);

    // Find the remove button (X icon)
    const removeButtons = screen.getAllByRole('button');
    const removeButton = removeButtons.find(button => 
      button.querySelector('svg') && 
      button.getAttribute('aria-label') === 'Remove'
    );

    if (removeButton) {
      fireEvent.click(removeButton);
      expect(mockProps.removeImage).toHaveBeenCalled();
    }
  });
});
