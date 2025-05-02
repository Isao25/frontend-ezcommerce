import { useCallback, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";

export interface UploadedImage {
  id: string; // ID local generado
  file: File; // Archivo local seleccionado
  preview: string; // URL de previsualización local
}

export const useImageUpload = (maxImages = 5) => {
  const [images, setImages] = useState<UploadedImage[]>([]);

  // Maneja la selección de archivos y crea previsualizaciones locales
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: UploadedImage[] = [];
    for (const file of Array.from(files)) {
      newImages.push({
        id: Math.random().toString(36).substr(2, 9), // Generar ID temporal único
        file,
        preview: URL.createObjectURL(file), // Previsualización local
      });
    }

    setImages((current) => {
      const updated = [...current, ...newImages];
      return updated.slice(0, maxImages); // Respetar el límite máximo de imágenes
    });
  }, [maxImages]);

  // Elimina una imagen localmente (incluyendo la previsualización)
  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const updated = prev.filter((image) => image.id !== id);
      // Limpia las URLs de previsualización para liberar memoria
      updated.forEach((image) => URL.revokeObjectURL(image.preview));
      return updated;
    });
  }, []);

  // Cambia el orden de las imágenes con arrastrar y soltar
  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImages((currentImages) => {
        const oldIndex = currentImages.findIndex((img) => img.id === active.id);
        const newIndex = currentImages.findIndex((img) => img.id === over.id);
        return arrayMove(currentImages, oldIndex, newIndex);
      });
    }
  }, []);

  return { images, setImages, handleFileUpload, removeImage, handleDragEnd };
};
