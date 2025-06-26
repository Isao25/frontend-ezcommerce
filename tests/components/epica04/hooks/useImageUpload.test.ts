import { renderHook, act } from '@testing-library/react';
import { useImageUpload } from '@/pages/Epica04/hooks/useImageUpload';

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url');
global.URL.revokeObjectURL = jest.fn();

describe('useImageUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes with empty images array', () => {
    const { result } = renderHook(() => useImageUpload(5));
    
    expect(result.current.images).toEqual([]);
  });

  test('handles file upload', () => {
    const { result } = renderHook(() => useImageUpload(5));
    
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockEvent = {
      target: { files: [mockFile] }
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleFileUpload(mockEvent);
    });

    expect(result.current.images).toHaveLength(1);
    expect(result.current.images[0]).toHaveProperty('file', mockFile);
    expect(result.current.images[0]).toHaveProperty('preview', 'mocked-url');
  });

  test('removes image by id', () => {
    const { result } = renderHook(() => useImageUpload(5));
    
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockEvent = {
      target: { files: [mockFile] }
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleFileUpload(mockEvent);
    });

    const imageId = result.current.images[0].id;

    act(() => {
      result.current.removeImage(imageId);
    });

    expect(result.current.images).toHaveLength(0);
  });

  test('respects max images limit', () => {
    const { result } = renderHook(() => useImageUpload(2));
    
    const mockFiles = [
      new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['test2'], 'test2.jpg', { type: 'image/jpeg' }),
      new File(['test3'], 'test3.jpg', { type: 'image/jpeg' })
    ];
    
    const mockEvent = {
      target: { files: mockFiles }
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleFileUpload(mockEvent);
    });

    expect(result.current.images).toHaveLength(2);
  });
});
