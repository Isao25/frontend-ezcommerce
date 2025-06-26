// src/utils/__tests__/helpers.test.ts
import { getFileURL, deleteFileFromFirebase } from '../../src/utils/helpers';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../src/services/firebase';
import { v4 } from 'uuid';

// Mock de Firebase Storage
jest.mock('firebase/storage');
jest.mock('.../../src/services/firebase');
jest.mock('uuid');

const mockRef = ref as jest.MockedFunction<typeof ref>;
const mockUploadBytes = uploadBytes as jest.MockedFunction<typeof uploadBytes>;
const mockGetDownloadURL = getDownloadURL as jest.MockedFunction<typeof getDownloadURL>;
const mockDeleteObject = deleteObject as jest.MockedFunction<typeof deleteObject>;
const mockV4 = v4 as jest.MockedFunction<typeof v4>;


describe('Firebase Storage Helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getFileURL', () => {
    const mockFile = new File(['test content'], 'test-image.jpg', { type: 'image/jpeg' });
    const mockStorageDir = 'images';
    const mockUUID = 'abc123de-f456-7890-ghij-klmnopqrstuv';
    const mockShortUUID = 'abc123de';
    const mockFileRef = { name: 'mock-file-ref' };
    const mockDownloadURL = 'https://firebase.storage.googleapis.com/test-url';

    beforeEach(() => {
      mockV4.mockReturnValue(mockUUID);
      mockRef.mockReturnValue(mockFileRef as any);
      mockUploadBytes.mockResolvedValue({} as any);
      mockGetDownloadURL.mockResolvedValue(mockDownloadURL);
    });

    it('should return null when file is null or undefined', async () => {
      const resultNull = await getFileURL(null as any, mockStorageDir);
      const resultUndefined = await getFileURL(undefined as any, mockStorageDir);

      expect(resultNull).toBeNull();
      expect(resultUndefined).toBeNull();
      expect(mockV4).not.toHaveBeenCalled();
      expect(mockRef).not.toHaveBeenCalled();
      expect(mockUploadBytes).not.toHaveBeenCalled();
      expect(mockGetDownloadURL).not.toHaveBeenCalled();
    });

    it('should successfully upload file and return download URL', async () => {
      const result = await getFileURL(mockFile, mockStorageDir);

      expect(mockV4).toHaveBeenCalledTimes(1);
      expect(mockRef).toHaveBeenCalledWith(
        storage,
        `${mockStorageDir}/${mockFile.name}-${mockShortUUID}`
      );
      expect(mockUploadBytes).toHaveBeenCalledWith(mockFileRef, mockFile);
      expect(mockGetDownloadURL).toHaveBeenCalledWith(mockFileRef);
      expect(result).toBe(mockDownloadURL);
    });

    it('should generate correct file path with short UUID', async () => {
      const customUUID = 'first-second-third-fourth-fifth';
      mockV4.mockReturnValue(customUUID);

      await getFileURL(mockFile, mockStorageDir);

      expect(mockRef).toHaveBeenCalledWith(
        storage,
        `${mockStorageDir}/${mockFile.name}-first`
      );
    });

    it('should handle different storage directories', async () => {
      const differentDir = 'documents';
      await getFileURL(mockFile, differentDir);

      expect(mockRef).toHaveBeenCalledWith(
        storage,
        `${differentDir}/${mockFile.name}-${mockShortUUID}`
      );
    });

    it('should handle files with different extensions', async () => {
      const pdfFile = new File(['pdf content'], 'document.pdf', { type: 'application/pdf' });
      
      await getFileURL(pdfFile, mockStorageDir);

      expect(mockRef).toHaveBeenCalledWith(
        storage,
        `${mockStorageDir}/document.pdf-${mockShortUUID}`
      );
    });

    it('should return null and log error when ref creation fails', async () => {
      mockRef.mockImplementation(() => {
        throw new Error('Firebase ref error');
      });

      const result = await getFileURL(mockFile, mockStorageDir);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Error subiendo el archivo o obteniendo la URL:',
        expect.any(Error)
      );
    });

    it('should return null and log error when uploadBytes fails', async () => {
      mockUploadBytes.mockRejectedValue(new Error('Upload failed'));

      const result = await getFileURL(mockFile, mockStorageDir);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Error subiendo el archivo o obteniendo la URL:',
        expect.any(Error)
      );
    });

    it('should return null and log error when getDownloadURL fails', async () => {
      mockGetDownloadURL.mockRejectedValue(new Error('Get URL failed'));

      const result = await getFileURL(mockFile, mockStorageDir);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Error subiendo el archivo o obteniendo la URL:',
        expect.any(Error)
      );
    });

    it('should handle files with special characters in name', async () => {
      const specialFile = new File(['content'], 'file with spaces & symbols!.txt', { type: 'text/plain' });
      
      await getFileURL(specialFile, mockStorageDir);

      expect(mockRef).toHaveBeenCalledWith(
        storage,
        `${mockStorageDir}/file with spaces & symbols!.txt-${mockShortUUID}`
      );
    });

    it('should handle large files', async () => {
      const largeContent = 'x'.repeat(10000);
      const largeFile = new File([largeContent], 'large-file.txt', { type: 'text/plain' });

      const result = await getFileURL(largeFile, mockStorageDir);

      expect(mockUploadBytes).toHaveBeenCalledWith(mockFileRef, largeFile);
      expect(result).toBe(mockDownloadURL);
    });
  });

  describe('deleteFileFromFirebase', () => {
    const mockFileURL = 'https://firebase.storage.googleapis.com/path/to/file.jpg';
    const mockFileRef = { name: 'mock-delete-ref' };

    beforeEach(() => {
      mockRef.mockReturnValue(mockFileRef as any);
      mockDeleteObject.mockResolvedValue(undefined);
    });

    it('should successfully delete file and log success message', async () => {
      await deleteFileFromFirebase(mockFileURL);

      expect(mockRef).toHaveBeenCalledWith(storage, mockFileURL);
      expect(mockDeleteObject).toHaveBeenCalledWith(mockFileRef);

    });

    it('should handle different file URLs', async () => {
      const differentURL = 'https://firebase.storage.googleapis.com/different/path.pdf';
      
      await deleteFileFromFirebase(differentURL);

      expect(mockRef).toHaveBeenCalledWith(storage, differentURL);
      expect(mockDeleteObject).toHaveBeenCalledWith(mockFileRef);
    });

    it('should handle ref creation error and log error message', async () => {
      const refError = new Error('Invalid file reference');
      mockRef.mockImplementation(() => {
        throw refError;
      });

      await deleteFileFromFirebase(mockFileURL);

      expect(console.error).toHaveBeenCalledWith(
        'Error eliminando el archivo:',
        refError
      );
    });

    it('should handle deleteObject failure and log error message', async () => {
      const deleteError = new Error('File not found');
      mockDeleteObject.mockRejectedValue(deleteError);

      await deleteFileFromFirebase(mockFileURL);

      expect(mockRef).toHaveBeenCalledWith(storage, mockFileURL);
      expect(mockDeleteObject).toHaveBeenCalledWith(mockFileRef);
      expect(console.error).toHaveBeenCalledWith(
        'Error eliminando el archivo:',
        deleteError
      );
    });

    it('should handle permission denied errors', async () => {
      const permissionError = new Error('Permission denied');
      permissionError.name = 'PermissionDeniedError';
      mockDeleteObject.mockRejectedValue(permissionError);

      await deleteFileFromFirebase(mockFileURL);

      expect(console.error).toHaveBeenCalledWith(
        'Error eliminando el archivo:',
        permissionError
      );
    });

    it('should handle file not found errors gracefully', async () => {
      const notFoundError = new Error('File not found');
      notFoundError.name = 'NotFoundError';
      mockDeleteObject.mockRejectedValue(notFoundError);

      await deleteFileFromFirebase(mockFileURL);

      expect(console.error).toHaveBeenCalledWith(
        'Error eliminando el archivo:',
        notFoundError
      );
    });

    it('should handle empty or malformed URLs', async () => {
      await deleteFileFromFirebase('');
      expect(mockRef).toHaveBeenCalledWith(storage, '');

      await deleteFileFromFirebase('invalid-url');
      expect(mockRef).toHaveBeenCalledWith(storage, 'invalid-url');
    });

    it('should not throw unhandled errors', async () => {
      const unexpectedError = new Error('Unexpected error');
      mockDeleteObject.mockRejectedValue(unexpectedError);

      await expect(deleteFileFromFirebase(mockFileURL)).resolves.toBeUndefined();
      expect(console.error).toHaveBeenCalledWith(
        'Error eliminando el archivo:',
        unexpectedError
      );
    });
  });

  describe('Integration scenarios', () => {
    it('should handle upload and delete cycle', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockURL = 'https://firebase.storage.googleapis.com/test.jpg';
      const mockFileRef = { name: 'test-ref' };

      // Setup mocks for upload
      mockV4.mockReturnValue('uuid-1234-5678');
      mockRef.mockReturnValue(mockFileRef as any);
      mockUploadBytes.mockResolvedValue({} as any);
      mockGetDownloadURL.mockResolvedValue(mockURL);

      // Upload file
      const uploadedURL = await getFileURL(mockFile, 'test');
      expect(uploadedURL).toBe(mockURL);

      // Reset mocks for delete
      jest.clearAllMocks();
      mockRef.mockReturnValue(mockFileRef as any);
      mockDeleteObject.mockResolvedValue(undefined);

      // Delete file
      await deleteFileFromFirebase(uploadedURL!);
      expect(mockDeleteObject).toHaveBeenCalled();
    });

    it('should handle multiple concurrent uploads', async () => {
      const files = [
        new File(['1'], 'file1.jpg', { type: 'image/jpeg' }),
        new File(['2'], 'file2.jpg', { type: 'image/jpeg' }),
        new File(['3'], 'file3.jpg', { type: 'image/jpeg' }),
      ];

      mockV4
        .mockReturnValueOnce('uuid1-2345')
        .mockReturnValueOnce('uuid2-3456')
        .mockReturnValueOnce('uuid3-4567');

      mockRef.mockReturnValue({ name: 'mock-ref' } as any);
      mockUploadBytes.mockResolvedValue({} as any);
      mockGetDownloadURL
        .mockResolvedValueOnce('url1')
        .mockResolvedValueOnce('url2')
        .mockResolvedValueOnce('url3');

      const promises = files.map(file => getFileURL(file, 'batch'));
      const results = await Promise.all(promises);

      expect(results).toEqual(['url1', 'url2', 'url3']);
      expect(mockUploadBytes).toHaveBeenCalledTimes(3);
    });

    it('should handle network timeout scenarios', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const timeoutError = new Error('Network timeout');
      timeoutError.name = 'NetworkError';
      
      mockUploadBytes.mockRejectedValue(timeoutError);

      const result = await getFileURL(mockFile, 'test');

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Error subiendo el archivo o obteniendo la URL:',
        timeoutError
      );
    });
  });
});