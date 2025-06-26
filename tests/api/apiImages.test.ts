jest.mock('@/utils/constants', () => ({
  baseURLCentralized: 'http://localhost:8000'
}));

jest.mock('@/api/api', () => ({
  AxiosProtectedService: jest.fn().mockImplementation(() => ({
    instance: {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    }
  }))
}));

import {
  getAllImages,
  getImage,
  createImage,
  updateImage,
  deleteImage
} from '@/api/apiImages';

describe('Images API', () => {
  const mockInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };

  const mockImage = {
    id: 1,
    id_articulo: 1,
    url: 'https://example.com/image.jpg'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the imagenesApi instance
    const apiImages = require('@/api/apiImages');
    apiImages.imagenesApi = { instance: mockInstance };
  });

  describe('getAllImages', () => {
    it('should fetch all images', async () => {
      const mockResponse = { data: { results: [mockImage] } };
      mockInstance.get.mockResolvedValue(mockResponse);
      
      const result = await getAllImages();
      expect(result.data.results).toEqual([mockImage]);
    });
  });

  describe('getImage', () => {
    it('should fetch images by articulo id', async () => {
      const mockResponse = { data: { results: [mockImage] } };
      mockInstance.get.mockResolvedValue(mockResponse);
      
      const result = await getImage(1);
      expect(result.data.results).toEqual([mockImage]);
    });
  });

  describe('createImage', () => {
    it('should create new image', async () => {
      const newImage = { id_articulo: 1, url: 'test.jpg' };
      const mockResponse = { data: { ...newImage, id: 2 } };
      mockInstance.post.mockResolvedValue(mockResponse);
      
      const result = await createImage(newImage);
      expect(result.data.id).toBe(2);
    });
  });

  describe('updateImage', () => {
    it('should update existing image', async () => {
      const updatedImage = { id_articulo: 1, url: 'updated.jpg' };
      const mockResponse = { data: { ...updatedImage, id: 1 } };
      mockInstance.put.mockResolvedValue(mockResponse);
      
      const result = await updateImage(1, updatedImage);
      expect(result.data.url).toBe('updated.jpg');
    });
  });

  describe('deleteImage', () => {
    it('should delete image', async () => {
      const mockResponse = { data: { message: 'Deleted' } };
      mockInstance.delete.mockResolvedValue(mockResponse);
      
      const result = await deleteImage(1);
      expect(result.data.message).toBe('Deleted');
    });
  });
});
